"""When a zone starts, and whether automatic watering is in season.

Two modes start once a day: a number of hours before sunrise, or at a
fixed local time. A start that falls on the current moment or earlier
moves to the next day. The season is a range of months, inclusive, and
may run over the new year. Nothing is kept between calls.
"""

from __future__ import annotations

from collections.abc import Callable
from datetime import date, datetime, time, timedelta
from enum import StrEnum


class StartMode(StrEnum):
    BEFORE_SUNRISE = "before_sunrise"
    AT_TIME = "at_time"
    OFF = "off"


def next_start(
    mode: StartMode,
    now: datetime,
    *,
    sunrise_after: Callable[[datetime], datetime],
    offset_h: float,
    at: time,
) -> datetime | None:
    """Next start after now; now has to carry the local time zone."""
    if mode is StartMode.AT_TIME:
        start = datetime.combine(now.date(), at, tzinfo=now.tzinfo)
        if start <= now:
            start = datetime.combine(now.date() + timedelta(days=1), at, tzinfo=now.tzinfo)
        return start

    if mode is StartMode.BEFORE_SUNRISE:
        offset = timedelta(hours=offset_h)
        sunrise = sunrise_after(now)
        # Between today's start and sunrise the next start belongs to tomorrow's sunrise.
        if sunrise - offset <= now:
            sunrise = sunrise_after(sunrise + timedelta(minutes=1))
        return sunrise - offset

    return None


def in_season(day: date, first_month: int, last_month: int) -> bool:
    """Whether the day falls in the season; first 10 and last 3 is October to March."""
    if first_month <= last_month:
        return first_month <= day.month <= last_month
    return (day.month >= first_month) or (day.month <= last_month)
