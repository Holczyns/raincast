"""Schedule, watering runs and checks of one RainCast controller.

Once a day, at the start chosen in the settings, the coordinator computes
the plan, sends it as a notification and, while valve control is on,
waters the due zones one valve after another. Manual runs go through the
same queue; only one run is active at a time. The coordinator is the only
writer of the configured valves.

Every minute the plan shown by the entities is computed again and the
fault conditions are checked.

State kept across restarts (Store): settings, zone intervals and valve
durations, last watering dates, valve control, the run log and the
valves of a run in progress. A run cut off by a restart is not resumed;
its valves are closed on the next start. Fault timers are not kept.
"""

from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.const import ATTR_ENTITY_ID, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback, split_entity_id
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.event import async_track_point_in_time, async_track_time_interval
from homeassistant.helpers.storage import Store
from homeassistant.helpers.sun import get_astral_event_next
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    CHECK_SECONDS,
    CONF_DURATION,
    CONF_INTERVAL,
    CONF_RAIN_SENSOR,
    CONF_ROOFED,
    CONF_SOIL_SENSOR,
    CONF_VALVES,
    DEFAULT_DURATION,
    DEFAULT_INTERVAL,
    DEFAULT_SETTINGS,
    DOMAIN,
    NATIVE_START,
    POLL_SECONDS,
    RUN_LOG_SIZE,
    SETTING_RAIN_MAX,
    SETTING_SOIL_MAX,
    SETTING_START_MODE,
    SETTING_START_TIME,
    SETTING_SUNRISE_OFFSET,
    STORAGE_VERSION,
    SUBENTRY_ZONE,
)
from .engine import (
    Command,
    FaultInputs,
    FaultMonitor,
    Outcome,
    Plan,
    StartMode,
    ValveRun,
    ValveSlot,
    Weather,
    ZoneConfig,
    conditions,
    make_plan,
    next_start,
    zone_watered,
)
from .messages import async_notify, plan_message, run_message
from .problems import async_clear_issues, async_report

_LOGGER = logging.getLogger(__name__)

MISSING_STATES = (STATE_UNAVAILABLE, STATE_UNKNOWN)
OPEN_STATES = ("open", "opening", "on")
START_SETTINGS = (SETTING_START_MODE, SETTING_START_TIME, SETTING_SUNRISE_OFFSET)
# Valves of an interrupted run may belong to an integration that is still starting.
CLOSE_RETRIES = 10
CLOSE_RETRY_SECONDS = 30


def _number(state_value: str | None) -> float | None:
    try:
        return float(state_value)
    except (TypeError, ValueError):
        return None


@dataclass(slots=True)
class RunState:
    """Progress of the run in progress, shown by the entities."""

    reason: str
    started: datetime
    zone_keys: list[str]
    zone: str | None = None
    valve: str | None = None
    valve_ends: datetime | None = None
    results: list[dict[str, Any]] = field(default_factory=list)


class RainCastCoordinator(DataUpdateCoordinator[Plan]):
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        super().__init__(hass, _LOGGER, config_entry=entry, name=DOMAIN, update_interval=None)
        self.entry = entry
        self.device_id: str | None = None
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}")
        self.settings: dict[str, Any] = dict(DEFAULT_SETTINGS)
        self.zone_tuning: dict[str, dict[str, Any]] = {}
        self.last_watered: dict[str, date | None] = {}
        self.control_active = False
        self.log: list[dict[str, Any]] = []
        self.next_start: datetime | None = None
        self.run: RunState | None = None
        self.faults = FaultMonitor()
        self._run_task: asyncio.Task[None] | None = None
        self._start_unsub: CALLBACK_TYPE | None = None
        self._unsub: list[CALLBACK_TYPE] = []
        # Valves of the run in progress, stored so a restart can close them.
        self._run_valves: list[str] = []
        # Valves that did not open in their latest run, and valves still open after a stop.
        self._not_opened: set[str] = set()
        self._left_open: set[str] = set()

    # Configuration views

    @property
    def zones(self) -> dict[str, ConfigSubentry]:
        """Zone subentries keyed by subentry id (the stable zone key)."""
        return {
            subentry_id: subentry
            for subentry_id, subentry in self.entry.subentries.items()
            if subentry.subentry_type == SUBENTRY_ZONE
        }

    @property
    def valves(self) -> list[str]:
        """Every configured valve, in zone order."""
        return [valve for zone in self.zones.values() for valve in zone.data.get(CONF_VALVES, [])]

    @property
    def running(self) -> bool:
        return self.run is not None

    def zone_configs(self) -> list[ZoneConfig]:
        configs = []
        for key, subentry in self.zones.items():
            tuning = self.zone_tuning[key]
            slots = tuple(
                ValveSlot(valve, float(tuning["durations"].get(valve, DEFAULT_DURATION)))
                for valve in subentry.data.get(CONF_VALVES, [])
            )
            configs.append(
                ZoneConfig(
                    key=key,
                    name=subentry.title,
                    roofed=bool(subentry.data.get(CONF_ROOFED, False)),
                    interval_days=int(tuning[CONF_INTERVAL]),
                    valves=slots,
                )
            )
        return configs

    # Lifecycle

    async def async_setup(self) -> None:
        stored = await self._store.async_load() or {}
        self.settings.update({key: value for key, value in stored.get("settings", {}).items() if key in self.settings})
        self.control_active = stored.get("control_active", False)
        self.log = list(stored.get("log", []))[-RUN_LOG_SIZE:]
        stored_zones = stored.get("zones", {})
        stored_dates = stored.get("last_watered", {})
        for key, subentry in self.zones.items():
            tuning = stored_zones.get(key, {})
            default_duration = subentry.data.get(CONF_DURATION, DEFAULT_DURATION)
            durations = dict(tuning.get("durations", {}))
            for valve in subentry.data.get(CONF_VALVES, []):
                durations.setdefault(valve, default_duration)
            self.zone_tuning[key] = {
                CONF_INTERVAL: tuning.get(CONF_INTERVAL, subentry.data.get(CONF_INTERVAL, DEFAULT_INTERVAL)),
                # Durations of valves no longer in the zone are dropped.
                "durations": {valve: durations[valve] for valve in subentry.data.get(CONF_VALVES, [])},
            }
            stored_date = stored_dates.get(key)
            self.last_watered[key] = date.fromisoformat(stored_date) if stored_date else None

        async_clear_issues(self.hass, self.entry)
        interrupted = stored.get("active_run")
        if interrupted:
            self.entry.async_create_background_task(
                self.hass, self._async_close_interrupted(interrupted), name=f"{DOMAIN} close interrupted run"
            )

        self.async_set_updated_data(self._plan())
        self._schedule_start()
        self._unsub.append(async_track_time_interval(self.hass, self._async_check, timedelta(seconds=CHECK_SECONDS)))

    async def async_shutdown(self) -> None:
        for unsub in self._unsub:
            unsub()
        self._unsub.clear()
        self._cancel_start()
        if self._run_task is not None:
            self._run_task.cancel()
        await self._async_save()
        await super().async_shutdown()

    async def _async_save(self) -> None:
        await self._store.async_save(self._save_data())

    @callback
    def _schedule_save(self) -> None:
        self._store.async_delay_save(self._save_data, 10)

    def _save_data(self) -> dict[str, Any]:
        active_run = None
        if self._run_valves:
            active_run = {"started": self.run.started.isoformat() if self.run else None, "valves": self._run_valves}
        return {
            "settings": dict(self.settings),
            "control_active": self.control_active,
            "zones": {
                key: {CONF_INTERVAL: value[CONF_INTERVAL], "durations": dict(value["durations"])}
                for key, value in self.zone_tuning.items()
            },
            "last_watered": {key: value.isoformat() for key, value in self.last_watered.items() if value},
            "active_run": active_run,
            "log": self.log[-RUN_LOG_SIZE:],
        }

    # Plan inputs

    def _sensor_value(self, key: str) -> float | None:
        entity_id = self.entry.data.get(key)
        if not entity_id:
            return None
        state = self.hass.states.get(entity_id)
        return _number(state.state) if state else None

    def weather(self) -> Weather:
        return Weather(
            soil=self._sensor_value(CONF_SOIL_SENSOR),
            rain=self._sensor_value(CONF_RAIN_SENSOR),
            soil_max=float(self.settings[SETTING_SOIL_MAX]),
            rain_max=float(self.settings[SETTING_RAIN_MAX]),
        )

    def _plan(self) -> Plan:
        return make_plan(self.zone_configs(), self.last_watered, self.weather(), dt_util.now().date())

    @callback
    def async_refresh_plan(self) -> None:
        """Compute the plan again after a setting or a date changed."""
        self.async_set_updated_data(self._plan())
        self._schedule_save()

    # Schedule

    def _sunrise_after(self, moment: datetime) -> datetime:
        sunrise = get_astral_event_next(self.hass, "sunrise", dt_util.as_utc(moment))
        return dt_util.as_local(sunrise)

    @callback
    def _schedule_start(self) -> None:
        self._cancel_start()
        self.next_start = next_start(
            StartMode(self.settings[SETTING_START_MODE]),
            dt_util.now(),
            sunrise_after=self._sunrise_after,
            offset_h=float(self.settings[SETTING_SUNRISE_OFFSET]),
            at=time.fromisoformat(str(self.settings[SETTING_START_TIME])),
        )
        if self.next_start is not None:
            self._start_unsub = async_track_point_in_time(self.hass, self._async_scheduled_start, self.next_start)

    def _cancel_start(self) -> None:
        if self._start_unsub is not None:
            self._start_unsub()
            self._start_unsub = None

    async def _async_scheduled_start(self, _now: datetime) -> None:
        self._start_unsub = None
        self._schedule_start()
        plan = self._plan()
        self.async_set_updated_data(plan)
        if self.running:
            _LOGGER.warning("%s: scheduled start skipped, a run is still in progress", self.entry.title)
            return
        dry_run = not self.control_active
        title, message = plan_message(self.entry.title, plan, dt_util.now(), dry_run)
        await async_notify(self.hass, self.entry, title, message)
        if dry_run or not plan.due:
            return
        self._start_run([zone.key for zone in plan.due], "scheduled")

    # Runs

    async def async_run_due(self) -> None:
        """Water the zones due right now, as a scheduled start would."""
        self._check_can_run()
        plan = self._plan()
        if not plan.due:
            raise HomeAssistantError("No zone is due right now")
        self._start_run([zone.key for zone in plan.due], "manual")

    async def async_run_zone(self, zone_key: str) -> None:
        """Water one zone now, regardless of its interval and the weather."""
        self._check_can_run()
        self._start_run([zone_key], "zone")

    def _check_can_run(self) -> None:
        if not self.control_active:
            raise HomeAssistantError("Valve control is off")
        if self.running:
            raise HomeAssistantError("A run is already in progress")

    @callback
    def _start_run(self, zone_keys: list[str], reason: str) -> None:
        self.run = RunState(reason=reason, started=dt_util.now(), zone_keys=zone_keys)
        self._run_task = self.entry.async_create_background_task(
            self.hass, self._async_run(self.run), name=f"{DOMAIN} run"
        )
        self.async_update_listeners()

    async def async_stop(self) -> None:
        """Cancel the run in progress and close every configured valve."""
        if self._run_task is not None:
            self._run_task.cancel()
            await asyncio.wait({self._run_task})
        for valve in self.valves:
            await self._async_stop_valve(valve)

    async def _async_run(self, run: RunState) -> None:
        configs = {zone.key: zone for zone in self.zone_configs()}
        zones = [configs[key] for key in run.zone_keys if key in configs]
        self._run_valves = [slot.entity_id for zone in zones for slot in zone.active_valves]
        # Saved at once: after a restart these valves are closed.
        await self._async_save()
        interrupted = False
        try:
            for zone in zones:
                run.zone = zone.key
                await self._async_water_zone(run, zone)
        except asyncio.CancelledError:
            interrupted = True
            if run.valve is not None:
                await self._async_stop_valve(run.valve)
            raise
        finally:
            await self._async_finish_run(run, interrupted)

    async def _async_water_zone(self, run: RunState, zone: ZoneConfig) -> None:
        result: dict[str, Any] = {
            "key": zone.key,
            "name": zone.name,
            "planned_min": 0.0,
            "watered_min": 0.0,
            "watered": False,
            "not_opened": [],
        }
        run.results.append(result)
        planned_s = 0.0
        watered_s = 0.0
        for slot in zone.active_valves:
            valve_run = ValveRun(planned_s=slot.minutes * 60)
            run.valve = slot.entity_id
            run.valve_ends = dt_util.now() + timedelta(minutes=slot.minutes)
            self.async_update_listeners()
            try:
                await self._async_water_valve(slot.entity_id, valve_run)
            finally:
                planned_s += valve_run.planned_s
                watered_s += valve_run.watered_s(dt_util.now())
                result["planned_min"] = round(planned_s / 60, 1)
                result["watered_min"] = round(watered_s / 60, 1)
            self._book_outcome(slot.entity_id, valve_run.outcome, result)
        run.valve = None
        run.valve_ends = None
        result["watered"] = zone_watered(planned_s, watered_s)
        # The date follows the measured time, not the fact that the zone was in the run.
        if result["watered"]:
            self.last_watered[zone.key] = dt_util.now().date()

    def _book_outcome(self, valve: str, outcome: Outcome | None, result: dict[str, Any]) -> None:
        if outcome is Outcome.NOT_OPENED:
            self._not_opened.add(valve)
            result["not_opened"].append(valve)
            return
        self._not_opened.discard(valve)
        if outcome is Outcome.NOT_CLOSED:
            self._left_open.add(valve)

    async def _async_water_valve(self, valve: str, valve_run: ValveRun) -> None:
        while valve_run.outcome is None:
            command = valve_run.step(self._is_open(valve), dt_util.now())
            if command is Command.START:
                await self._async_start_valve(valve, valve_run.remaining_minutes())
            if command is Command.STOP:
                await self._async_stop_valve(valve)
            if valve_run.outcome is None:
                await asyncio.sleep(POLL_SECONDS)

    async def _async_finish_run(self, run: RunState, interrupted: bool) -> None:
        ended = dt_util.now()
        entry = {
            "started": run.started.isoformat(),
            "ended": ended.isoformat(),
            "reason": run.reason,
            "interrupted": interrupted,
            "zones": run.results,
        }
        self.log = [*self.log, entry][-RUN_LOG_SIZE:]
        self.run = None
        self._run_task = None
        # Cut off by a shutdown, the close commands may not have gone through; the next start closes again.
        if not (interrupted and self.hass.is_stopping):
            self._run_valves = []
        await self._async_save()
        self.async_set_updated_data(self._plan())
        title, message = run_message(self.entry.title, entry, self._friendly_name)
        await async_notify(self.hass, self.entry, title, message)
        await self._async_check(ended)

    async def _async_close_interrupted(self, interrupted: dict[str, Any]) -> None:
        valves = list(interrupted.get("valves", []))
        _LOGGER.warning("%s: a run was interrupted by a restart, closing %s", self.entry.title, ", ".join(valves))
        self.log = [
            *self.log,
            {
                "started": interrupted.get("started"),
                "ended": None,
                "reason": "restart",
                "interrupted": True,
                "zones": [],
            },
        ][-RUN_LOG_SIZE:]
        await self._async_save()
        await async_notify(
            self.hass,
            self.entry,
            f"{self.entry.title}: watering interrupted",
            "Home Assistant restarted during a run. The valves of that run were closed; the run is not resumed.",
        )
        for _attempt in range(CLOSE_RETRIES):
            pending = [valve for valve in valves if self.hass.states.get(valve) is None]
            for valve in valves:
                if valve not in pending:
                    await self._async_stop_valve(valve)
            valves = pending
            if not valves:
                return
            await asyncio.sleep(CLOSE_RETRY_SECONDS)

    # Valve commands

    def _is_open(self, valve: str) -> bool:
        state = self.hass.states.get(valve)
        return (state is not None) and (state.state in OPEN_STATES)

    def _native_start(self, valve: str) -> tuple[str, str] | None:
        entity = er.async_get(self.hass).async_get(valve)
        if (entity is None) or (split_entity_id(valve)[0] != "valve"):
            return None
        return NATIVE_START.get(entity.platform)

    async def _async_start_valve(self, valve: str, minutes: int) -> None:
        native = self._native_start(valve)
        if native is not None:
            await self._async_call(native[0], native[1], {ATTR_ENTITY_ID: valve, "minutes": minutes})
            return
        domain = split_entity_id(valve)[0]
        service = "open_valve" if domain == "valve" else "turn_on"
        await self._async_call(domain, service, {ATTR_ENTITY_ID: valve})

    async def _async_stop_valve(self, valve: str) -> None:
        domain = split_entity_id(valve)[0]
        service = "close_valve" if domain == "valve" else "turn_off"
        await self._async_call(domain, service, {ATTR_ENTITY_ID: valve})

    async def _async_call(self, domain: str, service: str, data: dict[str, Any]) -> None:
        try:
            await self.hass.services.async_call(domain, service, data, blocking=True)
        except HomeAssistantError as err:
            _LOGGER.warning("Calling %s.%s for %s failed: %s", domain, service, data.get(ATTR_ENTITY_ID), err)

    # Checks

    def _friendly_name(self, entity_id: str) -> str:
        state = self.hass.states.get(entity_id)
        if state is None:
            return entity_id
        return str(state.attributes.get("friendly_name", entity_id))

    def _names(self, entity_ids: tuple[str, ...]) -> str:
        return ", ".join(self._friendly_name(entity_id) for entity_id in entity_ids) or "none"

    async def _async_check(self, now: datetime) -> None:
        self.async_set_updated_data(self._plan())
        # A valve left open counts as fixed once it reports closed.
        self._left_open = {valve for valve in self._left_open if self._is_open(valve)}
        unavailable = tuple(
            valve
            for valve in self.valves
            if (self.hass.states.get(valve) is None) or (self.hass.states.get(valve).state in MISSING_STATES)
        )
        weather_missing = tuple(
            self.entry.data[key]
            for key in (CONF_SOIL_SENSOR, CONF_RAIN_SENSOR)
            if self.entry.data.get(key) and (self._sensor_value(key) is None)
        )
        fault_inputs = FaultInputs(
            unavailable_valves=unavailable,
            not_opened=tuple(sorted(self._not_opened)),
            left_open=tuple(sorted(self._left_open)),
            weather_missing=weather_missing,
        )
        raised, cleared = self.faults.update(conditions(fault_inputs), now)
        if not (raised or cleared):
            return
        values = {
            "unavailable": self._names(fault_inputs.unavailable_valves),
            "not_opened": self._names(fault_inputs.not_opened),
            "left_open": self._names(fault_inputs.left_open),
            "weather": self._names(fault_inputs.weather_missing),
        }
        await async_report(self.hass, self.entry, raised, cleared, values)

    # Settings changed from entities

    async def async_set_control(self, active: bool) -> None:
        self.control_active = active
        self._schedule_save()
        # Turning control off ends a run in progress and closes its valve.
        if (not active) and (self._run_task is not None):
            self._run_task.cancel()
        self.async_update_listeners()

    @callback
    def async_set_setting(self, key: str, value: Any) -> None:
        self.settings[key] = value
        if key in START_SETTINGS:
            self._schedule_start()
        self.async_refresh_plan()

    @callback
    def async_set_interval(self, zone_key: str, days: int) -> None:
        self.zone_tuning[zone_key][CONF_INTERVAL] = days
        self.async_refresh_plan()

    @callback
    def async_set_duration(self, zone_key: str, valve: str, minutes: float) -> None:
        self.zone_tuning[zone_key]["durations"][valve] = minutes
        self.async_refresh_plan()

    @callback
    def async_set_last_watered(self, zone_key: str, day: date | None) -> None:
        self.last_watered[zone_key] = day
        self.async_refresh_plan()
