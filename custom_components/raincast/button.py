"""Manual runs, stop and a forced mowing."""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import RainCastConfigEntry
from .const import CONF_MOWER
from .entity import RainCastEntity, RainCastZoneEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RainCastConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    buttons: list[ButtonEntity] = [RunDueButton(coordinator, "run_due"), StopButton(coordinator, "stop")]
    if entry.data.get(CONF_MOWER):
        buttons.append(MowNowButton(coordinator, "mow_now"))
    async_add_entities(buttons)
    for zone in coordinator.zones.values():
        async_add_entities([RunZoneButton(coordinator, zone, "run")], config_subentry_id=zone.subentry_id)


class RunDueButton(RainCastEntity, ButtonEntity):
    """Waters the zones due right now, by interval and weather."""

    async def async_press(self) -> None:
        await self.coordinator.async_run_due()


class StopButton(RainCastEntity, ButtonEntity):
    """Ends the run in progress and closes every valve of the controller."""

    async def async_press(self) -> None:
        await self.coordinator.async_stop()


class RunZoneButton(RainCastZoneEntity, ButtonEntity):
    """Waters this zone now, regardless of its interval and the weather."""

    async def async_press(self) -> None:
        await self.coordinator.async_run_zone(self.zone_key)


class MowNowButton(RainCastEntity, ButtonEntity):
    """Sends the mower out now, regardless of watering and rain."""

    async def async_press(self) -> None:
        await self.coordinator.mowing.async_mow_now()
