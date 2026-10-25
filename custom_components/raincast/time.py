"""Start time used in the fixed time mode."""

from __future__ import annotations

from datetime import time

from homeassistant.components.time import TimeEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import SETTING_START_TIME
from .entity import RainCastEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([StartTime(entry.runtime_data, SETTING_START_TIME)])


class StartTime(RainCastEntity, TimeEntity):
    _attr_entity_category = EntityCategory.CONFIG

    @property
    def native_value(self) -> time:
        return time.fromisoformat(str(self.coordinator.settings[SETTING_START_TIME]))

    async def async_set_value(self, value: time) -> None:
        self.coordinator.async_set_setting(SETTING_START_TIME, value.replace(microsecond=0).isoformat())
