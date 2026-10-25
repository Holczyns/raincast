"""RainCast: weather-aware irrigation scheduling."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
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


async def async_setup_entry(hass: HomeAssistant, entry: RainCastConfigEntry) -> bool:
    coordinator = RainCastCoordinator(hass, entry)
    # Zone devices hang below the controller device, so it has to exist first.
    controller = dr.async_get(hass).async_get_or_create(config_entry_id=entry.entry_id, **controller_device_info(entry))
    coordinator.device_id = controller.id
    await coordinator.async_setup()
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


async def _async_reload(hass: HomeAssistant, entry: RainCastConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)
