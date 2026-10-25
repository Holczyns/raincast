"""Start mode of each zone and of the mower, and the months of the seasons."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import (
    CONF_MOWER,
    SETTING_MOWER_SEASON_END,
    SETTING_MOWER_SEASON_START,
    SETTING_MOWER_START_MODE,
    SETTING_SEASON_END,
    SETTING_SEASON_START,
    SETTING_START_MODE,
)
from .engine import StartMode
from .entity import RainCastEntity, RainCastZoneEntity

MONTHS = [str(month) for month in range(1, 13)]
ZONE_MODES = [str(StartMode.BEFORE_SUNRISE), str(StartMode.AT_TIME), str(StartMode.OFF)]
MOWER_MODES = [str(StartMode.SUNRISE), str(StartMode.SUNSET), str(StartMode.AT_TIME), str(StartMode.OFF)]


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    selects: list[SelectEntity] = [
        SettingSelect(coordinator, SETTING_SEASON_START, MONTHS),
        SettingSelect(coordinator, SETTING_SEASON_END, MONTHS),
    ]
    if entry.data.get(CONF_MOWER):
        selects += [
            SettingSelect(coordinator, SETTING_MOWER_START_MODE, MOWER_MODES),
            SettingSelect(coordinator, SETTING_MOWER_SEASON_START, MONTHS),
            SettingSelect(coordinator, SETTING_MOWER_SEASON_END, MONTHS),
        ]
    async_add_entities(selects)
    for zone in coordinator.zones.values():
        async_add_entities(
            [StartModeSelect(coordinator, zone, SETTING_START_MODE)], config_subentry_id=zone.subentry_id
        )


class SettingSelect(RainCastEntity, SelectEntity):
    """A controller setting: a season month (stored as a number) or the mower's start mode."""

    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, coordinator, key: str, options: list[str]) -> None:
        super().__init__(coordinator, key)
        self._key = key
        self._attr_options = options

    @property
    def current_option(self) -> str:
        return str(self.coordinator.settings[self._key])

    async def async_select_option(self, option: str) -> None:
        value: str | int = int(option) if self._attr_options is MONTHS else option
        self.coordinator.async_set_setting(self._key, value)


class StartModeSelect(RainCastZoneEntity, SelectEntity):
    _attr_entity_category = EntityCategory.CONFIG
    _attr_options = ZONE_MODES

    @property
    def current_option(self) -> str:
        return str(self.coordinator.zone_tuning[self.zone_key][SETTING_START_MODE])

    async def async_select_option(self, option: str) -> None:
        self.coordinator.async_set_zone_setting(self.zone_key, SETTING_START_MODE, option)
