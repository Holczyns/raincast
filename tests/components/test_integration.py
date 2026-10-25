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
METER = "sensor.meter"


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


async def run_wizard(
    hass: HomeAssistant, valves=(VALVE_1, VALVE_2), meter: str | None = None, duration: float = 1
) -> config_entries.ConfigEntry:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"name": "Garden"})
    assert result["step_id"] == "weather"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"soil_sensor": SOIL, "rain_sensor": RAIN, **({"water_meter": meter} if meter else {})}
    )
    assert result["step_id"] == "zone"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {"name": "Lawn", "valves": list(valves), "roofed": False, "interval": 3, "duration": duration},
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


async def advance(hass: HomeAssistant, freezer, seconds: int, step: int = 5, on_tick=None) -> None:
    """Move the clock forward while the run task polls its valves; on_tick runs after every step."""
    for _ in range(seconds // step):
        freezer.tick(timedelta(seconds=step))
        if on_tick is not None:
            on_tick()
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


async def test_panel_commands_change_zones_and_sources(hass: HomeAssistant, garden, hass_ws_client) -> None:
    entry = await run_wizard(hass)
    client = await hass_ws_client(hass)

    await client.send_json_auto_id({"type": "raincast/entries"})
    [described] = (await client.receive_json())["result"]
    [zone] = described["zones"]
    assert zone["entities"]["duration_0"].startswith("number.")
    assert described["sources"]["soil_sensor"] == SOIL

    await client.send_json_auto_id(
        {
            "type": "raincast/add_zone",
            "entry_id": entry.entry_id,
            "name": "Greenhouse",
            "valves": [VALVE_2],
            "roofed": True,
        }
    )
    assert (await client.receive_json())["success"]
    await hass.async_block_till_done()
    assert sorted(subentry.title for subentry in entry.subentries.values()) == ["Greenhouse", "Lawn"]

    await client.send_json_auto_id(
        {
            "type": "raincast/update_zone",
            "entry_id": entry.entry_id,
            "zone_id": zone["id"],
            "name": "Lawn",
            "valves": ["switch.missing"],
            "roofed": False,
        }
    )
    assert not (await client.receive_json())["success"]

    await client.send_json_auto_id({"type": "raincast/remove_zone", "entry_id": entry.entry_id, "zone_id": zone["id"]})
    assert (await client.receive_json())["success"]
    await hass.async_block_till_done()
    assert [subentry.title for subentry in entry.subentries.values()] == ["Greenhouse"]

    await client.send_json_auto_id({"type": "raincast/update_sources", "entry_id": entry.entry_id, "rain_sensor": RAIN})
    assert (await client.receive_json())["success"]
    await hass.async_block_till_done()
    assert "soil_sensor" not in entry.data

    await client.send_json_auto_id({"type": "raincast/set_options", "entry_id": entry.entry_id, "notify_service": None})
    assert (await client.receive_json())["success"]
    await hass.async_block_till_done()
    assert "notify_service" not in entry.options


async def test_manual_times_run_given_valves_without_booking_a_short_run(
    hass: HomeAssistant, garden, hass_ws_client, freezer
) -> None:
    entry = await run_wizard(hass)
    [zone_id] = entry.subentries
    client = await hass_ws_client(hass)
    message = {"type": "raincast/run_zone", "entry_id": entry.entry_id, "zone_id": zone_id}

    await client.send_json_auto_id({**message, "minutes": {VALVE_1: 1, VALVE_2: 0}})
    assert (await client.receive_json())["error"]["message"] == "Valve control is off"

    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": entity_id(hass, "switch", "_control")}, blocking=True
    )
    await client.send_json_auto_id({**message, "minutes": {VALVE_1: 0, VALVE_2: 0}})
    assert not (await client.receive_json())["success"]

    await client.send_json_auto_id({**message, "minutes": {VALVE_1: 1, VALVE_2: 0}})
    assert (await client.receive_json())["success"]
    await advance(hass, freezer, 10)
    assert hass.states.get(VALVE_1).state == "on"
    await advance(hass, freezer, 70)
    assert hass.states.get(VALVE_1).state == "off"
    assert hass.states.get(VALVE_2).state == "off"
    assert hass.states.get(entity_id(hass, "binary_sensor", "_running")).state == "off"
    # 1 of the zone's 2 minutes: the zone stays due.
    assert hass.states.get(entity_id(hass, "date", "_last_watered")).state == "unknown"
    assert entry.runtime_data.log[-1]["zones"][0]["planned_min"] == 1.0


class Meter:
    """Water meter in m³ that runs at a given flow while any valve is on, reported on every tick."""

    def __init__(self, hass: HomeAssistant, flow_l_min: float, step: int = 5) -> None:
        self.hass = hass
        self.flow = flow_l_min
        self.step = step
        self.liters = 17927.0
        self.report()

    def report(self) -> None:
        self.hass.states.async_set(
            METER,
            f"{self.liters / 1000:.3f}",
            {"unit_of_measurement": "m³", "device_class": "water"},
            force_update=True,
        )

    def __call__(self) -> None:
        if any(self.hass.states.get(valve).state == "on" for valve in (VALVE_1, VALVE_2)):
            self.liters += self.flow * self.step / 60
        self.report()


async def start_zone(hass: HomeAssistant) -> None:
    await hass.services.async_call(
        "switch", "turn_on", {"entity_id": entity_id(hass, "switch", "_control")}, blocking=True
    )
    await hass.services.async_call(
        "button", "press", {"entity_id": entity_id(hass, "button", "_run_due")}, blocking=True
    )


async def test_metered_run_books_litres_per_valve_and_zone(hass: HomeAssistant, garden, freezer) -> None:
    meter = Meter(hass, flow_l_min=6.0)
    entry = await run_wizard(hass, meter=METER)
    await start_zone(hass)
    await advance(hass, freezer, 220, on_tick=meter)
    assert hass.states.get(entity_id(hass, "binary_sensor", "_running")).state == "off"
    [zone] = entry.runtime_data.log[-1]["zones"]
    assert zone["watered"]
    assert [valve["entity_id"] for valve in zone["valves"]] == [VALVE_1, VALVE_2]
    for valve in zone["valves"]:
        assert valve["liters"] == pytest.approx(6.0, abs=1.0)
        assert valve["flow"] == pytest.approx(6.0, abs=1.0)
    assert float(hass.states.get(entity_id(hass, "sensor", "_water_used")).state) == pytest.approx(12.0, abs=1.5)


async def test_valve_without_water_is_reported_and_not_counted(
    hass: HomeAssistant, garden, notifications, freezer
) -> None:
    meter = Meter(hass, flow_l_min=0.0)
    entry = await run_wizard(hass, valves=(VALVE_1,), meter=METER, duration=3)
    await start_zone(hass)
    await advance(hass, freezer, 300, on_tick=meter)
    [zone] = entry.runtime_data.log[-1]["zones"]
    assert zone["valves"][0]["no_flow"]
    assert not zone["watered"]
    assert hass.states.get(entity_id(hass, "date", "_last_watered")).state == "unknown"
    assert ir.async_get(hass).async_get_issue(DOMAIN, f"{entry.entry_id}_no_flow") is not None


async def test_valve_above_its_flow_limit_is_closed(hass: HomeAssistant, garden, notifications, freezer) -> None:
    meter = Meter(hass, flow_l_min=24.0)
    entry = await run_wizard(hass, valves=(VALVE_1,), meter=METER, duration=10)
    await hass.services.async_call(
        "number", "set_value", {"entity_id": entity_id(hass, "number", "_max_flow_0"), "value": 10}, blocking=True
    )
    await start_zone(hass)
    await advance(hass, freezer, 200, on_tick=meter)
    assert hass.states.get(VALVE_1).state == "off"
    await advance(hass, freezer, 70, on_tick=meter)
    [zone] = entry.runtime_data.log[-1]["zones"]
    assert zone["valves"][0]["flow_high"]
    assert zone["valves"][0]["minutes"] < 4
    assert ir.async_get(hass).async_get_issue(DOMAIN, f"{entry.entry_id}_flow_high") is not None
    assert "Garden: flow too high" in [call.data["title"] for call in notifications]
