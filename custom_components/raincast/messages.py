"""Notification texts for the day's plan and the end of a run, and sending them."""

from __future__ import annotations

import logging
from collections.abc import Callable
from datetime import datetime, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from .const import CONF_NOTIFY_SERVICE
from .engine import MowHold, Plan, ZonePlan, ZoneStatus

_LOGGER = logging.getLogger(__name__)


def _days(count: int) -> str:
    return "1 day" if count == 1 else f"{count} days"


def _last_watered(zone: ZonePlan) -> str:
    if zone.days_since is None:
        return "never watered"
    if zone.days_since == 0:
        return "watered today"
    return f"last watered {_days(zone.days_since)} ago"


def skip_reason(zone: ZonePlan, plan: Plan, today: datetime) -> str:
    if zone.status is ZoneStatus.WAITING:
        return f"due in {_days((zone.next_due - today.date()).days)}"
    if zone.status is ZoneStatus.FROST:
        return f"frost, {plan.outdoor:g} °C below {plan.frost_min:g} °C"
    if zone.status is ZoneStatus.WET_SOIL:
        return f"soil {zone.soil:g} % above {zone.soil_max:g} %"
    if zone.status is ZoneStatus.RAIN_FORECAST:
        return f"{plan.rain:g} mm of rain forecast, limit {plan.rain_max:g} mm"
    return "no valve time set"


def _weather_line(plan: Plan) -> str | None:
    parts = []
    if plan.outdoor is not None:
        parts.append(f"outdoor {plan.outdoor:g} °C")
    if plan.rain is not None:
        parts.append(f"rain forecast {plan.rain:g} mm")
    if not parts:
        return None
    return "Weather: " + ", ".join(parts) + "."


def plan_message(name: str, plan: Plan, now: datetime, dry_run: bool) -> tuple[str, str]:
    lines: list[str] = []
    if plan.due:
        minutes = round(plan.minutes)
        title = f"{name}: watering plan"
        ends = (now + timedelta(minutes=minutes)).strftime("%H:%M")
        lines.append(f"{minutes} min in total, ends about {ends}.")
        for zone in plan.due:
            valves = f", {zone.valve_count} valves" if zone.valve_count > 1 else ""
            soil = f", soil {zone.soil:g} %" if zone.soil is not None else ""
            lines.append(f"• {zone.name}: {round(zone.minutes)} min{valves}, {_last_watered(zone)}{soil}")
    else:
        title = f"{name}: no watering today"
    if plan.skipped:
        skipped = "; ".join(f"{zone.name} ({skip_reason(zone, plan, now)})" for zone in plan.skipped)
        lines.append(f"Skipped: {skipped}.")
    weather = _weather_line(plan)
    if weather:
        lines.append(weather)
    if dry_run and plan.due:
        title += " (dry run)"
        lines.append("Valve control is off, no valve is opened.")
    return title, "\n".join(lines)


def run_message(name: str, entry: dict[str, Any], friendly_name: Callable[[str], str]) -> tuple[str, str]:
    zones = entry["zones"]
    complete = (not entry["interrupted"]) and all(zone["watered"] for zone in zones)
    title = f"{name}: watering finished" if complete else f"{name}: watering incomplete"
    lines = []
    for zone in zones:
        line = f"• {zone['name']}: {zone['watered_min']:g} of {zone['planned_min']:g} min"
        if zone.get("liters") is not None:
            line += f", {zone['liters']:.0f} l"
        if zone["not_opened"]:
            line += ", did not open: " + ", ".join(friendly_name(valve) for valve in zone["not_opened"])
        lines.append(line)
    if entry["interrupted"]:
        lines.append("Stopped before the end.")
    return title, "\n".join(lines)


def mow_skipped_message(
    name: str, hold: MowHold, hours_since_rain: float | None, hours_to_rain: float | None
) -> tuple[str, str]:
    reasons = {
        MowHold.FROST: "frost",
        MowHold.WATERING: "a zone on the lawn is being watered",
        MowHold.WATERED: "the lawn was watered today; wet grass sticks to the blades",
        MowHold.RAINING: "it is raining",
        MowHold.RAINED: f"it rained {hours_since_rain:g} h ago" if hours_since_rain is not None else "it rained",
        MowHold.RAIN_AHEAD: f"rain is due in {hours_to_rain:g} h" if hours_to_rain is not None else "rain is due",
    }
    return f"{name}: mowing skipped", f"Mowing skipped: {reasons[hold]}."


async def async_notify(hass: HomeAssistant, entry: ConfigEntry, title: str, message: str) -> None:
    service = entry.options.get(CONF_NOTIFY_SERVICE)
    if not service:
        return
    try:
        await hass.services.async_call("notify", service, {"title": title, "message": message}, blocking=False)
    except HomeAssistantError as err:
        _LOGGER.warning("Notification through notify.%s failed: %s", service, err)
