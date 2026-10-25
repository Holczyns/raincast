"""Websocket commands for the RainCast panel.

Reading is open to every user. The panel finds entities by key, so it
does not depend on entity naming.
"""

from __future__ import annotations

from typing import Any

import probatio
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .const import (
    CONF_NOTIFY_SERVICE,
    CONF_RAIN_SENSOR,
    CONF_ROOFED,
    CONF_SOIL_SENSOR,
    CONF_VALVES,
    DOMAIN,
    SUBENTRY_ZONE,
)


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_entries)


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
        "sources": {key: entry.data.get(key) for key in (CONF_SOIL_SENSOR, CONF_RAIN_SENSOR)},
        "entities": controller,
        "zones": list(zones.values()),
        "log": list(reversed(coordinator.log)) if coordinator else [],
    }


@websocket_api.websocket_command({probatio.Required("type"): "raincast/entries"})
@callback
def ws_entries(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entries = [_describe(hass, entry) for entry in hass.config_entries.async_loaded_entries(DOMAIN)]
    connection.send_result(msg["id"], entries)
