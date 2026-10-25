"""Valve control on/off."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .entity import RainCastEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([ControlSwitch(entry.runtime_data, "control")])


class ControlSwitch(RainCastEntity, SwitchEntity):
    """Off: dry run, the plan is computed and notified but no valve is opened."""

    @property
    def is_on(self) -> bool:
        return self.coordinator.control_active

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_control(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self.coordinator.async_set_control(False)
