"""Setup wizard, entities and watering runs inside a running Home Assistant."""

import asyncio
from datetime import timedelta

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service

from custom_components.raincast import coordinator as coordinator_module
from custom_components.raincast.const import DOMAIN

VALVE_1 = "input_boolean.valve_1"
VALVE_2 = "input_boolean.valve_2"
SOIL = "sensor.soil"
RAIN = "sensor.rain"


@pytest.fixture
async def garden(hass: HomeAssistant, monkeypatch):
    """Stand-ins for the valves and weather sensors; valve polling without waiting."""
    monkeypatch.setattr(coordinator_module, "POLL_SECONDS", 0)
    await async_setup_component(
        hass, "input_boolean", {"input_boolean": {"valve_1": {"initial": False}, "valve_2": {"initial": False}}}
    )
    hass.states.async_set(SOIL, "20.0", {"unit_of_measurement": "%"})
    hass.states.async_set(RAIN, "1.0", {"unit_of_measurement": "mm"})
    await hass.async_block_till_done()


@pytest.fixture
def notifications(hass: HomeAssistant):
    return async_mock_service(hass, "notify", "phone")


async def run_wizard(hass: HomeAssistant, valves=(VALVE_1, VALVE_2)) -> config_entries.ConfigEntry:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"name": "Garden"})
    assert result["step_id"] == "weather"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"soil_sensor": SOIL, "rain_sensor": RAIN}
    )
    assert result["step_id"] == "zone"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Lawn", "valves": list(valves), "roofed": False, "interval": 3, "duration": 1}
    )
    assert result["type"] is FlowResultType.MENU
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "finish"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    hass.config_entries.async_update_entry(entry, options={"notify_service": "phone"})
    await hass.async_block_till_done()
    return entry


def entity_id(hass: HomeAssistant, platform: str, unique_suffix: str) -> str:
    registry = er.async_get(hass)
    for entry in registry.entities.values():
        if (entry.platform == DOMAIN) and (entry.domain == platform) and entry.unique_id.endswith(unique_suffix):
            return entry.entity_id
    raise AssertionError(f"no {platform} entity ending with {unique_suffix}")


async def advance(hass: HomeAssistant, freezer, seconds: int, step: int = 5) -> None:
    """Move the clock forward while the run task polls its valves."""
    for _ in range(seconds // step):
        freezer.tick(timedelta(seconds=step))
        for _ in range(5):
            await asyncio.sleep(0)
    await hass.async_block_till_done()


async def test_wizard_creates_entry_with_zone(hass: HomeAssistant, garden) -> None:
    entry = await run_wizard(hass)
    assert entry.title == "Garden"
    [zone] = entry.subentries.values()
    assert zone.title == "Lawn"
    assert zone.data["valves"] == [VALVE_1, VALVE_2]


async def test_never_watered_zone_is_due(hass: HomeAssistant, garden) -> None:
    await run_wizard(hass)
    assert hass.states.get(entity_id(hass, "sensor", "_status")).state == "due"
    assert hass.states.get(entity_id(hass, "sensor", "_planned")).state == "2"
    assert hass.states.get(entity_id(hass, "number", "_duration_1")).state == "1.0"


async def test_wet_soil_holds_the_zone(hass: HomeAssistant, garden) -> None:
    await run_wizard(hass)
    hass.states.async_set(SOIL, "35.0", {"unit_of_measurement": "%"})
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=1))
    await hass.async_block_till_done()
    assert hass.states.get(entity_id(hass, "sensor", "_status")).state == "wet_soil"


async def test_dry_run_opens_nothing(hass: HomeAssistant, garden, notifications, freezer) -> None:
    await run_wizard(hass)
    start = (dt_util.now() + timedelta(minutes=2)).replace(second=0, microsecond=0)
    await hass.services.async_call(
        "time",
        "set_value",
        {"entity_id": entity_id(hass, "time", "_start_time"), "time": start.strftime("%H:%M:%S")},
        blocking=True,
    )
    await hass.services.async_call(
        "select",
        "select_option",
        {"entity_id": entity_id(hass, "select", "_start_mode"), "option": "at_time"},
        blocking=True,
    )
    freezer.move_to(start + timedelta(seconds=1))
    async_fire_time_changed(hass, start + timedelta(seconds=1))
    await hass.async_block_till_done()
    assert hass.states.get(VALVE_1).state == "off"
    assert notifications[-1].data["title"] == "Garden: watering plan (dry run)"
    assert "Lawn: 2 min, 2 valves, never watered" in notifications[-1].data["message"]


async def test_run_waters_valves_in_turn_and_books_the_date(
    hass: HomeAssistant, garden, notifications, freezer
) -> None:
    await run_wizard(hass)
    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": entity_id(hass, "switch", "_control")}, blocking=True
    )
    await hass.services.async_call(
        "button", "press", {"entity_id": entity_id(hass, "button", "_run_due")}, blocking=True
    )
    await advance(hass, freezer, 10)
    assert hass.states.get(VALVE_1).state == "on"
    assert hass.states.get(VALVE_2).state == "off"
    assert hass.states.get(entity_id(hass, "sensor", "_status")).state == "watering"
    await advance(hass, freezer, 60)
    assert hass.states.get(VALVE_1).state == "off"
    assert hass.states.get(VALVE_2).state == "on"
    await advance(hass, freezer, 70)
    assert hass.states.get(VALVE_2).state == "off"
    assert hass.states.get(entity_id(hass, "binary_sensor", "_running")).state == "off"
    assert hass.states.get(entity_id(hass, "date", "_last_watered")).state == dt_util.now().date().isoformat()
    assert hass.states.get(entity_id(hass, "sensor", "_status")).state == "waiting"
    assert notifications[-1].data["title"] == "Garden: watering finished"


async def test_manual_run_needs_valve_control(hass: HomeAssistant, garden) -> None:
    await run_wizard(hass)
    with pytest.raises(Exception, match="Valve control is off"):
        await hass.services.async_call(
            "button", "press", {"entity_id": entity_id(hass, "button", "_run_due")}, blocking=True
        )


async def test_dead_valve_is_reported_and_not_booked(hass: HomeAssistant, garden, notifications, freezer) -> None:
    # A switch without an integration behind it: the start command fails, the state never changes.
    hass.states.async_set("switch.dead", "off")
    await run_wizard(hass, valves=("switch.dead",))
    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": entity_id(hass, "switch", "_control")}, blocking=True
    )
    await hass.services.async_call(
        "button", "press", {"entity_id": entity_id(hass, "button", "_run_due")}, blocking=True
    )
    await advance(hass, freezer, 90)
    assert hass.states.get(entity_id(hass, "binary_sensor", "_running")).state == "off"
    assert hass.states.get(entity_id(hass, "date", "_last_watered")).state == "unknown"
    entry = hass.config_entries.async_entries(DOMAIN)[0]
    assert ir.async_get(hass).async_get_issue(DOMAIN, f"{entry.entry_id}_valve_not_opened") is not None
    titles = [call.data["title"] for call in notifications]
    assert "Garden: watering incomplete" in titles
    assert "Garden: valve did not open" in titles


async def test_turning_control_off_stops_the_run(hass: HomeAssistant, garden, freezer) -> None:
    await run_wizard(hass)
    control = entity_id(hass, "switch", "_control")
    await hass.services.async_call("switch", "turn_on", {"entity_id": control}, blocking=True)
    await hass.services.async_call(
        "button", "press", {"entity_id": entity_id(hass, "button", "_run_due")}, blocking=True
    )
    await advance(hass, freezer, 10)
    assert hass.states.get(VALVE_1).state == "on"
    await hass.services.async_call("switch", "turn_off", {"entity_id": control}, blocking=True)
    await advance(hass, freezer, 5)
    assert hass.states.get(VALVE_1).state == "off"
    assert hass.states.get(entity_id(hass, "binary_sensor", "_running")).state == "off"
    assert hass.states.get(entity_id(hass, "date", "_last_watered")).state == "unknown"


async def test_stop_button_ends_the_run(hass: HomeAssistant, garden, freezer) -> None:
    await run_wizard(hass)
    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": entity_id(hass, "switch", "_control")}, blocking=True
    )
    await hass.services.async_call(
        "button", "press", {"entity_id": entity_id(hass, "button", "_run_due")}, blocking=True
    )
    await advance(hass, freezer, 10)
    assert hass.states.get(VALVE_1).state == "on"
    await hass.services.async_call("button", "press", {"entity_id": entity_id(hass, "button", "_stop")}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get(VALVE_1).state == "off"
    assert hass.states.get(VALVE_2).state == "off"
    assert hass.states.get(entity_id(hass, "binary_sensor", "_running")).state == "off"
    assert hass.config_entries.async_entries(DOMAIN)[0].runtime_data._save_data()["active_run"] is None


async def test_scheduled_start_waters_with_control_on(hass: HomeAssistant, garden, notifications, freezer) -> None:
    await run_wizard(hass)
    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": entity_id(hass, "switch", "_control")}, blocking=True
    )
    start = (dt_util.now() + timedelta(minutes=2)).replace(second=0, microsecond=0)
    await hass.services.async_call(
        "time",
        "set_value",
        {"entity_id": entity_id(hass, "time", "_start_time"), "time": start.strftime("%H:%M:%S")},
        blocking=True,
    )
    await hass.services.async_call(
        "select",
        "select_option",
        {"entity_id": entity_id(hass, "select", "_start_mode"), "option": "at_time"},
        blocking=True,
    )
    freezer.move_to(start + timedelta(seconds=1))
    async_fire_time_changed(hass, start + timedelta(seconds=1))
    await hass.async_block_till_done()
    await advance(hass, freezer, 10)
    assert notifications[0].data["title"] == "Garden: watering plan"
    assert hass.states.get(VALVE_1).state == "on"
    next_start = dt_util.parse_datetime(hass.states.get(entity_id(hass, "sensor", "_next_start")).state)
    assert next_start == start + timedelta(days=1)


async def test_valves_of_an_interrupted_run_are_closed(hass: HomeAssistant, garden, hass_storage) -> None:
    await hass.services.async_call("input_boolean", "turn_on", {"entity_id": VALVE_1}, blocking=True)
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Garden",
        data={},
        subentries_data=[
            {
                "data": {"valves": [VALVE_1], "roofed": False},
                "subentry_type": "zone",
                "title": "Lawn",
                "unique_id": None,
            }
        ],
    )
    hass_storage[f"{DOMAIN}.{entry.entry_id}"] = {
        "version": 1,
        "key": f"{DOMAIN}.{entry.entry_id}",
        "data": {"active_run": {"started": None, "valves": [VALVE_1]}},
    }
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert hass.states.get(VALVE_1).state == "off"
