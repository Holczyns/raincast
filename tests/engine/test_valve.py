from datetime import datetime, timedelta

from engine.valve import MAX_STARTS, Command, Outcome, ValveRun, zone_watered

T0 = datetime(2026, 6, 10, 4, 0)


def at(seconds: float) -> datetime:
    return T0 + timedelta(seconds=seconds)


def test_normal_run_starts_counts_and_stops():
    run = ValveRun(planned_s=600)
    assert run.step(False, at(0)) is Command.START
    assert run.step(False, at(5)) is None
    assert run.step(True, at(10)) is None
    assert run.step(True, at(300)) is None
    assert run.step(True, at(610)) is Command.STOP
    assert run.watered_s(at(610)) == 600
    assert run.step(False, at(615)) is None
    assert run.outcome is Outcome.DONE


def test_valve_that_never_opens():
    run = ValveRun(planned_s=600)
    assert run.step(False, at(0)) is Command.START
    assert run.step(False, at(59)) is None
    assert run.step(False, at(60)) is Command.STOP
    assert run.outcome is Outcome.NOT_OPENED
    assert run.watered_s(at(60)) == 0


def test_early_close_is_restarted_with_time_left():
    run = ValveRun(planned_s=1800)
    run.step(False, at(0))
    run.step(True, at(5))
    # the controller ends its own 10-minute preset
    assert run.step(False, at(605)) is Command.START
    assert run.ran_s == 600
    assert run.remaining_minutes() == 20
    run.step(True, at(610))
    assert run.step(True, at(1810)) is Command.STOP
    assert run.watered_s(at(1810)) == 1800


def test_short_rest_after_early_close_counts_as_done():
    run = ValveRun(planned_s=600)
    run.step(False, at(0))
    run.step(True, at(5))
    assert run.step(False, at(570)) is None
    assert run.outcome is Outcome.DONE


def test_restarts_are_limited():
    run = ValveRun(planned_s=36000)
    assert run.step(False, at(0)) is Command.START
    time = 0.0
    # every opening is cut after a minute; each early close starts the valve again
    for _ in range(MAX_STARTS - 1):
        run.step(True, at(time + 1))
        time += 61
        assert run.step(False, at(time)) is Command.START
    run.step(True, at(time + 1))
    assert run.step(False, at(time + 61)) is None
    assert run.outcome is Outcome.DONE
    assert run.starts == MAX_STARTS


def test_valve_that_stays_open_after_stop():
    run = ValveRun(planned_s=60)
    run.step(False, at(0))
    run.step(True, at(1))
    assert run.step(True, at(61)) is Command.STOP
    assert run.step(True, at(120)) is None
    assert run.outcome is None
    run.step(True, at(121))
    assert run.outcome is Outcome.NOT_CLOSED


def test_zone_watered_needs_most_of_the_time():
    assert zone_watered(600, 540)
    assert not zone_watered(600, 539)
    assert not zone_watered(0, 0)
