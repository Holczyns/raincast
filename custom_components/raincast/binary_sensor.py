"""Run in progress, problems and rain falling now."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorDeviceClass, BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import CONF_WEATHER
from .entity import RainCastEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    sensors: list[BinarySensorEntity] = [RunningSensor(coordinator, "running"), ProblemSensor(coordinator, "problem")]
    if entry.data.get(CONF_WEATHER):
        sensors.append(RainingSensor(coordinator, "raining"))
    async_add_entities(sensors)


class RunningSensor(RainCastEntity, BinarySensorEntity):
    """On while a run is in progress; the zone and valve watering now are attributes."""

    _attr_device_class = BinarySensorDeviceClass.RUNNING

    @property
    def is_on(self) -> bool:
        return self.coordinator.running

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        run = self.coordinator.run
        if run is None:
            return {}
        zone = self.coordinator.zones.get(run.zone or "")
        return {
            "reason": run.reason,
            "started": run.started.isoformat(),
            "zone": zone.title if zone else None,
            "valve": run.valve,
            "valve_ends": run.valve_ends.isoformat() if run.valve_ends else None,
        }


class ProblemSensor(RainCastEntity, BinarySensorEntity):
    """On while any fault is reported; the faults are listed as an attribute."""

    _attr_device_class = BinarySensorDeviceClass.PROBLEM

    @property
    def is_on(self) -> bool:
        return bool(self.coordinator.faults.active)

    @property
    def extra_state_attributes(self) -> dict[str, list[str]]:
        return {"problems": sorted(str(fault) for fault in self.coordinator.faults.active)}


class RainingSensor(RainCastEntity, BinarySensorEntity):
    """On while the weather entity reports rain."""

    _attr_device_class = BinarySensorDeviceClass.MOISTURE

    @property
    def is_on(self) -> bool | None:
        return self.coordinator.mowing.raining
