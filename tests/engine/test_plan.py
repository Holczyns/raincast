from datetime import date

from engine.plan import ValveSlot, Weather, ZoneConfig, ZoneStatus, make_plan, zone_plan

TODAY = date(2026, 6, 10)
DRY = Weather(soil=20.0, rain=1.0, soil_max=26.0, rain_max=4.0)


def zone(roofed=False, interval=3, minutes=(30.0, 20.0)):
    valves = tuple(ValveSlot(f"valve.v{index}", value) for index, value in enumerate(minutes))
    return ZoneConfig(key="z", name="Lawn", roofed=roofed, interval_days=interval, valves=valves)


def test_never_watered_zone_is_due():
    plan = zone_plan(zone(), None, DRY, TODAY)
    assert plan.status is ZoneStatus.DUE
    assert plan.days_since is None
    assert plan.minutes == 50
    assert plan.next_due == TODAY


def test_zone_waits_for_its_interval():
    plan = zone_plan(zone(interval=3), date(2026, 6, 8), DRY, TODAY)
    assert plan.status is ZoneStatus.WAITING
    assert plan.days_since == 2
    assert plan.next_due == date(2026, 6, 11)


def test_zone_is_due_on_the_interval_day():
    assert zone_plan(zone(interval=3), date(2026, 6, 7), DRY, TODAY).due


def test_wet_soil_holds_open_zone_but_not_roofed_one():
    wet = Weather(soil=30.0, rain=0.0, soil_max=26.0, rain_max=4.0)
    assert zone_plan(zone(), None, wet, TODAY).status is ZoneStatus.WET_SOIL
    assert zone_plan(zone(roofed=True), None, wet, TODAY).due


def test_rain_forecast_holds_open_zone():
    rainy = Weather(soil=20.0, rain=6.5, soil_max=26.0, rain_max=4.0)
    assert zone_plan(zone(), None, rainy, TODAY).status is ZoneStatus.RAIN_FORECAST


def test_limits_themselves_do_not_hold():
    at_limits = Weather(soil=26.0, rain=4.0, soil_max=26.0, rain_max=4.0)
    assert zone_plan(zone(), None, at_limits, TODAY).due


def test_missing_weather_does_not_hold():
    unknown = Weather(soil=None, rain=None, soil_max=26.0, rain_max=4.0)
    assert zone_plan(zone(), None, unknown, TODAY).due


def test_waiting_wins_over_weather():
    wet = Weather(soil=30.0, rain=10.0, soil_max=26.0, rain_max=4.0)
    assert zone_plan(zone(), TODAY, wet, TODAY).status is ZoneStatus.WAITING


def test_zero_minutes_are_left_out():
    plan = zone_plan(zone(minutes=(0.0, 15.0)), None, DRY, TODAY)
    assert plan.minutes == 15
    assert plan.valve_count == 1
    assert zone_plan(zone(minutes=(0.0,)), None, DRY, TODAY).status is ZoneStatus.NO_DURATION


def test_plan_sums_due_zones_only():
    lawn = zone()
    greenhouse = ZoneConfig("g", "Greenhouse", True, 2, (ValveSlot("valve.g", 10.0),))
    plan = make_plan([lawn, greenhouse], {"z": None, "g": TODAY}, DRY, TODAY)
    assert [item.key for item in plan.due] == ["z"]
    assert [item.key for item in plan.skipped] == ["g"]
    assert plan.minutes == 50
