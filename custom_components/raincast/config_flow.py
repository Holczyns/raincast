"""Setup wizard: weather inputs and zones."""

from __future__ import annotations

from typing import Any, override

import probatio
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryData,
    ConfigSubentryFlow,
    OptionsFlow,
    SubentryFlowResult,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CONF_DURATION,
    CONF_INTERVAL,
    CONF_NOTIFY_SERVICE,
    CONF_RAIN_SENSOR,
    CONF_ROOFED,
    CONF_SOIL_SENSOR,
    CONF_VALVES,
    CONF_WATER_METER,
    DEFAULT_DURATION,
    DEFAULT_INTERVAL,
    DEFAULT_NAME,
    DOMAIN,
    SUBENTRY_ZONE,
)
from .problems import notify_services

VALVE_DOMAINS = ["valve", "switch", "input_boolean"]
WEATHER_KEYS = (CONF_SOIL_SENSOR, CONF_RAIN_SENSOR, CONF_WATER_METER)


def _number(minimum: float, maximum: float, step: float, unit: str) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(min=minimum, max=maximum, step=step, mode=NumberSelectorMode.BOX, unit_of_measurement=unit)
    )


def _optional(key: str, defaults: dict[str, Any]) -> probatio.Optional:
    """Optional field that keeps a previously chosen entity as suggestion."""
    value = defaults.get(key)
    if value is None:
        return probatio.Optional(key)
    return probatio.Optional(key, description={"suggested_value": value})


def weather_schema(defaults: dict[str, Any]) -> probatio.Schema:
    sensor = EntitySelector(EntitySelectorConfig(filter={"domain": ["sensor", "input_number"]}))
    meter = EntitySelector(EntitySelectorConfig(filter={"domain": "sensor", "device_class": "water"}))
    return probatio.Schema(
        {
            _optional(CONF_SOIL_SENSOR, defaults): sensor,
            _optional(CONF_RAIN_SENSOR, defaults): sensor,
            _optional(CONF_WATER_METER, defaults): meter,
        }
    )


def zone_schema(defaults: dict[str, Any], with_tuning: bool) -> probatio.Schema:
    fields: dict[Any, Any] = {
        probatio.Required(CONF_NAME, default=defaults.get(CONF_NAME, probatio.UNDEFINED)): TextSelector(),
        probatio.Required(CONF_VALVES, default=defaults.get(CONF_VALVES, probatio.UNDEFINED)): EntitySelector(
            EntitySelectorConfig(filter={"domain": VALVE_DOMAINS}, multiple=True)
        ),
        probatio.Required(CONF_ROOFED, default=defaults.get(CONF_ROOFED, False)): bool,
    }
    if with_tuning:
        fields[probatio.Required(CONF_INTERVAL, default=DEFAULT_INTERVAL)] = _number(1, 30, 1, "d")
        fields[probatio.Required(CONF_DURATION, default=DEFAULT_DURATION)] = _number(1, 240, 1, "min")
    return probatio.Schema(fields)


def _zone_errors(user_input: dict[str, Any]) -> dict[str, str]:
    if not user_input.get(CONF_VALVES):
        return {CONF_VALVES: "no_valves"}
    return {}


def _zone_subentry(zone: dict[str, Any]) -> ConfigSubentryData:
    data = {key: value for key, value in zone.items() if key != CONF_NAME}
    return ConfigSubentryData(data=data, subentry_type=SUBENTRY_ZONE, title=zone[CONF_NAME], unique_id=None)


class RainCastConfigFlow(ConfigFlow, domain=DOMAIN):
    """Guided setup; zones collected here become subentries of the entry."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._zones: list[dict[str, Any]] = []

    @classmethod
    @callback
    @override
    def async_get_supported_subentry_types(cls, config_entry: ConfigEntry) -> dict[str, type[ConfigSubentryFlow]]:
        return {SUBENTRY_ZONE: ZoneSubentryFlow}

    @staticmethod
    @callback
    @override
    def async_get_options_flow(config_entry: ConfigEntry) -> RainCastOptionsFlow:
        return RainCastOptionsFlow()

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._data[CONF_NAME] = user_input[CONF_NAME]
            return await self.async_step_weather()
        schema = probatio.Schema({probatio.Required(CONF_NAME, default=DEFAULT_NAME): TextSelector()})
        return self.async_show_form(step_id="user", data_schema=schema)

    async def async_step_weather(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_zone()
        return self.async_show_form(step_id="weather", data_schema=weather_schema({}))

    async def async_step_zone(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _zone_errors(user_input)
            if not errors:
                self._zones.append(user_input)
                return await self.async_step_zones()
        return self.async_show_form(
            step_id="zone", data_schema=zone_schema(user_input or {}, with_tuning=True), errors=errors
        )

    async def async_step_zones(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        names = ", ".join(zone[CONF_NAME] for zone in self._zones)
        return self.async_show_menu(
            step_id="zones", menu_options=["zone", "finish"], description_placeholders={"zones": names}
        )

    async def async_step_finish(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        data = dict(self._data)
        title = data.pop(CONF_NAME)
        return self.async_create_entry(
            title=title, data=data, subentries=[_zone_subentry(zone) for zone in self._zones]
        )

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        """Change the weather inputs; limits and start times are changed as entities."""
        entry = self._get_reconfigure_entry()
        current = dict(entry.data)
        if user_input is not None:
            data = {key: value for key, value in current.items() if key not in WEATHER_KEYS}
            data.update({key: value for key, value in user_input.items() if value})
            return self.async_update_reload_and_abort(entry, data=data)
        return self.async_show_form(step_id="reconfigure", data_schema=weather_schema(current))


class RainCastOptionsFlow(OptionsFlow):
    """Notifications; the entry reloads after saving."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)
        options = self.config_entry.options
        schema = probatio.Schema(
            {
                _optional(CONF_NOTIFY_SERVICE, dict(options)): SelectSelector(
                    SelectSelectorConfig(
                        options=notify_services(self.hass), mode=SelectSelectorMode.DROPDOWN, custom_value=True
                    )
                ),
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)


class ZoneSubentryFlow(ConfigSubentryFlow):
    """Add or edit a zone; interval and valve times are later changed as entities."""

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _zone_errors(user_input)
            if not errors:
                zone = _zone_subentry(user_input)
                return self.async_create_entry(title=zone["title"], data=zone["data"])
        return self.async_show_form(
            step_id="user", data_schema=zone_schema(user_input or {}, with_tuning=True), errors=errors
        )

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        subentry = self._get_reconfigure_subentry()
        errors: dict[str, str] = {}
        if user_input is not None:
            errors = _zone_errors(user_input)
            if not errors:
                data = {key: value for key, value in subentry.data.items() if key in (CONF_INTERVAL, CONF_DURATION)}
                data.update({key: value for key, value in user_input.items() if key != CONF_NAME})
                return self.async_update_and_abort(self._get_entry(), subentry, data=data, title=user_input[CONF_NAME])
        defaults = {CONF_NAME: subentry.title, **subentry.data}
        return self.async_show_form(
            step_id="reconfigure", data_schema=zone_schema(defaults, with_tuning=False), errors=errors
        )
