"""Last watering day of each zone; editable to correct or carry over a date."""

from __future__ import annotations

from datetime import date

from homeassistant.components.date import DateEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .entity import RainCastZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    for zone in coordinator.zones.values():
        async_add_entities([LastWatered(coordinator, zone, "last_watered")], config_subentry_id=zone.subentry_id)


class LastWatered(RainCastZoneEntity, DateEntity):
    @property
    def native_value(self) -> date | None:
        return self.coordinator.last_watered.get(self.zone_key)

    async def async_set_value(self, value: date) -> None:
        self.coordinator.async_set_last_watered(self.zone_key, value)
