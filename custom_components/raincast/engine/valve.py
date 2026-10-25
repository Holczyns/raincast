"""Supervision of one valve while it waters for a planned time.

Rules, checked on every poll of the valve state:
1. The valve has to report open within OPEN_TIMEOUT_S of a start
   command; a valve that never opens is reported as not opened.
2. Only time the valve reports open counts as watering.
3. A valve that closes before the planned time is started again with the
   time left, at most MAX_STARTS times; controllers such as B-hyve close
   a manual run after their own preset time.
4. Once the planned time is reached the valve is stopped and has to
   report closed within CLOSE_TIMEOUT_S.

State kept between polls: measured open time, when the valve opened,
when the last command was sent and how often it was started. The runner
creates a new instance for every valve run.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum

# Cloud controllers report a state change some seconds after the command.
OPEN_TIMEOUT_S = 60.0
CLOSE_TIMEOUT_S = 60.0
# Less time left than this after an early close counts as done.
MIN_REMAINING_S = 60.0
MAX_STARTS = 10
# Share of the planned time a zone needs to count as watered.
WATERED_SHARE = 0.9


class Command(StrEnum):
    START = "start"
    STOP = "stop"


class Outcome(StrEnum):
    DONE = "done"
    NOT_OPENED = "not_opened"
    NOT_CLOSED = "not_closed"


@dataclass(slots=True)
class ValveRun:
    planned_s: float
    ran_s: float = 0.0
    """Measured open time up to the current opening."""
    open_since: datetime | None = None
    command_at: datetime | None = None
    """When the last start command was sent; cleared once the valve closes again."""
    starts: int = 0
    opened: bool = False
    stop_at: datetime | None = None
    outcome: Outcome | None = None

    def watered_s(self, now: datetime) -> float:
        if self.open_since is None:
            return self.ran_s
        return self.ran_s + (now - self.open_since).total_seconds()

    def remaining_minutes(self) -> int:
        """Whole minutes for controllers that take the run time with the start command."""
        return max(1, math.ceil((self.planned_s - self.ran_s) / 60))

    def step(self, is_open: bool, now: datetime) -> Command | None:
        """Advance by one poll; returns the command to send, if any."""
        if self.outcome is not None:
            return None

        # 4. Stop sent: wait for the valve to report closed.
        if self.stop_at is not None:
            if not is_open:
                self.outcome = Outcome.DONE
            elif (now - self.stop_at).total_seconds() >= CLOSE_TIMEOUT_S:
                self.outcome = Outcome.NOT_CLOSED
            return None

        # 2. Open: count the time, stop at the planned time.
        if is_open:
            if self.open_since is None:
                self.open_since = now
                self.opened = True
            if self.watered_s(now) >= self.planned_s:
                self.ran_s = self.watered_s(now)
                self.open_since = None
                self.stop_at = now
                return Command.STOP
            return None

        # 3. Closed before the planned time: book the time it was open.
        if self.open_since is not None:
            self.ran_s = self.watered_s(now)
            self.open_since = None
            self.command_at = None
        if self.planned_s - self.ran_s < MIN_REMAINING_S:
            self.outcome = Outcome.DONE
            return None

        # 1. Waiting for the valve to open after a start command.
        if self.command_at is not None:
            if (now - self.command_at).total_seconds() < OPEN_TIMEOUT_S:
                return None
            # A late opening must not run unsupervised, so the valve is stopped anyway.
            self.outcome = Outcome.DONE if self.opened else Outcome.NOT_OPENED
            return Command.STOP

        if self.starts >= MAX_STARTS:
            self.outcome = Outcome.DONE
            return None
        self.starts += 1
        self.command_at = now
        return Command.START


def zone_watered(planned_s: float, watered_s: float) -> bool:
    return (planned_s > 0) and (watered_s >= WATERED_SHARE * planned_s)
