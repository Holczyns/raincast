"""Watering logic without Home Assistant dependencies, tested on its own."""

from .faults import DELAYS, Fault, FaultInputs, FaultMonitor, conditions
from .mower import RAINY_CONDITIONS, ForecastHour, MowHold, MowInputs, hours_to_rain, mow_hold
from .plan import Plan, ValveSlot, Weather, ZoneConfig, ZonePlan, ZoneStatus, make_plan, weather_hold, zone_plan
from .schedule import StartMode, in_season, next_start
from .valve import Command, Outcome, ValveRun, zone_watered
from .water import FlowFault, ValveWater, meter_liters

__all__ = [
    "DELAYS",
    "RAINY_CONDITIONS",
    "Command",
    "Fault",
    "FaultInputs",
    "FaultMonitor",
    "FlowFault",
    "ForecastHour",
    "MowHold",
    "MowInputs",
    "Outcome",
    "Plan",
    "StartMode",
    "ValveRun",
    "ValveSlot",
    "ValveWater",
    "Weather",
    "ZoneConfig",
    "ZonePlan",
    "ZoneStatus",
    "conditions",
    "hours_to_rain",
    "in_season",
    "make_plan",
    "meter_liters",
    "mow_hold",
    "next_start",
    "weather_hold",
    "zone_plan",
    "zone_watered",
]
