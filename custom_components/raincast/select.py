"""Start mode of each zone and the months of the watering season."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import SETTING_SEASON_END, SETTING_SEASON_START, SETTING_START_MODE
from .engine import StartMode
from .entity import RainCastEntity, RainCastZoneEntity

MONTHS = [str(month) for month in range(1, 13)]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities([SeasonSelect(coordinator, SETTING_SEASON_START), SeasonSelect(coordinator, SETTING_SEASON_END)])
    for zone in coordinator.zones.values():
        async_add_entities(
            [StartModeSelect(coordinator, zone, SETTING_START_MODE)], config_subentry_id=zone.subentry_id
        )


class SeasonSelect(RainCastEntity, SelectEntity):
    """First or last month of automatic watering; the options are month numbers."""

    _attr_entity_category = EntityCategory.CONFIG
    _attr_options = MONTHS

    def __init__(self, coordinator, key: str) -> None:
        super().__init__(coordinator, key)
        self._key = key

    @property
    def current_option(self) -> str:
        return str(self.coordinator.settings[self._key])

    async def async_select_option(self, option: str) -> None:
        self.coordinator.async_set_setting(self._key, int(option))


class StartModeSelect(RainCastZoneEntity, SelectEntity):
    _attr_entity_category = EntityCategory.CONFIG
    _attr_options = [str(mode) for mode in StartMode]

    @property
    def current_option(self) -> str:
        return str(self.coordinator.zone_tuning[self.zone_key][SETTING_START_MODE])

    async def async_select_option(self, option: str) -> None:
        self.coordinator.async_set_zone_setting(self.zone_key, SETTING_START_MODE, option)
