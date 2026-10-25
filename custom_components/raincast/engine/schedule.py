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
    SUNRISE = "sunrise"
    SUNSET = "sunset"
    AT_TIME = "at_time"
    OFF = "off"


def next_start(
    mode: StartMode,
    now: datetime,
    *,
    sunrise_after: Callable[[datetime], datetime],
    offset_h: float,
    at: time,
    sunset_after: Callable[[datetime], datetime] | None = None,
) -> datetime | None:
    """Next start after now; now has to carry the local time zone.

    BEFORE_SUNRISE starts offset_h hours before sunrise; SUNRISE and SUNSET
    start offset_h hours after the event, earlier for a negative offset.
    """
    if mode is StartMode.AT_TIME:
        start = datetime.combine(now.date(), at, tzinfo=now.tzinfo)
        if start <= now:
            start = datetime.combine(now.date() + timedelta(days=1), at, tzinfo=now.tzinfo)
        return start

    event_after = sunset_after if mode is StartMode.SUNSET else sunrise_after
    shift = timedelta(hours=-offset_h if mode is StartMode.BEFORE_SUNRISE else offset_h)
    if (mode is StartMode.OFF) or (event_after is None):
        return None
    # The event whose start is still ahead: today's when its start has not passed yet.
    return event_after(now - shift) + shift


def in_season(day: date, first_month: int, last_month: int) -> bool:
    """Whether the day falls in the season; first 10 and last 3 is October to March."""
    if first_month <= last_month:
        return first_month <= day.month <= last_month
    return (day.month >= first_month) or (day.month <= last_month)
