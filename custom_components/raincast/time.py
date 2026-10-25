"""Start time of each zone and of the mower, used in the fixed time mode."""

from __future__ import annotations

from datetime import time

from homeassistant.components.time import TimeEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import CONF_MOWER, SETTING_MOWER_START_TIME, SETTING_START_TIME
from .entity import RainCastEntity, RainCastZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    if entry.data.get(CONF_MOWER):
        async_add_entities([MowerStartTime(coordinator, SETTING_MOWER_START_TIME)])
    for zone in coordinator.zones.values():
        async_add_entities([StartTime(coordinator, zone, SETTING_START_TIME)], config_subentry_id=zone.subentry_id)


class StartTime(RainCastZoneEntity, TimeEntity):
    _attr_entity_category = EntityCategory.CONFIG

    @property
    def native_value(self) -> time:
        return time.fromisoformat(str(self.coordinator.zone_tuning[self.zone_key][SETTING_START_TIME]))

    async def async_set_value(self, value: time) -> None:
        self.coordinator.async_set_zone_setting(
            self.zone_key, SETTING_START_TIME, value.replace(microsecond=0).isoformat()
        )


class MowerStartTime(RainCastEntity, TimeEntity):
    _attr_entity_category = EntityCategory.CONFIG

    @property
    def native_value(self) -> time:
        return time.fromisoformat(str(self.coordinator.settings[SETTING_MOWER_START_TIME]))

    async def async_set_value(self, value: time) -> None:
        self.coordinator.async_set_setting(SETTING_MOWER_START_TIME, value.replace(microsecond=0).isoformat())
