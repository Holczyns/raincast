"""Which zones are watered on a given day, and why the others are not.

Rules, applied per zone in this order:
1. A zone is due when it was never watered or its interval has passed.
2. A due zone open to the sky is held when the soil is wetter than the
   soil limit or more rain is forecast than the rain limit.
3. A weather input that is not configured or has no value does not hold
   any zone, so watering follows the intervals alone.
4. Valves with a duration of 0 are left out; a zone without any valve
   time is never due.

Nothing is kept between calls; the plan is computed again from the
current values every time.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from enum import StrEnum


class ZoneStatus(StrEnum):
    DUE = "due"
    WAITING = "waiting"
    WET_SOIL = "wet_soil"
    RAIN_FORECAST = "rain_forecast"
    NO_DURATION = "no_duration"


@dataclass(frozen=True, slots=True)
class ValveSlot:
    entity_id: str
    minutes: float


@dataclass(frozen=True, slots=True)
class ZoneConfig:
    key: str
    name: str
    roofed: bool
    interval_days: int
    valves: tuple[ValveSlot, ...]

    @property
    def minutes(self) -> float:
        return sum(slot.minutes for slot in self.valves if slot.minutes > 0)

    @property
    def active_valves(self) -> tuple[ValveSlot, ...]:
        return tuple(slot for slot in self.valves if slot.minutes > 0)


@dataclass(frozen=True, slots=True)
class Weather:
    soil: float | None
    """Soil moisture in %, None when not configured or without a value."""
    rain: float | None
    """Rain forecast for the coming day in mm, None when not configured or without a value."""
    soil_max: float
    rain_max: float


@dataclass(frozen=True, slots=True)
class ZonePlan:
    key: str
    name: str
    status: ZoneStatus
    minutes: float
    valve_count: int
    days_since: int | None
    """Days since the last watering, None when never watered."""
    next_due: date
    """First day the zone is due again by its interval; today when it is due or held."""

    @property
    def due(self) -> bool:
        return self.status is ZoneStatus.DUE


@dataclass(frozen=True, slots=True)
class Plan:
    zones: tuple[ZonePlan, ...]
    soil: float | None
    rain: float | None
    soil_max: float
    rain_max: float

    @property
    def due(self) -> tuple[ZonePlan, ...]:
        return tuple(zone for zone in self.zones if zone.due)

    @property
    def skipped(self) -> tuple[ZonePlan, ...]:
        return tuple(zone for zone in self.zones if not zone.due)

    @property
    def minutes(self) -> float:
        return sum(zone.minutes for zone in self.due)


def weather_hold(weather: Weather) -> ZoneStatus | None:
    """Reason an unroofed due zone is held today, None when the weather allows watering."""
    # 2. Soil first: wet soil is measured, rain is only forecast.
    soil_wet = (weather.soil is not None) and (weather.soil > weather.soil_max)
    if soil_wet:
        return ZoneStatus.WET_SOIL
    rain_coming = (weather.rain is not None) and (weather.rain > weather.rain_max)
    if rain_coming:
        return ZoneStatus.RAIN_FORECAST
    return None


def zone_plan(zone: ZoneConfig, last_watered: date | None, weather: Weather, today: date) -> ZonePlan:
    days_since = None if last_watered is None else (today - last_watered).days
    next_due = today
    if last_watered is not None:
        next_due = max(last_watered + timedelta(days=zone.interval_days), today)

    # 4. No valve time, nothing to water.
    status = ZoneStatus.DUE
    if zone.minutes <= 0:
        status = ZoneStatus.NO_DURATION
    # 1. Interval.
    interval_passed = (days_since is None) or (days_since >= zone.interval_days)
    if (status is ZoneStatus.DUE) and not interval_passed:
        status = ZoneStatus.WAITING
    # 2. and 3. Weather, for zones open to the sky.
    hold = None if zone.roofed else weather_hold(weather)
    if (status is ZoneStatus.DUE) and (hold is not None):
        status = hold

    return ZonePlan(
        key=zone.key,
        name=zone.name,
        status=status,
        minutes=zone.minutes,
        valve_count=len(zone.active_valves),
        days_since=days_since,
        next_due=next_due,
    )


def make_plan(zones: list[ZoneConfig], last_watered: dict[str, date | None], weather: Weather, today: date) -> Plan:
    return Plan(
        zones=tuple(zone_plan(zone, last_watered.get(zone.key), weather, today) for zone in zones),
        soil=weather.soil,
        rain=weather.rain,
        soil_max=weather.soil_max,
        rain_max=weather.rain_max,
    )
