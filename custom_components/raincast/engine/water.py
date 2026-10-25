"""Water used by one valve, from a water meter, and checks of its flow.

Rules, checked on every poll while the valve reports open:
1. A meter without a fresh reading is not judged; the valve is not
   checked until a reading arrives.
2. No flow: the meter has not moved after NO_FLOW_S of open time.
3. Flow too high: after FLOW_CHECK_S of open time the mean flow since the
   first reading is above the valve's limit; a limit of 0 turns the check
   off. The mean, not the latest telegram, so the surge of filling pipes
   does not count.

Open time is the valve's measured watering time, so a valve restarted
after an early close is judged on the time it actually ran. State kept
between polls: the first meter reading and which checks have fired.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum

NO_FLOW_S = 120.0
FLOW_CHECK_S = 180.0


class FlowFault(StrEnum):
    NO_FLOW = "no_flow"
    FLOW_HIGH = "flow_high"


@dataclass(slots=True)
class ValveWater:
    max_flow: float
    """Highest allowed mean flow in L/min, 0 for no limit."""
    first_liters: float | None = None
    first_open_s: float = 0.0
    """Open time when the first meter reading was taken."""
    no_flow: bool = False
    flow_high: bool = False

    def flow(self, open_s: float, liters: float | None) -> float | None:
        """Mean flow in L/min since the first reading, None without readings."""
        if (self.first_liters is None) or (liters is None):
            return None
        minutes = (open_s - self.first_open_s) / 60
        if minutes <= 0:
            return None
        return max(liters - self.first_liters, 0.0) / minutes

    def observe(self, open_s: float, liters: float | None) -> FlowFault | None:
        """Advance by one poll of an open valve; returns a check that fired now."""
        # 1. No fresh reading, nothing to judge.
        if liters is None:
            return None
        if self.first_liters is None:
            self.first_liters = liters
            self.first_open_s = open_s
            return None

        # 2. Meter standing still.
        moved = liters > self.first_liters
        no_flow_now = (not moved) and (open_s - self.first_open_s >= NO_FLOW_S)
        if no_flow_now and not self.no_flow:
            self.no_flow = True
            return FlowFault.NO_FLOW
        if moved:
            self.no_flow = False

        # 3. Mean flow above the limit.
        flow = self.flow(open_s, liters)
        checked = (self.max_flow > 0) and (open_s - self.first_open_s >= FLOW_CHECK_S)
        if checked and (flow is not None) and (flow > self.max_flow) and not self.flow_high:
            self.flow_high = True
            return FlowFault.FLOW_HIGH
        return None


def meter_liters(value: float | None, unit: str | None) -> float | None:
    """Meter reading in litres; None for an unknown unit."""
    if value is None:
        return None
    factors = {"m³": 1000.0, "L": 1.0, "l": 1.0, "gal": 3.785411784, "ft³": 28.316846592}
    factor = factors.get(unit or "")
    return None if factor is None else value * factor
