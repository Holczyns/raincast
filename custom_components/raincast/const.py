"""Constants of the RainCast integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "raincast"

# Main entry: optional weather inputs
CONF_RAIN_SENSOR: Final = "rain_sensor"
CONF_OUTDOOR_SENSOR: Final = "outdoor_sensor"
# Main entry: weather entity for rain now and the hourly forecast, and the mower
CONF_WEATHER: Final = "weather"
CONF_MOWER: Final = "mower"
# Main entry: optional water meter, read while valves are open
CONF_WATER_METER: Final = "water_meter"
# Option: notify service (without the "notify." prefix) told about plans, runs and faults.
CONF_NOTIFY_SERVICE: Final = "notify_service"

# Zone subentry
SUBENTRY_ZONE: Final = "zone"
CONF_VALVES: Final = "valves"
CONF_ROOFED: Final = "roofed"
# Zone subentry: optional soil sensor; a zone without one does not look at the soil
CONF_SOIL_SENSOR: Final = "soil_sensor"
# Zone subentry: watering the zone today keeps the mower in
CONF_MOWER_CONFLICT: Final = "mower_conflict"
CONF_INTERVAL: Final = "interval"
CONF_DURATION: Final = "duration"
CONF_MAX_FLOW: Final = "max_flow"

DEFAULT_NAME: Final = "RainCast"
DEFAULT_INTERVAL: Final = 3
DEFAULT_DURATION: Final = 15.0

# Settings of the controller, kept in the store and exposed as entities.
SETTING_AUTOMATIC: Final = "automatic"
SETTING_RAIN_MAX: Final = "rain_max"
SETTING_FROST_MIN: Final = "frost_min"
SETTING_SEASON_START: Final = "season_start"
SETTING_SEASON_END: Final = "season_end"
SETTING_AUTOMATIC_MOWING: Final = "automatic_mowing"
SETTING_MOWER_START_MODE: Final = "mower_start_mode"
SETTING_MOWER_START_TIME: Final = "mower_start_time"
SETTING_MOWER_OFFSET: Final = "mower_offset"
SETTING_MOWER_SEASON_START: Final = "mower_season_start"
SETTING_MOWER_SEASON_END: Final = "mower_season_end"
SETTING_DRY_HOURS: Final = "dry_hours"
SETTING_RAIN_AHEAD_HOURS: Final = "rain_ahead_hours"

DEFAULT_SETTINGS: Final[dict[str, bool | float | int | str]] = {
    SETTING_AUTOMATIC: True,
    SETTING_RAIN_MAX: 4.0,
    SETTING_FROST_MIN: 3.0,
    # In October the soil stays wet; the grass still grows, so mowing runs a month longer.
    SETTING_SEASON_START: 4,
    SETTING_SEASON_END: 9,
    # Off until the user has retired any other schedule of the mower.
    SETTING_AUTOMATIC_MOWING: False,
    SETTING_MOWER_START_MODE: "sunrise",
    SETTING_MOWER_START_TIME: "10:00:00",
    SETTING_MOWER_OFFSET: 4.0,
    SETTING_MOWER_SEASON_START: 4,
    SETTING_MOWER_SEASON_END: 10,
    SETTING_DRY_HOURS: 12.0,
    SETTING_RAIN_AHEAD_HOURS: 2.0,
}
MOWER_SETTINGS: Final = (
    SETTING_AUTOMATIC_MOWING,
    SETTING_MOWER_START_MODE,
    SETTING_MOWER_START_TIME,
    SETTING_MOWER_OFFSET,
    SETTING_MOWER_SEASON_START,
    SETTING_MOWER_SEASON_END,
)

# Settings of each zone, kept in the store and exposed as entities.
SETTING_START_MODE: Final = "start_mode"
SETTING_START_TIME: Final = "start_time"
SETTING_SUNRISE_OFFSET: Final = "sunrise_offset"
SETTING_SOIL_MAX: Final = "soil_max"

DEFAULT_ZONE_SETTINGS: Final[dict[str, str | float]] = {
    SETTING_START_MODE: "before_sunrise",
    SETTING_START_TIME: "06:00:00",
    SETTING_SUNRISE_OFFSET: 2.0,
    SETTING_SOIL_MAX: 26.0,
}
START_SETTINGS: Final = (SETTING_START_MODE, SETTING_START_TIME, SETTING_SUNRISE_OFFSET)
# Starts this close together run as one.
START_BATCH_SECONDS: Final = 60
# A season shorter than a year leaves days without a start; the search stops after a year.
SEASON_SEARCH_DAYS: Final = 370

# Valve state is polled while it waters.
POLL_SECONDS: Final = 5
# Faults and the day's plan are checked once a minute.
CHECK_SECONDS: Final = 60
# Integrations whose valves take the run time with the start command.
NATIVE_START: Final[dict[str, tuple[str, str]]] = {
    "bhyve": ("bhyve", "start_watering"),
}
RUN_LOG_SIZE: Final = 60
# The hourly forecast for the next rain is fetched this often.
FORECAST_MINUTES: Final = 30
# The mower has to leave its dock this soon after the start, and be back this soon.
MOWER_LEAVE_MINUTES: Final = 10
MOWER_RETURN_HOURS: Final = 4
MOWER_POLL_SECONDS: Final = 30
# A meter that has not reported for this long is not trusted for flow checks.
METER_STALE_SECONDS: Final = 600
# The meter reports with a delay, so the last valve of a run is booked a minute after it closed.
METER_SETTLE_SECONDS: Final = 60

STORAGE_VERSION: Final = 1
