"""Constants of the RainCast integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "raincast"

# Main entry: optional weather inputs
CONF_RAIN_SENSOR: Final = "rain_sensor"
CONF_OUTDOOR_SENSOR: Final = "outdoor_sensor"
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

DEFAULT_SETTINGS: Final[dict[str, bool | float | int]] = {
    SETTING_AUTOMATIC: True,
    SETTING_RAIN_MAX: 4.0,
    SETTING_FROST_MIN: 3.0,
    SETTING_SEASON_START: 4,
    SETTING_SEASON_END: 10,
}

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
# A meter that has not reported for this long is not trusted for flow checks.
METER_STALE_SECONDS: Final = 600
# The meter reports with a delay, so the last valve of a run is booked a minute after it closed.
METER_SETTLE_SECONDS: Final = 60

STORAGE_VERSION: Final = 1
