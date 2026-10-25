"""Fault detection: conditions read from the current check, reported after a delay.

A condition becomes a fault once it has held for its delay and is cleared
on the first check it no longer holds. State kept between checks: when
each condition started and which faults are reported; both start empty
after a restart.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import StrEnum


class Fault(StrEnum):
    VALVE_UNAVAILABLE = "valve_unavailable"
    VALVE_NOT_OPENED = "valve_not_opened"
    VALVE_NOT_CLOSED = "valve_not_closed"
    NO_FLOW = "no_flow"
    FLOW_HIGH = "flow_high"
    WEATHER_LOST = "weather_lost"


DELAYS: dict[Fault, timedelta] = {
    Fault.VALVE_UNAVAILABLE: timedelta(minutes=30),
    Fault.VALVE_NOT_OPENED: timedelta(0),
    Fault.VALVE_NOT_CLOSED: timedelta(0),
    Fault.NO_FLOW: timedelta(0),
    Fault.FLOW_HIGH: timedelta(0),
    Fault.WEATHER_LOST: timedelta(minutes=60),
}


@dataclass(frozen=True, slots=True)
class FaultInputs:
    unavailable_valves: tuple[str, ...]
    """Configured valves without a state right now."""
    not_opened: tuple[str, ...]
    """Valves that did not open in the latest run that used them."""
    left_open: tuple[str, ...]
    """Valves stopped by RainCast that still report open."""
    no_flow: tuple[str, ...]
    """Valves that reported open without water through the meter in their latest run."""
    flow_high: tuple[str, ...]
    """Valves stopped for too much flow in their latest run."""
    weather_missing: tuple[str, ...]
    """Configured weather sensors without a value right now."""


def conditions(inputs: FaultInputs) -> set[Fault]:
    """Faulty conditions in this check, before their delays."""
    found: set[Fault] = set()
    # 1. A valve has dropped out, usually its controller or cloud connection.
    if inputs.unavailable_valves:
        found.add(Fault.VALVE_UNAVAILABLE)
    # 2. A valve ignored the start command.
    if inputs.not_opened:
        found.add(Fault.VALVE_NOT_OPENED)
    # 3. Water still runs after the stop command.
    if inputs.left_open:
        found.add(Fault.VALVE_NOT_CLOSED)
    # 4. and 5. The water meter disagrees with the valve.
    if inputs.no_flow:
        found.add(Fault.NO_FLOW)
    if inputs.flow_high:
        found.add(Fault.FLOW_HIGH)
    # 6. Watering continues without the weather hold.
    if inputs.weather_missing:
        found.add(Fault.WEATHER_LOST)
    return found


@dataclass(slots=True)
class FaultMonitor:
    since: dict[Fault, datetime] = field(default_factory=dict)
    """When each present condition started."""
    active: set[Fault] = field(default_factory=set)
    """Faults reported right now."""

    def update(self, present: set[Fault], now: datetime) -> tuple[set[Fault], set[Fault]]:
        """Advance by one check; returns the faults raised and cleared in it."""
        for fault in list(self.since):
            if fault not in present:
                del self.since[fault]
        for fault in present:
            self.since.setdefault(fault, now)

        due = {fault for fault, start in self.since.items() if now - start >= DELAYS[fault]}
        raised = due - self.active
        cleared = self.active - due
        self.active = due
        return raised, cleared
