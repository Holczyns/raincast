"""Next start, the day's plan, the state of each zone and the water it used."""

from __future__ import annotations

from datetime import date, datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity, SensorStateClass
from homeassistant.const import EntityCategory, UnitOfTime, UnitOfVolume
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import CONF_MOWER, CONF_WATER_METER, CONF_WEATHER
from .engine import MowHold, ZoneStatus
from .entity import RainCastEntity, RainCastZoneEntity

WATERING = "watering"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    controller: list[SensorEntity] = [NextStartSensor(coordinator, "next_start"), PlannedSensor(coordinator, "planned")]
    if entry.data.get(CONF_WEATHER):
        controller += [RainHoursSensor(coordinator, "hours_since_rain"), RainHoursSensor(coordinator, "hours_to_rain")]
    if entry.data.get(CONF_MOWER):
        controller += [NextMowingSensor(coordinator, "next_mowing"), MowingStatusSensor(coordinator, "mowing")]
    async_add_entities(controller)
    metered = bool(entry.data.get(CONF_WATER_METER))
    for zone in coordinator.zones.values():
        entities: list[SensorEntity] = [
            ZoneStatusSensor(coordinator, zone, "status"),
            NextDueSensor(coordinator, zone, "next_due"),
            ZoneNextStartSensor(coordinator, zone, "next_start"),
        ]
        if metered:
            entities.append(WaterUsedSensor(coordinator, zone, "water_used"))
        async_add_entities(entities, config_subentry_id=zone.subentry_id)


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


class WaterUsedSensor(RainCastZoneEntity, SensorEntity):
    """Water metered for the zone over all its runs; suits the water section of the energy dashboard."""

    _attr_device_class = SensorDeviceClass.WATER
    _attr_native_unit_of_measurement = UnitOfVolume.LITERS
    _attr_state_class = SensorStateClass.TOTAL_INCREASING
    _attr_suggested_display_precision = 0

    @property
    def native_value(self) -> float:
        return round(self.coordinator.water_totals.get(self.zone_key, 0.0), 1)


class ZoneNextStartSensor(RainCastZoneEntity, SensorEntity):
    """Next automatic start of the zone; none while automatic watering is off or the start is off."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP

    @property
    def native_value(self) -> datetime | None:
        return self.coordinator.zone_starts.get(self.zone_key)


class RainHoursSensor(RainCastEntity, SensorEntity):
    """Hours since the last rain (0 while it rains), or until the next rain in the forecast."""

    _attr_device_class = SensorDeviceClass.DURATION
    _attr_native_unit_of_measurement = UnitOfTime.HOURS
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_suggested_display_precision = 1

    def __init__(self, coordinator, key: str) -> None:
        super().__init__(coordinator, key)
        self._key = key

    @property
    def native_value(self) -> float | None:
        return getattr(self.coordinator.mowing, self._key)


class NextMowingSensor(RainCastEntity, SensorEntity):
    """Next automatic start of the mower; none while automatic mowing is off."""

    _attr_device_class = SensorDeviceClass.TIMESTAMP

    @property
    def native_value(self) -> datetime | None:
        return self.coordinator.mowing.next_start


class MowingStatusSensor(RainCastEntity, SensorEntity):
    """Mowing now, ready to go out, or what would keep the mower in right now."""

    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = ["mowing", "ready", *(str(hold) for hold in MowHold)]

    @property
    def native_value(self) -> str:
        mowing = self.coordinator.mowing
        if mowing.mowing:
            return "mowing"
        hold = mowing.hold()
        return "ready" if hold is None else str(hold)
