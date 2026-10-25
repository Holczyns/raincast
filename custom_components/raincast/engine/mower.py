"""Whether the mower may go out now, and the rain around it.

Rules, checked in this order; the first that holds keeps the mower in:
1. Frost: frozen grass breaks under the blades.
2. A zone that blocks mowing is being watered, or was watered today.
3. It rains now.
4. It rained less than dry_hours ago.
5. Rain is due in less than ahead_hours.
An input without a value holds nothing. Nothing is kept between calls.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import StrEnum

# Weather conditions that count as rain falling now.
RAINY_CONDITIONS = frozenset({"rainy", "pouring", "lightning-rainy", "snowy-rainy"})


class MowHold(StrEnum):
    FROST = "frost"
    WATERING = "watering"
    WATERED = "watered"
    RAINING = "raining"
    RAINED = "rained"
    RAIN_AHEAD = "rain_ahead"


@dataclass(frozen=True, slots=True)
class MowInputs:
    watering: bool
    """A zone that blocks mowing is being watered."""
    watered_today: bool
    """A zone that blocks mowing was watered today."""
    raining: bool | None
    hours_since_rain: float | None
    hours_to_rain: float | None
    dry_hours: float
    ahead_hours: float
    outdoor: float | None = None
    frost_min: float = 3.0


def mow_hold(inputs: MowInputs) -> MowHold | None:
    """Reason the mower stays in, None when it may go out."""
    # 1. Frost.
    frost = (inputs.outdoor is not None) and (inputs.outdoor < inputs.frost_min)
    if frost:
        return MowHold.FROST
    # 2. Watering.
    if inputs.watering:
        return MowHold.WATERING
    if inputs.watered_today:
        return MowHold.WATERED
    # 3. to 5. Rain now, behind and ahead.
    if inputs.raining:
        return MowHold.RAINING
    rained = (inputs.hours_since_rain is not None) and (inputs.hours_since_rain < inputs.dry_hours)
    if rained:
        return MowHold.RAINED
    rain_ahead = (inputs.hours_to_rain is not None) and (inputs.hours_to_rain < inputs.ahead_hours)
    if rain_ahead:
        return MowHold.RAIN_AHEAD
    return None


@dataclass(frozen=True, slots=True)
class ForecastHour:
    start: datetime
    precipitation: float | None


def hours_to_rain(forecast: list[ForecastHour], now: datetime) -> float | None:
    """Hours until the first forecast hour with rain; 0 when it rains this hour, None without rain ahead."""
    for hour in forecast:
        wet = (hour.precipitation is not None) and (hour.precipitation > 0)
        if wet and (hour.start + timedelta(hours=1) > now):
            return max((hour.start - now).total_seconds() / 3600, 0.0)
    return None
