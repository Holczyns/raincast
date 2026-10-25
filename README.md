<p align="center">
  <img src="custom_components/raincast/brand/logo@2x.png" alt="RainCast" height="96">
</p>

<p align="center">
  Weather-aware irrigation for Home Assistant: zones with their own intervals, soil and rain holds, metered valves.
</p>

<p align="center">
  <a href="https://github.com/Holczyns/raincast/actions/workflows/validate.yml"><img src="https://github.com/Holczyns/raincast/actions/workflows/validate.yml/badge.svg" alt="Validate"></a>
  <a href="https://github.com/Holczyns/raincast/actions/workflows/tests.yml"><img src="https://github.com/Holczyns/raincast/actions/workflows/tests.yml/badge.svg" alt="Tests"></a>
  <a href="https://hacs.xyz"><img src="https://img.shields.io/badge/HACS-custom-orange.svg" alt="HACS custom repository"></a>
</p>

RainCast waters a garden from Home Assistant once a day, a number of hours before sunrise or at a fixed time. Each
zone has its own interval and its own valves; zones open to the sky are held when the soil is wet or rain is coming.
The valves run one after another, and only the time a valve actually reports open counts as watering.

It drives any `valve`, `switch` or `input_boolean` entity, so it works with irrigation controllers such as Orbit
B-hyve, relays on ESPHome or Shelly devices, and smart plugs alike.

![Home tab of the RainCast panel](docs/images/panel-home.png)

## Features

- **Setup wizard** for the weather inputs, the water meter and the zones.
- **Sidebar panel** with the day's plan, the weather against its limits, a card per zone, a run log, water and valve
  history, all settings and a built-in guide.
- **Zones** with any number of valves, an interval in days, a time per valve and an *under a roof* flag for
  greenhouses and covered beds.
- **Weather holds**: a soil moisture sensor and a rain forecast sensor, both optional, each with its own limit.
- **Dry run** by default. RainCast sends the day's plan as a notification but opens no valve until valve control is
  switched on, so it can be compared with the current setup first.
- **Measured watering**: a zone counts as watered only when its valves reported open for at least 90 % of the
  planned time. Controllers that end a manual run on their own preset are started again with the time left.
- **Water meter** (optional): litres and flow per valve run, a *Water used* sensor per zone for the energy dashboard,
  a check for valves open without water, and a flow limit per valve that closes the valve on a broken pipe.
- **Manual runs**: water the due zones now, or one zone with your own minutes per valve.
- **Problem reporting** on the Repairs page, on a problem sensor and optionally through any notify service: an
  unavailable valve, a valve that does not open or does not close, no water, too much flow, lost weather data.
- **Restart safe**: the valves of a run cut off by a Home Assistant restart are closed on the next start.

![Settings tab with zones and connected entities](docs/images/panel-settings.png)

![Built-in guide](docs/images/panel-guide.png)

## Requirements

- Home Assistant 2026.10 or newer.
- Valves as `valve`, `switch` or `input_boolean` entities.
- Optional: a soil moisture sensor in %, a rain forecast sensor in mm for the coming day, a total water meter in m³
  or L, a notify service.

Any sensor works for the weather inputs. Open-Meteo provides both as a model value without hardware, for example
through a [RESTful sensor](https://www.home-assistant.io/integrations/rest/) reading `soil_moisture_3_to_9cm` and
the hourly `precipitation` of the coming 24 hours.

## Installation

### HACS

1. In HACS, open the menu in the top right corner and choose **Custom repositories**.
2. Add `https://github.com/Holczyns/raincast` with the type **Integration**.
3. Search for **RainCast**, download it and restart Home Assistant.
4. Go to **Settings → Devices & services → Add integration** and choose **RainCast**.

### Manual

Copy `custom_components/raincast` into the `custom_components` folder of your Home Assistant configuration and
restart Home Assistant.

## Setup

The wizard asks for:

1. **A name** for the controller.
2. **Weather and water**: soil moisture, rain forecast and water meter. All optional; everything can be changed later
   in the panel.
3. **Zones**: a name, the valves in the order they run, *under a roof*, the interval and a starting time per valve.
   Add as many as you need.

Afterwards open **RainCast** in the sidebar. In **Settings** you set the daily start, the weather limits, the time and
flow limit of each valve, the notify service, and you add, edit or remove zones.

## Taking over the watering safely

1. Leave **Valve control** off for a few days and compare the plan RainCast sends with your current setup.
2. Turn off every other schedule watering the same valves, including the controller's own programs and smart
   watering. Two writers on one valve end in runs nobody planned.
3. Turn on **Valve control** in the panel settings and watch the first run on the Home tab.

Turning valve control off ends a run in progress and closes its valve. **Stop** always closes every valve of the
controller.

## How it works

```
daily start ─► interval due? ─► open to the sky? ─► soil and rain below limits? ─► plan
plan ─► valve 1 ─► valve 2 ─► … ─► measured time ≥ 90 % ─► zone watered, date moves on
            └─ water meter: litres, no water, flow limit
```

- **Interval**: a zone is due when its interval in days has passed since the last watering, or when it was never
  watered.
- **Weather**: a due zone open to the sky is held while the soil moisture is above the soil limit or the rain
  forecast is above the rain limit. A weather input that is not set or has no value holds nothing, so a dead weather
  service never stops the garden from being watered; it is reported after an hour.
- **Valves**: a valve that does not report open within a minute is skipped and reported. Valves of the
  [B-hyve integration](https://github.com/sebr/bhyve-home-assistant) get their run time with the start command, so
  they close by themselves even if Home Assistant stops in the middle of a run.
- **Water meter**: each valve is metered from its start to the start of the next one; the last valve a minute after
  it closed, because meters report with a delay. A meter without a reading for ten minutes is not used for the
  checks. A meter shared with the house also counts water used there during a run.

The plan, the schedule, the valve supervision and the flow checks live in `custom_components/raincast/engine`
without Home Assistant imports and are tested on their own.

## Entities

Controller device:

| Entity | Purpose |
|---|---|
| Valve control (switch) | Off: dry run, no valve is opened |
| Start (select), Start time (time), Start before sunrise (number) | The daily start |
| Soil limit, Rain limit (number) | Weather holds |
| Next start, Planned time (sensor) | The coming run |
| Watering, Problem (binary sensor) | Run in progress; faults with the list as an attribute |
| Water due zones, Stop watering (button) | Manual run and stop |

Each zone device:

| Entity | Purpose |
|---|---|
| Status, Next due (sensor) | Due, waiting, held by soil or rain, watering |
| Last watered (date) | Editable, to correct or carry over a date |
| Interval, Time per valve, Flow limit per valve (number) | Zone settings |
| Water used (sensor) | Litres over all runs, with a water meter |
| Water now (button) | Waters the zone with its own times |

## Development

```bash
# engine tests, any Python 3.13+
python -m pytest tests/engine

# integration tests, Python 3.14 with pytest-homeassistant-custom-component (Linux or macOS)
python -m pytest tests

# panel
cd frontend && npm ci && npm run check && npm run build
```

The built panel in `custom_components/raincast/www` is committed, so installing through HACS needs no build step.

## License

[MIT](LICENSE)
