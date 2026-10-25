"""Start mode of the daily run."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import SETTING_START_MODE
from .engine import StartMode
from .entity import RainCastEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([StartModeSelect(entry.runtime_data, SETTING_START_MODE)])


class StartModeSelect(RainCastEntity, SelectEntity):
    _attr_entity_category = EntityCategory.CONFIG
    _attr_options = [str(mode) for mode in StartMode]

    @property
    def current_option(self) -> str:
        return str(self.coordinator.settings[SETTING_START_MODE])

    async def async_select_option(self, option: str) -> None:
        self.coordinator.async_set_setting(SETTING_START_MODE, option)
