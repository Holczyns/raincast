from datetime import datetime, timedelta

from engine.mower import ForecastHour, MowHold, MowInputs, hours_to_rain, mow_hold

NOW = datetime(2026, 6, 10, 10, 0)


def inputs(**overrides):
    values = {
        "watering": False,
        "watered_today": False,
        "raining": False,
        "hours_since_rain": 40.0,
        "hours_to_rain": None,
        "dry_hours": 12.0,
        "ahead_hours": 2.0,
        "outdoor": 18.0,
        "frost_min": 3.0,
    }
    values.update(overrides)
    return MowInputs(**values)


def test_dry_day_mows():
    assert mow_hold(inputs()) is None


def test_each_reason_holds():
    assert mow_hold(inputs(outdoor=1.0)) is MowHold.FROST
    assert mow_hold(inputs(watering=True)) is MowHold.WATERING
    assert mow_hold(inputs(watered_today=True)) is MowHold.WATERED
    assert mow_hold(inputs(raining=True)) is MowHold.RAINING
    assert mow_hold(inputs(hours_since_rain=11.5)) is MowHold.RAINED
    assert mow_hold(inputs(hours_to_rain=1.5)) is MowHold.RAIN_AHEAD


def test_limits_themselves_do_not_hold():
    assert mow_hold(inputs(hours_since_rain=12.0, hours_to_rain=2.0, outdoor=3.0)) is None


def test_unknown_rain_holds_nothing():
    assert mow_hold(inputs(raining=None, hours_since_rain=None, hours_to_rain=None, outdoor=None)) is None


def test_hours_to_rain():
    forecast = [
        ForecastHour(NOW.replace(minute=0), 0.0),
        ForecastHour(NOW + timedelta(hours=1), None),
        ForecastHour(NOW + timedelta(hours=3), 0.4),
    ]
    assert hours_to_rain(forecast, NOW) == 3.0
    assert hours_to_rain([ForecastHour(NOW - timedelta(minutes=30), 1.0)], NOW) == 0.0
    assert hours_to_rain([ForecastHour(NOW - timedelta(hours=2), 1.0)], NOW) is None
    assert hours_to_rain([], NOW) is None
