"""Rain around the garden and the mower's schedule, part of the coordinator.

Rain: while the weather entity reports rain, the time is kept as the last
rain; the hourly forecast is fetched every half hour for the next rain.

Mower: at its start, in its season and while automatic mowing is on, the
mower goes out unless a hold applies: frost, a zone that blocks mowing
watered today or being watered, rain now, recent rain or rain ahead. A
forced start goes out regardless. The mower has to be back in its dock
within MOWER_RETURN_HOURS, or a problem is reported until it is.

State kept across restarts (with the coordinator's store): the time of
the last rain. The forecast, the next start and a mowing in progress are
not kept.
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, time, timedelta
from typing import TYPE_CHECKING, Any

from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import CALLBACK_TYPE, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .const import (
    CONF_MOWER,
    CONF_MOWER_CONFLICT,
    CONF_WEATHER,
    MOWER_LEAVE_MINUTES,
    MOWER_POLL_SECONDS,
    MOWER_RETURN_HOURS,
    SEASON_SEARCH_DAYS,
    SETTING_AUTOMATIC_MOWING,
    SETTING_DRY_HOURS,
    SETTING_FROST_MIN,
    SETTING_MOWER_OFFSET,
    SETTING_MOWER_SEASON_END,
    SETTING_MOWER_SEASON_START,
    SETTING_MOWER_START_MODE,
    SETTING_MOWER_START_TIME,
    SETTING_RAIN_AHEAD_HOURS,
)
from .engine import (
    RAINY_CONDITIONS,
    ForecastHour,
    MowHold,
    MowInputs,
    StartMode,
    hours_to_rain,
    in_season,
    mow_hold,
    next_start,
)
from .messages import async_notify, mow_skipped_message

if TYPE_CHECKING:
    from .coordinator import RainCastCoordinator

_LOGGER = logging.getLogger(__name__)

DOCKED = "docked"


class Mowing:
    def __init__(self, coordinator: RainCastCoordinator) -> None:
        self.coordinator = coordinator
        self.hass = coordinator.hass
        self.entry = coordinator.entry
        self.last_rain: datetime | None = None
        self.forecast: list[ForecastHour] = []
        self.next_start: datetime | None = None
        self.mowing = False
        """A mowing started by RainCast has not ended yet."""
        self.not_back = False
        """The mower did not return within MOWER_RETURN_HOURS; cleared once it is docked."""
        self._start_unsub: CALLBACK_TYPE | None = None
        self._task: asyncio.Task[None] | None = None

    @property
    def mower(self) -> str | None:
        return self.entry.data.get(CONF_MOWER)

    @property
    def settings(self) -> dict[str, Any]:
        return self.coordinator.settings

    # Rain

    @property
    def raining(self) -> bool | None:
        weather = self.entry.data.get(CONF_WEATHER)
        state = self.hass.states.get(weather) if weather else None
        if state is None:
            return None
        return state.state in RAINY_CONDITIONS

    @property
    def hours_since_rain(self) -> float | None:
        if self.last_rain is None:
            return None
        return round((dt_util.now() - self.last_rain).total_seconds() / 3600, 1)

    @property
    def hours_to_rain(self) -> float | None:
        value = hours_to_rain(self.forecast, dt_util.now())
        return None if value is None else round(value, 1)

    @callback
    def track_rain(self, now: datetime) -> None:
        """Called every minute: while it rains, now is the last rain."""
        if self.raining:
            self.last_rain = now
            self.coordinator.async_schedule_save()

    async def async_refresh_forecast(self, _now: datetime | None = None) -> None:
        weather = self.entry.data.get(CONF_WEATHER)
        if not weather:
            self.forecast = []
            return
        try:
            response = await self.hass.services.async_call(
                "weather",
                "get_forecasts",
                {ATTR_ENTITY_ID: weather, "type": "hourly"},
                blocking=True,
                return_response=True,
            )
        except HomeAssistantError as err:
            _LOGGER.debug("Forecast from %s not available: %s", weather, err)
            return
        hours = []
        for item in (response or {}).get(weather, {}).get("forecast", []):
            start = dt_util.parse_datetime(item.get("datetime", ""))
            if start is not None:
                hours.append(ForecastHour(start=start, precipitation=item.get("precipitation")))
        self.forecast = hours

    # Holds

    def conflict_zones(self) -> list[str]:
        return [key for key, zone in self.coordinator.zones.items() if zone.data.get(CONF_MOWER_CONFLICT)]

    def hold(self) -> MowHold | None:
        conflicts = self.conflict_zones()
        today = dt_util.now().date()
        run = self.coordinator.run
        watering = (run is not None) and any(key in conflicts for key in run.zone_keys)
        watered_today = any(self.coordinator.last_watered.get(key) == today for key in conflicts)
        weather = self.coordinator.weather()
        return mow_hold(
            MowInputs(
                watering=watering,
                watered_today=watered_today,
                raining=self.raining,
                hours_since_rain=self.hours_since_rain,
                hours_to_rain=self.hours_to_rain,
                dry_hours=float(self.settings[SETTING_DRY_HOURS]),
                ahead_hours=float(self.settings[SETTING_RAIN_AHEAD_HOURS]),
                outdoor=weather.outdoor,
                frost_min=float(self.settings[SETTING_FROST_MIN]),
            )
        )

    # Schedule

    @callback
    def schedule(self) -> None:
        self.cancel()
        self.next_start = None
        if (not self.mower) or (not self.settings[SETTING_AUTOMATIC_MOWING]):
            return
        first = int(self.settings[SETTING_MOWER_SEASON_START])
        last = int(self.settings[SETTING_MOWER_SEASON_END])
        moment = dt_util.now()
        for _day in range(SEASON_SEARCH_DAYS):
            start = next_start(
                StartMode(self.settings[SETTING_MOWER_START_MODE]),
                moment,
                sunrise_after=self.coordinator.sunrise_after,
                sunset_after=self.coordinator.sunset_after,
                offset_h=float(self.settings[SETTING_MOWER_OFFSET]),
                at=time.fromisoformat(str(self.settings[SETTING_MOWER_START_TIME])),
            )
            if (start is None) or in_season(start.date(), first, last):
                break
            moment = start
        else:
            start = None
        self.next_start = start
        if start is not None:
            self._start_unsub = async_track_point_in_time(self.hass, self._async_scheduled_start, start)

    def cancel(self) -> None:
        if self._start_unsub is not None:
            self._start_unsub()
            self._start_unsub = None

    async def async_shutdown(self) -> None:
        self.cancel()
        if self._task is not None:
            self._task.cancel()

    async def _async_scheduled_start(self, _now: datetime) -> None:
        self._start_unsub = None
        self.schedule()
        await self.async_refresh_forecast()
        hold = self.hold()
        if hold is not None:
            title, message = mow_skipped_message(self.entry.title, hold, self.hours_since_rain, self.hours_to_rain)
            await async_notify(self.hass, self.entry, title, message)
            self.coordinator.async_update_listeners()
            return
        await self.async_start("scheduled")

    # Mowing

    async def async_mow_now(self) -> None:
        """Send the mower out now, regardless of the holds."""
        if not self.mower:
            raise HomeAssistantError("No mower is set up")
        if self.mowing:
            raise HomeAssistantError("The mower is already out")
        await self.async_start("manual")

    async def async_start(self, reason: str) -> None:
        try:
            await self.hass.services.async_call(
                "lawn_mower", "start_mowing", {ATTR_ENTITY_ID: self.mower}, blocking=True
            )
        except HomeAssistantError as err:
            _LOGGER.warning("%s: starting %s failed: %s", self.entry.title, self.mower, err)
            await async_notify(self.hass, self.entry, f"{self.entry.title}: mowing not started", str(err))
            return
        self.mowing = True
        since = self.hours_since_rain
        ahead = self.hours_to_rain
        details = []
        if since is not None:
            details.append(f"last rain {since:g} h ago")
        if ahead is not None:
            details.append(f"next rain in {ahead:g} h")
        forced = " (forced)" if reason == "manual" else ""
        message = "Mowing started" + forced + (": " + ", ".join(details) + "." if details else ".")
        await async_notify(self.hass, self.entry, f"{self.entry.title}: mowing", message)
        self._task = self.entry.async_create_background_task(self.hass, self._async_watch(), name="raincast mowing")
        self.coordinator.async_update_listeners()

    async def _async_watch(self) -> None:
        """Wait for the mower to leave and come back to its dock."""
        started = dt_util.now()
        left = False
        try:
            while dt_util.now() - started < timedelta(hours=MOWER_RETURN_HOURS):
                await asyncio.sleep(MOWER_POLL_SECONDS)
                docked = self._docked()
                if not docked:
                    left = True
                stayed = (not left) and (dt_util.now() - started >= timedelta(minutes=MOWER_LEAVE_MINUTES))
                if stayed:
                    await async_notify(
                        self.hass,
                        self.entry,
                        f"{self.entry.title}: mowing not started",
                        "The mower stayed in its dock; check it in its own app.",
                    )
                    return
                if left and docked:
                    await async_notify(
                        self.hass, self.entry, f"{self.entry.title}: mowing finished", "The mower is back in its dock."
                    )
                    return
            self.not_back = True
            await self.coordinator.async_check_now()
        finally:
            self.mowing = False
            self._task = None
            self.coordinator.async_update_listeners()

    def _docked(self) -> bool:
        state = self.hass.states.get(self.mower) if self.mower else None
        return (state is not None) and (state.state == DOCKED)

    @callback
    def track_dock(self) -> None:
        """Called every minute: a mower reported as not back counts as back once docked."""
        if self.not_back and self._docked():
            self.not_back = False
