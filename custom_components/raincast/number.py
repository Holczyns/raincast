"""Rain and frost limits; per zone the start offset, soil limit, interval, valve times and flow limits."""

from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberEntityDescription, NumberMode
from homeassistant.config_entries import ConfigSubentry
from homeassistant.const import (
    PERCENTAGE,
    EntityCategory,
    UnitOfLength,
    UnitOfTemperature,
    UnitOfTime,
    UnitOfVolumeFlowRate,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import (
    CONF_INTERVAL,
    CONF_MAX_FLOW,
    CONF_MOWER,
    CONF_OUTDOOR_SENSOR,
    CONF_VALVES,
    CONF_WATER_METER,
    SETTING_DRY_HOURS,
    SETTING_FROST_MIN,
    SETTING_MOWER_OFFSET,
    SETTING_RAIN_AHEAD_HOURS,
    SETTING_RAIN_MAX,
    SETTING_SOIL_MAX,
    SETTING_SUNRISE_OFFSET,
)
from .coordinator import RainCastCoordinator
from .entity import RainCastEntity, RainCastZoneEntity

CONFIG = EntityCategory.CONFIG


def _number(key: str, minimum: float, maximum: float, step: float, unit: str | None) -> NumberEntityDescription:
    return NumberEntityDescription(
        key=key,
        mode=NumberMode.BOX,
        native_min_value=minimum,
        native_max_value=maximum,
        native_step=step,
        native_unit_of_measurement=unit,
        entity_category=CONFIG,
    )


RAIN_MAX = _number(SETTING_RAIN_MAX, 0, 50, 0.5, UnitOfLength.MILLIMETERS)
FROST_MIN = _number(SETTING_FROST_MIN, -10, 15, 0.5, UnitOfTemperature.CELSIUS)
MOWER_SETTINGS: tuple[NumberEntityDescription, ...] = (
    _number(SETTING_MOWER_OFFSET, -12, 12, 0.25, UnitOfTime.HOURS),
    _number(SETTING_DRY_HOURS, 0, 72, 1, UnitOfTime.HOURS),
    _number(SETTING_RAIN_AHEAD_HOURS, 0, 24, 0.5, UnitOfTime.HOURS),
)
ZONE_SETTINGS: tuple[NumberEntityDescription, ...] = (
    _number(SETTING_SUNRISE_OFFSET, 0, 6, 0.25, UnitOfTime.HOURS),
    _number(SETTING_SOIL_MAX, 0, 100, 1, PERCENTAGE),
)
INTERVAL = _number(CONF_INTERVAL, 1, 30, 1, UnitOfTime.DAYS)
DURATION = _number("duration", 0, 240, 1, UnitOfTime.MINUTES)
MAX_FLOW = _number(CONF_MAX_FLOW, 0, 200, 0.5, UnitOfVolumeFlowRate.LITERS_PER_MINUTE)


def _valve_name(hass: HomeAssistant, valve: str) -> str:
    """Name of the valve for the duration entity.

    The registry name comes first: it is there before the valve's integration
    has loaded, so the name is the same after every restart.
    """
    entity = er.async_get(hass).async_get(valve)
    if (entity is not None) and (entity.name or entity.original_name):
        return str(entity.name or entity.original_name)
    state = hass.states.get(valve)
    if state is not None:
        return str(state.attributes.get("friendly_name", valve))
    return valve


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    metered = bool(entry.data.get(CONF_WATER_METER))
    controller: list[NumberEntity] = [SettingNumber(coordinator, RAIN_MAX)]
    # The frost limit needs an outdoor sensor to be checked against.
    if entry.data.get(CONF_OUTDOOR_SENSOR):
        controller.append(SettingNumber(coordinator, FROST_MIN))
    if entry.data.get(CONF_MOWER):
        controller += [SettingNumber(coordinator, description) for description in MOWER_SETTINGS]
    async_add_entities(controller)
    for zone in coordinator.zones.values():
        entities: list[NumberEntity] = [IntervalNumber(coordinator, zone, INTERVAL)]
        entities += [ZoneSettingNumber(coordinator, zone, description) for description in ZONE_SETTINGS]
        for index, valve in enumerate(zone.data.get(CONF_VALVES, [])):
            name = _valve_name(hass, valve)
            entities.append(DurationNumber(coordinator, zone, index, valve, name))
            # Flow limits need a meter to be checked against.
            if metered:
                entities.append(MaxFlowNumber(coordinator, zone, index, valve, name))
        async_add_entities(entities, config_subentry_id=zone.subentry_id)


class SettingNumber(RainCastEntity, NumberEntity):
    entity_description: NumberEntityDescription

    def __init__(self, coordinator: RainCastCoordinator, description: NumberEntityDescription) -> None:
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> float:
        return float(self.coordinator.settings[self.entity_description.key])

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_setting(self.entity_description.key, value)


class IntervalNumber(RainCastZoneEntity, NumberEntity):
    entity_description: NumberEntityDescription

    def __init__(
        self, coordinator: RainCastCoordinator, zone: ConfigSubentry, description: NumberEntityDescription
    ) -> None:
        super().__init__(coordinator, zone, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> int:
        return int(self.coordinator.zone_tuning[self.zone_key][CONF_INTERVAL])

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_interval(self.zone_key, round(value))


class DurationNumber(RainCastZoneEntity, NumberEntity):
    """Watering time of one valve of the zone; 0 leaves the valve out."""

    entity_description = DURATION

    def __init__(
        self, coordinator: RainCastCoordinator, zone: ConfigSubentry, index: int, valve: str, valve_name: str
    ) -> None:
        super().__init__(coordinator, zone, f"duration_{index}")
        self.valve = valve
        # One translation for every valve; the valve name tells them apart.
        self._attr_translation_key = "zone_duration"
        self._attr_translation_placeholders = {"valve": valve_name}

    @property
    def native_value(self) -> float:
        return float(self.coordinator.zone_tuning[self.zone_key]["durations"][self.valve])

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_duration(self.zone_key, self.valve, value)


class MaxFlowNumber(RainCastZoneEntity, NumberEntity):
    """Highest mean flow allowed for one valve; above it the valve is closed. 0 turns the check off."""

    entity_description = MAX_FLOW

    def __init__(
        self, coordinator: RainCastCoordinator, zone: ConfigSubentry, index: int, valve: str, valve_name: str
    ) -> None:
        super().__init__(coordinator, zone, f"max_flow_{index}")
        self.valve = valve
        self._attr_translation_key = "zone_max_flow"
        self._attr_translation_placeholders = {"valve": valve_name}

    @property
    def native_value(self) -> float:
        return float(self.coordinator.zone_tuning[self.zone_key]["max_flows"][self.valve])

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_max_flow(self.zone_key, self.valve, value)


class ZoneSettingNumber(RainCastZoneEntity, NumberEntity):
    """Start offset before sunrise or soil limit of one zone."""

    entity_description: NumberEntityDescription

    def __init__(
        self, coordinator: RainCastCoordinator, zone: ConfigSubentry, description: NumberEntityDescription
    ) -> None:
        super().__init__(coordinator, zone, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> float:
        return float(self.coordinator.zone_tuning[self.zone_key][self.entity_description.key])

    async def async_set_native_value(self, value: float) -> None:
        self.coordinator.async_set_zone_setting(self.zone_key, self.entity_description.key, value)
