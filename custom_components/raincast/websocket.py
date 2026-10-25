"""Websocket commands used by the RainCast panel.

Reading and starting a manual run are open to every user, as the run buttons
are; every change of the configuration requires an administrator.
Changes go through the config entry and its zone subentries, exactly as
the setup wizard stores them, so the entry reloads afterwards. The panel
finds entities by key, so it does not depend on entity naming.
"""

from __future__ import annotations

from types import MappingProxyType
from typing import Any

import probatio
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.core import HomeAssistant, callback, split_entity_id
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er

from .const import (
    CONF_DURATION,
    CONF_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_RAIN_SENSOR,
    CONF_ROOFED,
    CONF_SOIL_SENSOR,
    CONF_VALVES,
    CONF_WATER_METER,
    DEFAULT_DURATION,
    DEFAULT_INTERVAL,
    DOMAIN,
    SUBENTRY_ZONE,
)
from .problems import notify_services

SOURCE_DOMAINS = ("sensor", "input_number")
VALVE_DOMAINS = ("valve", "switch", "input_boolean")
SOURCE_FIELDS = (CONF_SOIL_SENSOR, CONF_RAIN_SENSOR, CONF_WATER_METER)


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    for command in (
        ws_entries,
        ws_run_zone,
        ws_set_options,
        ws_update_sources,
        ws_add_zone,
        ws_update_zone,
        ws_remove_zone,
    ):
        websocket_api.async_register_command(hass, command)


def _describe(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, Any]:
    registry = er.async_get(hass)
    controller: dict[str, str] = {}
    zones: dict[str, dict[str, Any]] = {
        subentry_id: {
            "id": subentry_id,
            "name": subentry.title,
            "valves": list(subentry.data.get(CONF_VALVES, [])),
            "roofed": bool(subentry.data.get(CONF_ROOFED, False)),
            "entities": {},
        }
        for subentry_id, subentry in entry.subentries.items()
        if subentry.subentry_type == SUBENTRY_ZONE
    }
    for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
        owner, _, key = entity.unique_id.partition("_")
        if owner == entry.entry_id:
            controller[key] = entity.entity_id
        elif owner in zones:
            zones[owner]["entities"][key] = entity.entity_id
    coordinator = getattr(entry, "runtime_data", None)
    return {
        "entry_id": entry.entry_id,
        "title": entry.title,
        "notify_service": entry.options.get(CONF_NOTIFY_SERVICE),
        "notify_services": notify_services(hass),
        "sources": {key: entry.data.get(key) for key in SOURCE_FIELDS},
        "entities": controller,
        "zones": list(zones.values()),
        "log": list(reversed(coordinator.log)) if coordinator else [],
    }


def _entry(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> ConfigEntry | None:
    entry = hass.config_entries.async_get_entry(msg["entry_id"])
    if (entry is None) or (entry.domain != DOMAIN):
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown RainCast entry")
        return None
    return entry


def _zone(entry: ConfigEntry, zone_id: str) -> ConfigSubentry | None:
    subentry = entry.subentries.get(zone_id)
    if (subentry is None) or (subentry.subentry_type != SUBENTRY_ZONE):
        return None
    return subentry


def _entity_error(hass: HomeAssistant, entity_id: str, domains: tuple[str, ...]) -> str | None:
    exists = hass.states.get(entity_id) is not None
    domain_allowed = split_entity_id(entity_id)[0] in domains
    if exists and domain_allowed:
        return None
    return f"{entity_id} is not a known {'/'.join(domains)} entity"


def _valve_errors(hass: HomeAssistant, valves: list[str]) -> list[str]:
    if not valves:
        return ["pick at least one valve"]
    errors = [error for valve in valves if (error := _entity_error(hass, valve, VALVE_DOMAINS))]
    if len(set(valves)) != len(valves):
        errors.append("a valve is listed twice")
    return errors


ENTITY_VALUE = probatio.Any(str, None)


@websocket_api.websocket_command({probatio.Required("type"): "raincast/entries"})
@callback
def ws_entries(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entries = [_describe(hass, entry) for entry in hass.config_entries.async_loaded_entries(DOMAIN)]
    connection.send_result(msg["id"], entries)


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "raincast/set_options",
        probatio.Required("entry_id"): str,
        probatio.Required(CONF_NOTIFY_SERVICE): probatio.Any(str, None),
    }
)
@callback
def ws_set_options(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Same options as the options flow; the entry reloads through its update listener."""
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    service = msg[CONF_NOTIFY_SERVICE]
    if service and not hass.services.has_service("notify", service):
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, f"notify.{service} does not exist")
        return
    options = {key: value for key, value in entry.options.items() if key != CONF_NOTIFY_SERVICE}
    if service:
        options[CONF_NOTIFY_SERVICE] = service
    hass.config_entries.async_update_entry(entry, options=options)
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "raincast/update_sources",
        probatio.Required("entry_id"): str,
        **{probatio.Optional(key): ENTITY_VALUE for key in SOURCE_FIELDS},
    }
)
@callback
def ws_update_sources(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Replace the weather inputs and the water meter; a field not sent or empty is cleared."""
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    errors = [
        error for key in SOURCE_FIELDS if msg.get(key) and (error := _entity_error(hass, msg[key], SOURCE_DOMAINS))
    ]
    if errors:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "; ".join(errors))
        return
    data = {key: value for key, value in entry.data.items() if key not in SOURCE_FIELDS}
    data.update({key: msg[key] for key in SOURCE_FIELDS if msg.get(key)})
    hass.config_entries.async_update_entry(entry, data=data)
    connection.send_result(msg["id"])


ZONE_SCHEMA = {
    probatio.Required("entry_id"): str,
    probatio.Required("name"): probatio.All(str, probatio.Length(min=1, max=60)),
    probatio.Required(CONF_VALVES): [str],
    probatio.Required(CONF_ROOFED): bool,
}


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "raincast/add_zone",
        **ZONE_SCHEMA,
        probatio.Optional(CONF_INTERVAL, default=DEFAULT_INTERVAL): probatio.All(
            probatio.Coerce(int), probatio.Range(min=1, max=30)
        ),
        probatio.Optional(CONF_DURATION, default=DEFAULT_DURATION): probatio.All(
            probatio.Coerce(float), probatio.Range(min=1, max=240)
        ),
    }
)
@callback
def ws_add_zone(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    errors = _valve_errors(hass, msg[CONF_VALVES])
    if errors:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "; ".join(errors))
        return
    data = {key: msg[key] for key in (CONF_VALVES, CONF_ROOFED, CONF_INTERVAL, CONF_DURATION)}
    subentry = ConfigSubentry(
        data=MappingProxyType(data), subentry_type=SUBENTRY_ZONE, title=msg["name"].strip(), unique_id=None
    )
    hass.config_entries.async_add_subentry(entry, subentry)
    connection.send_result(msg["id"], {"zone_id": subentry.subentry_id})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {probatio.Required("type"): "raincast/update_zone", probatio.Required("zone_id"): str, **ZONE_SCHEMA}
)
@callback
def ws_update_zone(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Rename a zone or change its valves; interval and valve times stay as they are."""
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    subentry = _zone(entry, msg["zone_id"])
    if subentry is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown zone")
        return
    errors = _valve_errors(hass, msg[CONF_VALVES])
    if errors:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "; ".join(errors))
        return
    data = {**subentry.data, CONF_VALVES: msg[CONF_VALVES], CONF_ROOFED: msg[CONF_ROOFED]}
    hass.config_entries.async_update_subentry(entry, subentry, data=data, title=msg["name"].strip())
    connection.send_result(msg["id"])


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        probatio.Required("type"): "raincast/remove_zone",
        probatio.Required("entry_id"): str,
        probatio.Required("zone_id"): str,
    }
)
@callback
def ws_remove_zone(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    if _zone(entry, msg["zone_id"]) is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown zone")
        return
    hass.config_entries.async_remove_subentry(entry, msg["zone_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        probatio.Required("type"): "raincast/run_zone",
        probatio.Required("entry_id"): str,
        probatio.Required("zone_id"): str,
        probatio.Required("minutes"): {str: probatio.All(probatio.Coerce(float), probatio.Range(min=0, max=240))},
    }
)
@websocket_api.async_response
async def ws_run_zone(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Water one zone now with the given valve times; valves of other zones are ignored."""
    entry = _entry(hass, connection, msg)
    if entry is None:
        return
    zone = _zone(entry, msg["zone_id"])
    if zone is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown zone")
        return
    valves = zone.data.get(CONF_VALVES, [])
    minutes = {valve: value for valve, value in msg["minutes"].items() if valve in valves}
    try:
        await entry.runtime_data.async_run_zone(zone.subentry_id, minutes)
    except HomeAssistantError as err:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, str(err))
        return
    connection.send_result(msg["id"])
