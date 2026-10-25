"""Base entities: one device for the controller, one per zone."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import RainCastCoordinator
from .engine import ZonePlan


def controller_device_info(entry: ConfigEntry) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, entry.entry_id)},
        name=entry.title,
        manufacturer="RainCast",
        model="Irrigation controller",
    )


class RainCastEntity(CoordinatorEntity[RainCastCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: RainCastCoordinator, key: str) -> None:
        super().__init__(coordinator)
        entry = coordinator.entry
        self._attr_translation_key = key
        self._attr_unique_id = f"{entry.entry_id}_{key}"
        self._attr_device_info = controller_device_info(entry)


class RainCastZoneEntity(CoordinatorEntity[RainCastCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: RainCastCoordinator, zone: ConfigSubentry, key: str) -> None:
        super().__init__(coordinator)
        self.zone_key = zone.subentry_id
        self._attr_translation_key = f"zone_{key}"
        self._attr_unique_id = f"{zone.subentry_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, zone.subentry_id)},
            name=zone.title,
            manufacturer="RainCast",
            model="Zone",
            via_device_id=coordinator.device_id,
        )

    @property
    def zone_plan(self) -> ZonePlan | None:
        return next((zone for zone in self.coordinator.data.zones if zone.key == self.zone_key), None)
