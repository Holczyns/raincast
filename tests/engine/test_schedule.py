from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from engine.schedule import StartMode, in_season, next_start

WARSAW = ZoneInfo("Europe/Warsaw")


def sunrise_after(moment: datetime) -> datetime:
    """Sunrise at 06:00 local every day."""
    sunrise = datetime.combine(moment.date(), time(6, 0), tzinfo=WARSAW)
    if sunrise <= moment:
        sunrise = datetime.combine(moment.date() + timedelta(days=1), time(6, 0), tzinfo=WARSAW)
    return sunrise


def start(mode, now, offset_h=2.0, at=time(5, 30)):
    return next_start(mode, now, sunrise_after=sunrise_after, offset_h=offset_h, at=at)


def test_before_sunrise_today():
    now = datetime(2026, 6, 10, 1, 0, tzinfo=WARSAW)
    assert start(StartMode.BEFORE_SUNRISE, now) == datetime(2026, 6, 10, 4, 0, tzinfo=WARSAW)


def test_before_sunrise_after_todays_start_moves_to_tomorrow():
    now = datetime(2026, 6, 10, 4, 30, tzinfo=WARSAW)
    assert start(StartMode.BEFORE_SUNRISE, now) == datetime(2026, 6, 11, 4, 0, tzinfo=WARSAW)


def test_before_sunrise_in_the_evening():
    now = datetime(2026, 6, 10, 21, 0, tzinfo=WARSAW)
    assert start(StartMode.BEFORE_SUNRISE, now) == datetime(2026, 6, 11, 4, 0, tzinfo=WARSAW)


def test_fixed_time_today_and_tomorrow():
    assert start(StartMode.AT_TIME, datetime(2026, 6, 10, 5, 0, tzinfo=WARSAW)) == datetime(
        2026, 6, 10, 5, 30, tzinfo=WARSAW
    )
    assert start(StartMode.AT_TIME, datetime(2026, 6, 10, 5, 30, tzinfo=WARSAW)) == datetime(
        2026, 6, 11, 5, 30, tzinfo=WARSAW
    )


def test_fixed_time_keeps_local_time_across_dst():
    now = datetime(2026, 10, 24, 12, 0, tzinfo=WARSAW)
    result = start(StartMode.AT_TIME, now, at=time(6, 0))
    assert result == datetime(2026, 10, 25, 6, 0, tzinfo=WARSAW)
    assert result.utcoffset() == timedelta(hours=1)


def test_off_has_no_start():
    assert start(StartMode.OFF, datetime(2026, 6, 10, 1, 0, tzinfo=WARSAW)) is None


def test_season_within_a_year():
    assert in_season(date(2026, 4, 1), 4, 10)
    assert in_season(date(2026, 10, 31), 4, 10)
    assert not in_season(date(2026, 11, 1), 4, 10)
    assert not in_season(date(2026, 3, 31), 4, 10)


def test_season_over_the_new_year():
    assert in_season(date(2026, 12, 15), 10, 3)
    assert in_season(date(2027, 2, 1), 10, 3)
    assert not in_season(date(2026, 6, 1), 10, 3)


def sunset_after(moment: datetime) -> datetime:
    """Sunset at 20:00 local every day."""
    sunset = datetime.combine(moment.date(), time(20, 0), tzinfo=WARSAW)
    if sunset <= moment:
        sunset = datetime.combine(moment.date() + timedelta(days=1), time(20, 0), tzinfo=WARSAW)
    return sunset


def event_start(mode, now, offset_h):
    return next_start(
        mode, now, sunrise_after=sunrise_after, sunset_after=sunset_after, offset_h=offset_h, at=time(5, 30)
    )


def test_hours_after_sunrise_later_the_same_day():
    now = datetime(2026, 6, 10, 8, 0, tzinfo=WARSAW)
    assert event_start(StartMode.SUNRISE, now, 4) == datetime(2026, 6, 10, 10, 0, tzinfo=WARSAW)
    later = datetime(2026, 6, 10, 10, 30, tzinfo=WARSAW)
    assert event_start(StartMode.SUNRISE, later, 4) == datetime(2026, 6, 11, 10, 0, tzinfo=WARSAW)


def test_before_and_after_sunset():
    now = datetime(2026, 6, 10, 12, 0, tzinfo=WARSAW)
    assert event_start(StartMode.SUNSET, now, -3) == datetime(2026, 6, 10, 17, 0, tzinfo=WARSAW)
    assert event_start(StartMode.SUNSET, now, 1) == datetime(2026, 6, 10, 21, 0, tzinfo=WARSAW)
