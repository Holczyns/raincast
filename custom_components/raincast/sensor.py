"""Next start, the day's plan and the state of each zone."""

from __future__ import annotations

from datetime import date, datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.const import UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .engine import ZoneStatus
from .entity import RainCastEntity, RainCastZoneEntity

WATERING = "watering"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities([NextStartSensor(coordinator, "next_start"), PlannedSensor(coordinator, "planned")])
    for zone in coordinator.zones.values():
        async_add_entities(
            [ZoneStatusSensor(coordinator, zone, "status"), NextDueSensor(coordinator, zone, "next_due")],
            config_subentry_id=zone.subentry_id,
        )


class NextStartSensor(RainCastEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.TIMESTAMP

    @property
    def native_value(self) -> datetime | None:
        return self.coordinator.next_start


class PlannedSensor(RainCastEntity, SensorEntity):
    """Minutes the due zones need if the run started now; the zones are attributes."""

    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES

    @property
    def native_value(self) -> float:
        return round(self.coordinator.data.minutes)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        plan = self.coordinator.data
        return {
            "due": [zone.name for zone in plan.due],
            "skipped": {zone.name: str(zone.status) for zone in plan.skipped},
        }


class ZoneStatusSensor(RainCastZoneEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [WATERING, *(str(status) for status in ZoneStatus)]

    @property
    def native_value(self) -> str | None:
        run = self.coordinator.run
        if (run is not None) and (run.zone == self.zone_key):
            return WATERING
        plan = self.zone_plan
        return str(plan.status) if plan else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        plan = self.zone_plan
        if plan is None:
            return {}
        return {"minutes": round(plan.minutes), "valves": plan.valve_count, "days_since": plan.days_since}


class NextDueSensor(RainCastZoneEntity, SensorEntity):
    """First day the zone is due by its interval; the weather can still hold it then."""

    _attr_device_class = SensorDeviceClass.DATE

    @property
    def native_value(self) -> date | None:
        plan = self.zone_plan
        return plan.next_due if plan else None
