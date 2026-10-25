"""Constants of the RainCast integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "raincast"

# Main entry: optional weather inputs
CONF_SOIL_SENSOR: Final = "soil_sensor"
CONF_RAIN_SENSOR: Final = "rain_sensor"
# Option: notify service (without the "notify." prefix) told about plans, runs and faults.
CONF_NOTIFY_SERVICE: Final = "notify_service"

# Zone subentry
SUBENTRY_ZONE: Final = "zone"
CONF_VALVES: Final = "valves"
CONF_ROOFED: Final = "roofed"
CONF_INTERVAL: Final = "interval"
CONF_DURATION: Final = "duration"

DEFAULT_NAME: Final = "RainCast"
DEFAULT_INTERVAL: Final = 3
DEFAULT_DURATION: Final = 15.0

# Settings kept in the store and exposed as entities.
SETTING_START_MODE: Final = "start_mode"
SETTING_START_TIME: Final = "start_time"
SETTING_SUNRISE_OFFSET: Final = "sunrise_offset"
SETTING_SOIL_MAX: Final = "soil_max"
SETTING_RAIN_MAX: Final = "rain_max"

DEFAULT_SETTINGS: Final[dict[str, str | float]] = {
    SETTING_START_MODE: "before_sunrise",
    SETTING_START_TIME: "06:00:00",
    SETTING_SUNRISE_OFFSET: 2.0,
    SETTING_SOIL_MAX: 26.0,
    SETTING_RAIN_MAX: 4.0,
}

# Valve state is polled while it waters.
POLL_SECONDS: Final = 5
# Faults and the day's plan are checked once a minute.
CHECK_SECONDS: Final = 60
# Integrations whose valves take the run time with the start command.
NATIVE_START: Final[dict[str, tuple[str, str]]] = {
    "bhyve": ("bhyve", "start_watering"),
}
RUN_LOG_SIZE: Final = 60

STORAGE_VERSION: Final = 1
