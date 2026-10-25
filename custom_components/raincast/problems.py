"""Reporting of faults: a repair issue per fault and an optional notification.

Issues are created when a fault is raised and deleted when it clears, so
the Repairs page always shows the faults present right now.
"""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir

from .const import DOMAIN
from .engine import Fault
from .messages import async_notify

_LOGGER = logging.getLogger(__name__)

SEVERITY: dict[Fault, ir.IssueSeverity] = {
    Fault.VALVE_UNAVAILABLE: ir.IssueSeverity.WARNING,
    Fault.VALVE_NOT_OPENED: ir.IssueSeverity.ERROR,
    Fault.VALVE_NOT_CLOSED: ir.IssueSeverity.CRITICAL,
    Fault.WEATHER_LOST: ir.IssueSeverity.WARNING,
}

TITLES: dict[Fault, str] = {
    Fault.VALVE_UNAVAILABLE: "valve unavailable",
    Fault.VALVE_NOT_OPENED: "valve did not open",
    Fault.VALVE_NOT_CLOSED: "valve still open",
    Fault.WEATHER_LOST: "weather data lost",
}

MESSAGES: dict[Fault, str] = {
    Fault.VALVE_UNAVAILABLE: (
        "{unavailable} has been unavailable for 30 minutes. Zones with this valve cannot be watered."
    ),
    Fault.VALVE_NOT_OPENED: (
        "{not_opened} did not report open within a minute of the start command. The zone was not counted as watered."
    ),
    Fault.VALVE_NOT_CLOSED: (
        "{left_open} still reports open after the stop command. Check the valve; water may be running."
    ),
    Fault.WEATHER_LOST: (
        "{weather} has had no value for an hour. Zones are watered by their intervals alone until it returns."
    ),
}


def notify_services(hass: HomeAssistant) -> list[str]:
    """Legacy notify services such as mobile_app_phone; send_message needs an entity instead."""
    return sorted(service for service in hass.services.async_services_for_domain("notify") if service != "send_message")


def _issue_id(entry: ConfigEntry, fault: Fault) -> str:
    return f"{entry.entry_id}_{fault}"


def async_clear_issues(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Fault timers start again after a reload, so old issues go with it."""
    for fault in Fault:
        ir.async_delete_issue(hass, DOMAIN, _issue_id(entry, fault))


async def async_report(
    hass: HomeAssistant,
    entry: ConfigEntry,
    raised: set[Fault],
    cleared: set[Fault],
    values: dict[str, str],
) -> None:
    placeholders = {"name": entry.title, **values}
    for fault in raised:
        _LOGGER.warning("%s: %s", entry.title, TITLES[fault])
        ir.async_create_issue(
            hass,
            DOMAIN,
            _issue_id(entry, fault),
            is_fixable=False,
            is_persistent=False,
            severity=SEVERITY[fault],
            translation_key=str(fault),
            translation_placeholders=placeholders,
        )
        await async_notify(hass, entry, f"{entry.title}: {TITLES[fault]}", MESSAGES[fault].format(**placeholders))
    for fault in cleared:
        _LOGGER.info("%s: resolved, %s", entry.title, TITLES[fault])
        ir.async_delete_issue(hass, DOMAIN, _issue_id(entry, fault))
        await async_notify(hass, entry, f"{entry.title}: resolved", f"Resolved: {TITLES[fault]}.")
