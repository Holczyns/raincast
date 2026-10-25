from datetime import datetime, timedelta

from engine.faults import Fault, FaultInputs, FaultMonitor, conditions

START = datetime(2026, 6, 10, 4, 0)


def inputs(**overrides):
    values = {
        "unavailable_valves": (),
        "not_opened": (),
        "left_open": (),
        "no_flow": (),
        "flow_high": (),
        "weather_missing": (),
    }
    values.update(overrides)
    return FaultInputs(**values)


def test_healthy_check_has_no_condition():
    assert conditions(inputs()) == set()


def test_each_input_maps_to_its_fault():
    assert conditions(inputs(unavailable_valves=("valve.a",))) == {Fault.VALVE_UNAVAILABLE}
    assert conditions(inputs(not_opened=("valve.a",))) == {Fault.VALVE_NOT_OPENED}
    assert conditions(inputs(left_open=("valve.a",))) == {Fault.VALVE_NOT_CLOSED}
    assert conditions(inputs(weather_missing=("sensor.soil",))) == {Fault.WEATHER_LOST}


def test_unavailable_valve_is_reported_after_its_delay():
    monitor = FaultMonitor()
    present = {Fault.VALVE_UNAVAILABLE}
    assert monitor.update(present, START) == (set(), set())
    assert monitor.update(present, START + timedelta(minutes=29)) == (set(), set())
    assert monitor.update(present, START + timedelta(minutes=30)) == ({Fault.VALVE_UNAVAILABLE}, set())
    assert monitor.update(set(), START + timedelta(minutes=31)) == (set(), {Fault.VALVE_UNAVAILABLE})


def test_run_faults_are_reported_at_once():
    monitor = FaultMonitor()
    raised, _ = monitor.update({Fault.VALVE_NOT_OPENED, Fault.VALVE_NOT_CLOSED}, START)
    assert raised == {Fault.VALVE_NOT_OPENED, Fault.VALVE_NOT_CLOSED}


def test_short_dropout_starts_the_delay_again():
    monitor = FaultMonitor()
    monitor.update({Fault.WEATHER_LOST}, START)
    monitor.update(set(), START + timedelta(minutes=50))
    assert monitor.update({Fault.WEATHER_LOST}, START + timedelta(minutes=70)) == (set(), set())
