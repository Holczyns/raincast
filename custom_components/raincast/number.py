"""Weather limits, sunrise offset, zone intervals and valve durations."""

from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberEntityDescription, NumberMode
from homeassistant.config_entries import ConfigSubentry
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfLength, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import CONF_INTERVAL, CONF_VALVES, SETTING_RAIN_MAX, SETTING_SOIL_MAX, SETTING_SUNRISE_OFFSET
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


SETTINGS: tuple[NumberEntityDescription, ...] = (
    _number(SETTING_SUNRISE_OFFSET, 0, 6, 0.25, UnitOfTime.HOURS),
    _number(SETTING_SOIL_MAX, 0, 100, 1, PERCENTAGE),
    _number(SETTING_RAIN_MAX, 0, 50, 0.5, UnitOfLength.MILLIMETERS),
)
INTERVAL = _number(CONF_INTERVAL, 1, 30, 1, UnitOfTime.DAYS)
DURATION = _number("duration", 0, 240, 1, UnitOfTime.MINUTES)


def _valve_name(hass: HomeAssistant, valve: str) -> str:
    """Name of the valve for the duration entity; its integration may not be loaded yet."""
    state = hass.states.get(valve)
    if state is not None:
        return str(state.attributes.get("friendly_name", valve))
    entity = er.async_get(hass).async_get(valve)
    if (entity is not None) and (entity.name or entity.original_name):
        return str(entity.name or entity.original_name)
    return valve


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities(SettingNumber(coordinator, description) for description in SETTINGS)
    for zone in coordinator.zones.values():
        entities: list[NumberEntity] = [IntervalNumber(coordinator, zone, INTERVAL)]
        for index, valve in enumerate(zone.data.get(CONF_VALVES, [])):
            entities.append(DurationNumber(coordinator, zone, index, valve, _valve_name(hass, valve)))
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
