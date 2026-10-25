"""Valve control, automatic watering and automatic mowing on/off."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import CONF_MOWER, SETTING_AUTOMATIC, SETTING_AUTOMATIC_MOWING
from .entity import RainCastEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    switches: list[SwitchEntity] = [
        ControlSwitch(coordinator, "control"),
        SettingSwitch(coordinator, SETTING_AUTOMATIC),
    ]
    if entry.data.get(CONF_MOWER):
        switches.append(SettingSwitch(coordinator, SETTING_AUTOMATIC_MOWING))
    async_add_entities(switches)


class ControlSwitch(RainCastEntity, SwitchEntity):
    """Off: dry run, the plan is computed and notified but no valve is opened."""

    @property
    def is_on(self) -> bool:
        return self.coordinator.control_active

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_control(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_control(False)


class SettingSwitch(RainCastEntity, SwitchEntity):
    """Main switch of the daily starts of the zones, or of the mower; manual runs work regardless."""

    def __init__(self, coordinator, key: str) -> None:
        super().__init__(coordinator, key)
        self._key = key

    @property
    def is_on(self) -> bool:
        return bool(self.coordinator.settings[self._key])

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.coordinator.async_set_setting(self._key, True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.coordinator.async_set_setting(self._key, False)
