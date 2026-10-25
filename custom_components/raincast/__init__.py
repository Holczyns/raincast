"""RainCast: weather-aware irrigation scheduling."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.typing import ConfigType

from .const import CONF_OUTDOOR_SENSOR, CONF_ROOFED, CONF_SOIL_SENSOR, CONF_WATER_METER, DOMAIN
from .coordinator import RainCastCoordinator
from .entity import controller_device_info
from .frontend import async_register_frontend
from .problems import async_clear_issues
from .websocket import async_register_commands

PLATFORMS = (
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.DATE,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SENSOR,
    Platform.SWITCH,
    Platform.TIME,
)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type RainCastConfigEntry = ConfigEntry[RainCastCoordinator]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    async_register_commands(hass)
    await async_register_frontend(hass)
    return True


async def async_migrate_entry(hass: HomeAssistant, entry: RainCastConfigEntry) -> bool:
    """Version 1 had a general soil sensor; it becomes the own sensor of the zones that used it."""
    if entry.version > 2:
        return False
    if entry.version == 1:
        general = entry.data.get(CONF_SOIL_SENSOR)
        for subentry in list(entry.subentries.values()):
            uses_general = general and not subentry.data.get(CONF_SOIL_SENSOR) and not subentry.data.get(CONF_ROOFED)
            if uses_general:
                hass.config_entries.async_update_subentry(
                    entry, subentry, data={**subentry.data, CONF_SOIL_SENSOR: general}
                )
        data = {key: value for key, value in entry.data.items() if key != CONF_SOIL_SENSOR}
        hass.config_entries.async_update_entry(entry, data=data, version=2)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: RainCastConfigEntry) -> bool:
    coordinator = RainCastCoordinator(hass, entry)
    # Zone devices hang below the controller device, so it has to exist first.
    controller = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, **controller_device_info(entry))
    coordinator.device_id = controller.id
    await coordinator.async_setup()
    _remove_stale_entities(hass, entry)
    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    # Adding, editing or removing a zone changes the entity set.
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: RainCastConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.async_shutdown()
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: RainCastConfigEntry) -> None:
    async_clear_issues(hass, entry)


def _remove_stale_entities(hass: HomeAssistant, entry: RainCastConfigEntry) -> None:
    """Entities of moved settings, and of a meter or outdoor sensor no longer set, leave the registry."""
    stale = {f"{entry.entry_id}_{key}" for key in ("start_mode", "start_time", "sunrise_offset", "soil_max")}
    if not entry.data.get(CONF_OUTDOOR_SENSOR):
        stale.add(f"{entry.entry_id}_frost_min")
    metered = bool(entry.data.get(CONF_WATER_METER))
    registry = er.async_get(hass)
    for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
        meter_entity = ("_max_flow_" in entity.unique_id) or entity.unique_id.endswith("_water_used")
        if (entity.unique_id in stale) or (meter_entity and not metered):
            registry.async_remove(entity.entity_id)


async def _async_reload(hass: HomeAssistant, entry: RainCastConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)
