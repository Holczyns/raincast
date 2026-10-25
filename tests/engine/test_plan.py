from datetime import date

from engine.plan import ValveSlot, Weather, ZoneConfig, ZoneStatus, make_plan, zone_plan

TODAY = date(2026, 6, 10)
DRY = Weather(rain=1.0, rain_max=4.0, outdoor=18.0, frost_min=3.0)


def zone(roofed=False, interval=3, minutes=(30.0, 20.0), soil_max=26.0):
    valves = tuple(ValveSlot(f"valve.v{index}", value) for index, value in enumerate(minutes))
    return ZoneConfig(key="z", name="Lawn", roofed=roofed, interval_days=interval, valves=valves, soil_max=soil_max)


def plan(zone_config, last=None, soil=20.0, weather=DRY):
    return zone_plan(zone_config, last, soil, weather, TODAY)


def test_never_watered_zone_is_due():
    result = plan(zone())
    assert result.status is ZoneStatus.DUE
    assert result.days_since is None
    assert result.minutes == 50
    assert result.next_due == TODAY


def test_zone_waits_for_its_interval():
    result = plan(zone(interval=3), last=date(2026, 6, 8))
    assert result.status is ZoneStatus.WAITING
    assert result.days_since == 2
    assert result.next_due == date(2026, 6, 11)


def test_zone_is_due_on_the_interval_day():
    assert plan(zone(interval=3), last=date(2026, 6, 7)).due


def test_soil_is_judged_against_the_zones_own_limit():
    assert plan(zone(soil_max=26.0), soil=30.0).status is ZoneStatus.WET_SOIL
    assert plan(zone(soil_max=35.0), soil=30.0).due


def test_roofed_zone_is_held_by_its_soil_but_not_by_rain():
    rainy = Weather(rain=10.0, rain_max=4.0)
    assert plan(zone(roofed=True), soil=None, weather=rainy).due
    assert plan(zone(roofed=True, soil_max=40.0), soil=45.0, weather=rainy).status is ZoneStatus.WET_SOIL


def test_rain_forecast_holds_open_zone():
    rainy = Weather(rain=6.5, rain_max=4.0)
    assert plan(zone(), weather=rainy).status is ZoneStatus.RAIN_FORECAST


def test_frost_holds_every_zone():
    cold = Weather(rain=0.0, rain_max=4.0, outdoor=1.5, frost_min=3.0)
    assert plan(zone(), weather=cold).status is ZoneStatus.FROST
    assert plan(zone(roofed=True), weather=cold).status is ZoneStatus.FROST


def test_limits_themselves_do_not_hold():
    at_limits = Weather(rain=4.0, rain_max=4.0, outdoor=3.0, frost_min=3.0)
    assert plan(zone(), soil=26.0, weather=at_limits).due


def test_missing_inputs_do_not_hold():
    unknown = Weather(rain=None, rain_max=4.0, outdoor=None)
    assert plan(zone(), soil=None, weather=unknown).due


def test_waiting_wins_over_weather():
    wet = Weather(rain=10.0, rain_max=4.0, outdoor=-5.0)
    assert plan(zone(), last=TODAY, soil=50.0, weather=wet).status is ZoneStatus.WAITING


def test_zero_minutes_are_left_out():
    result = plan(zone(minutes=(0.0, 15.0)))
    assert result.minutes == 15
    assert result.valve_count == 1
    assert plan(zone(minutes=(0.0,))).status is ZoneStatus.NO_DURATION


def test_plan_sums_due_zones_only_and_narrows_to_zones():
    lawn = zone()
    greenhouse = ZoneConfig("g", "Greenhouse", True, 2, (ValveSlot("valve.g", 10.0),))
    result = make_plan([lawn, greenhouse], {"z": None, "g": TODAY}, {"z": 20.0}, DRY, TODAY)
    assert [item.key for item in result.due] == ["z"]
    assert [item.key for item in result.skipped] == ["g"]
    assert result.minutes == 50
    assert [item.key for item in result.only(["g"]).zones] == ["g"]
