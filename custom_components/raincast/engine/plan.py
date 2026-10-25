"""Which zones are watered on a given day, and why the others are not.

Rules, applied per zone in this order:
1. A zone is due when it was never watered or its interval has passed.
2. Frost holds every due zone, roofed or not: water left in pipes and
   heads freezes.
3. A due zone is held when its soil is wetter than its own soil limit.
   The soil value is the zone's own sensor, or the general sensor for a
   zone open to the sky; a roofed zone without its own sensor has none.
4. A due zone open to the sky is held when more rain is forecast than
   the rain limit.
5. An input that is not configured or has no value holds nothing, so
   watering follows the intervals alone.
6. Valves with a duration of 0 are left out; a zone without any valve
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
    FROST = "frost"
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
    soil_max: float = 100.0
    """Soil moisture in % above which the zone is held."""

    @property
    def minutes(self) -> float:
        return sum(slot.minutes for slot in self.valves if slot.minutes > 0)

    @property
    def active_valves(self) -> tuple[ValveSlot, ...]:
        return tuple(slot for slot in self.valves if slot.minutes > 0)


@dataclass(frozen=True, slots=True)
class Weather:
    """Inputs shared by all zones; None for one not configured or without a value."""

    rain: float | None
    """Rain forecast for the coming day in mm."""
    rain_max: float
    outdoor: float | None = None
    """Outdoor temperature in °C."""
    frost_min: float = 3.0
    """Outdoor temperature below which no zone is watered."""


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
    soil: float | None = None
    """Soil moisture the zone was judged on."""
    soil_max: float = 100.0

    @property
    def due(self) -> bool:
        return self.status is ZoneStatus.DUE


@dataclass(frozen=True, slots=True)
class Plan:
    zones: tuple[ZonePlan, ...]
    rain: float | None
    rain_max: float
    outdoor: float | None = None
    frost_min: float = 3.0

    @property
    def due(self) -> tuple[ZonePlan, ...]:
        return tuple(zone for zone in self.zones if zone.due)

    @property
    def skipped(self) -> tuple[ZonePlan, ...]:
        return tuple(zone for zone in self.zones if not zone.due)

    @property
    def minutes(self) -> float:
        return sum(zone.minutes for zone in self.due)

    def only(self, keys: list[str]) -> Plan:
        """The same plan for the given zones."""
        zones = tuple(zone for zone in self.zones if zone.key in keys)
        return Plan(zones, self.rain, self.rain_max, self.outdoor, self.frost_min)


def weather_hold(zone: ZoneConfig, soil: float | None, weather: Weather) -> ZoneStatus | None:
    """Reason a due zone is held today, None when the weather allows watering."""
    # 2. Frost, for every zone.
    frost = (weather.outdoor is not None) and (weather.outdoor < weather.frost_min)
    if frost:
        return ZoneStatus.FROST
    # 3. Soil before rain: wet soil is measured, rain is only forecast.
    soil_wet = (soil is not None) and (soil > zone.soil_max)
    if soil_wet:
        return ZoneStatus.WET_SOIL
    # 4. Rain, for zones open to the sky.
    rain_coming = (weather.rain is not None) and (weather.rain > weather.rain_max)
    if rain_coming and not zone.roofed:
        return ZoneStatus.RAIN_FORECAST
    return None


def zone_plan(
    zone: ZoneConfig, last_watered: date | None, soil: float | None, weather: Weather, today: date
) -> ZonePlan:
    days_since = None if last_watered is None else (today - last_watered).days
    next_due = today
    if last_watered is not None:
        next_due = max(last_watered + timedelta(days=zone.interval_days), today)

    # 6. No valve time, nothing to water.
    status = ZoneStatus.DUE
    if zone.minutes <= 0:
        status = ZoneStatus.NO_DURATION
    # 1. Interval.
    interval_passed = (days_since is None) or (days_since >= zone.interval_days)
    if (status is ZoneStatus.DUE) and not interval_passed:
        status = ZoneStatus.WAITING
    # 2. to 5. Weather.
    hold = weather_hold(zone, soil, weather)
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
        soil=soil,
        soil_max=zone.soil_max,
    )


def make_plan(
    zones: list[ZoneConfig],
    last_watered: dict[str, date | None],
    soil: dict[str, float | None],
    weather: Weather,
    today: date,
) -> Plan:
    """soil holds the moisture each zone is judged on, keyed by zone."""
    return Plan(
        zones=tuple(zone_plan(zone, last_watered.get(zone.key), soil.get(zone.key), weather, today) for zone in zones),
        rain=weather.rain,
        rain_max=weather.rain_max,
        outdoor=weather.outdoor,
        frost_min=weather.frost_min,
    )
