import pytest
from engine.water import FlowFault, ValveWater, meter_liters


def test_steady_flow_raises_nothing():
    water = ValveWater(max_flow=5.0)
    for second in range(0, 600, 30):
        assert water.observe(second, 1000.0 + second / 60 * 2.3) is None
    assert water.flow(600, 1000.0 + 600 / 60 * 2.3) == pytest.approx(2.3, abs=0.05)


def test_meter_standing_still_is_no_flow_after_two_minutes():
    water = ValveWater(max_flow=0.0)
    assert water.observe(10, 500.0) is None
    assert water.observe(129, 500.0) is None
    assert water.observe(130, 500.0) is FlowFault.NO_FLOW
    assert water.observe(160, 500.0) is None
    assert water.no_flow


def test_late_water_clears_no_flow():
    water = ValveWater(max_flow=0.0)
    water.observe(0, 500.0)
    water.observe(130, 500.0)
    water.observe(160, 501.0)
    assert not water.no_flow


def test_flow_above_limit_is_judged_on_the_mean_after_three_minutes():
    water = ValveWater(max_flow=10.0)
    water.observe(0, 0.0)
    # the pipes fill: a burst at the start, then 4 L/min
    assert water.observe(30, 15.0) is None
    assert water.observe(180, 25.0) is None
    burst = ValveWater(max_flow=10.0)
    burst.observe(0, 0.0)
    assert burst.observe(179, 60.0) is None
    assert burst.observe(180, 60.0) is FlowFault.FLOW_HIGH
    assert burst.observe(210, 70.0) is None


def test_zero_limit_turns_the_flow_check_off():
    water = ValveWater(max_flow=0.0)
    water.observe(0, 0.0)
    assert water.observe(300, 500.0) is None


def test_no_reading_is_not_judged():
    water = ValveWater(max_flow=1.0)
    assert water.observe(0, None) is None
    assert water.observe(300, None) is None
    assert water.observe(310, 10.0) is None
    assert water.first_open_s == 310


def test_meter_units():
    assert meter_liters(20.011, "m³") == pytest.approx(20011.0)
    assert meter_liters(5.0, "L") == 5.0
    assert meter_liters(1.0, "kWh") is None
    assert meter_liters(None, "m³") is None
