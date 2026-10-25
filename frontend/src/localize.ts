const en = {
  loading: "Loading…",
  no_entry: "No RainCast controller is set up. Add one under Settings → Devices & services.",
  "tab.home": "Home",
  "tab.history": "History",
  "tab.settings": "Settings",
  "tab.guide": "Guide",
  "home.control_on": "Valve control on",
  "home.dry_run": "Dry run",
  "home.watering": "Watering {zone}",
  "home.valve_ends": "until about {time}",
  "home.next_start": "Next start {day}, {time}",
  "home.planned_now": "{minutes} min due if it started now",
  "home.no_start": "No zone has a start",
  "home.no_start_hint": "Manual runs still work.",
  "home.automatic_off": "Automatic off",
  "home.automatic_off_title": "Automatic watering is off",
  "home.out_of_season": "Out of season",
  "home.outdoor": "Outdoor",
  "home.rain_now": "Rain now",
  "home.raining": "raining",
  "home.dry": "dry",
  "home.last_rain": "Last rain",
  "home.next_rain": "Next rain",
  "home.hours_ago": "{hours} h ago",
  "home.in_hours": "in {hours} h",
  "home.no_rain_ahead": "none in the forecast",
  "home.mower": "Mower",
  "home.mower_state": "Mower",
  "home.next_mowing": "Next mowing",
  "home.mow_now": "Mow now",
  "mow.mowing": "Mowing",
  "mow.ready": "Ready",
  "mow.frost": "Frost",
  "mow.watering": "Watering",
  "mow.watered": "Watered today",
  "mow.raining": "Raining",
  "mow.rained": "Rained recently",
  "mow.rain_ahead": "Rain ahead",
  "mow.unknown": "Unknown",
  "mowmode.sunrise": "From sunrise",
  "mowmode.sunset": "From sunset",
  "mowmode.at_time": "At a fixed time",
  "mowmode.off": "Off",
  "home.frost_below": "frost below {limit} °C",
  "home.stop": "Stop",
  "home.run_due": "Water due zones",
  "home.control_needed": "Turn on Valve control in the settings first.",
  "home.weather": "Weather",
  "home.soil": "Soil moisture",
  "home.rain": "Rain forecast",
  "home.not_configured": "not set",
  "home.no_value": "no value",
  "home.weather_hint":
    "Zones open to the sky are held while the rain forecast is above its limit, the line in the middle of the bar. Below the frost limit no zone is watered.",
  "home.problems": "Problems",
  "status.watering": "Watering",
  "status.due": "Due",
  "status.waiting": "Waiting",
  "status.frost": "Frost",
  "status.wet_soil": "Soil wet",
  "status.rain_forecast": "Rain forecast",
  "status.no_duration": "No valve time",
  "status.unknown": "Unknown",
  "zone.last_watered": "Last watered",
  "zone.next_due": "Next due",
  "zone.minutes": "{minutes} min",
  "zone.interval": "Water every",
  "zone.never": "never",
  "zone.days_ago": "{days} days ago",
  "zone.every_days": "every {days} days",
  "zone.next_start": "Next start",
  "zone.no_start": "off",
  "zone.soil": "Soil",
  "zone.mower_conflict": "Blocks mowing",
  "zone.mower_conflict_hint": "Watering this zone today keeps the mower in; for zones on the mowed lawn.",
  "zone.start": "Start",
  "zone.start_time": "Start time",
  "zone.sunrise_offset": "Hours before sunrise",
  "zone.soil_max": "Soil limit",
  "zone.soil_sensor": "Soil moisture of this zone",
  "zone.soil_sensor_hint": "Optional, sensor or input number in %. A zone without one does not look at the soil.",
  "zone.water": "Water",
  "zone.last_run_liters": "{liters} l last run",
  "zone.total_liters": "{liters} l in total",
  "zone.flow": "{flow} l/min",
  "zone.time": "Time",
  "zone.max_flow": "Flow limit",
  "zone.max_flow_hint":
    "A valve whose mean flow goes above its limit is closed and reported, for a broken pipe or sprinkler. 0 turns the check off.",
  "zone.settings": "Settings",
  "zone.manual": "Manual",
  "zone.manual_hint":
    "Each valve runs for the minutes given, 0 leaves it out. The zone counts as watered only at its own full time.",
  "zone.run_start": "Start",
  "zone.cancel": "Cancel",
  "zone.name": "Name",
  "zone.valves": "Valves, in the order they run",
  "zone.roofed": "Under a roof",
  "zone.roofed_hint": "The rain forecast does not hold a greenhouse or a covered bed; its soil sensor and frost still do.",
  "zone.new_hint": "A new zone starts with a 3-day interval and 15 minutes per valve; both are changed here afterwards.",
  "zone.edit_hint": "Saving reloads RainCast. A valve added here starts with the zone's starting time.",
  "zone.remove_confirm": "Remove {name}? Its entities are removed; recorded history stays.",
  "problem.valve_unavailable": "A valve has been unavailable for 30 minutes.",
  "problem.valve_not_opened": "A valve did not open in its latest run.",
  "problem.valve_not_closed": "A valve still reports open after the stop command.",
  "problem.no_flow": "A valve was open without water through the meter.",
  "problem.flow_high": "A valve was closed for flow above its limit.",
  "problem.weather_lost": "A weather input has had no value for an hour.",
  "history.runs": "Runs",
  "history.no_runs": "No run yet.",
  "history.watered": "{watered} of {planned} min",
  "history.not_opened": "did not open: {valves}",
  "history.interrupted": "Stopped before the end.",
  "history.no_flow": "no water",
  "history.flow_high": "closed, flow too high",
  "history.water": "Water per zone, 30 days",
  "history.weather": "Soil and rain, 7 days",
  "history.valves": "Valves, 7 days",
  "reason.scheduled": "Daily start",
  "reason.manual": "Manual",
  "reason.zone": "Single zone",
  "reason.restart": "Cut off by a restart",
  "mode.before_sunrise": "Before sunrise",
  "mode.at_time": "At a fixed time",
  "mode.off": "Off",
  "src.rain_sensor": "Rain forecast",
  "src.water_meter": "Water meter",
  "src.weather": "Weather",
  "src.outdoor_sensor": "Outdoor temperature",
  "src.weather_entity": "Weather forecast",
  "src.mower_group": "Mower",
  "src.mower": "Lawn mower",
  "src.zone_soil": "soil sensor of the zone",
  "src.water": "Water",
  "src.zones": "Zones",
  "src.native": "run time sent with the start",
  "src.open_close": "opened and closed by RainCast",
  "action.edit": "Edit",
  "action.save": "Save",
  "action.remove": "Remove",
  "action.add_zone": "Add zone",
  "action.add_valve": "Add valve",
  "settings.control_title": "Valves",
  "settings.control": "Valve control",
  "settings.control_hint": "Off: the plan is sent as a dry run and no valve is opened.",
  "settings.control_confirm":
    "RainCast will open the valves at the daily start. Turn off every other schedule watering the same valves first.",
  "settings.confirm": "Turn on",
  "settings.cancel": "Cancel",
  "settings.automatic": "Automatic watering",
  "settings.automatic_hint": "Off: no zone starts by itself and no plan is sent; manual runs still work.",
  "settings.season": "Season and weather",
  "settings.season_start": "Season starts",
  "settings.season_end": "Season ends",
  "settings.season_hint": "Outside the season no zone starts by itself, for example over the winter. Manual runs still work.",
  "settings.mower": "Mower",
  "settings.automatic_mowing": "Automatic mowing",
  "settings.automatic_mowing_hint": "Off: the mower does not start by itself; Mow now still works.",
  "settings.mower_start": "Start",
  "settings.mower_offset": "Hours after (−before) the event",
  "settings.mower_season_start": "Mowing season starts",
  "settings.mower_season_end": "Mowing season ends",
  "settings.dry_hours": "Dry hours after rain",
  "settings.rain_ahead_hours": "Rain ahead hours",
  "settings.mower_hint":
    "The mower stays in when a zone that blocks mowing was watered today, while it rains, for the dry hours after rain, when rain is due within the rain ahead hours, and in frost.",
  "settings.rain_max": "Rain limit",
  "settings.frost_min": "Frost limit",
  "settings.limits_hint":
    "Zones open to the sky are held while more rain is forecast than the rain limit. Below the frost limit no zone starts, roofed or not. Each zone has its own start and soil limit, under Zones.",
  "settings.zone_start_hint": "Watering before sunrise loses the least water to evaporation and leaves the lawn dry by day.",
  "settings.sources": "Connected entities",
  "settings.sources_hint":
    "Edit changes the weather inputs and the water meter; valves and soil sensors are changed with the pencil of their zone.",
  "settings.reload_hint": "Saving reloads RainCast; dates, intervals and valve times are kept.",
  "settings.zones": "Zones",
  "settings.notifications": "Problems and notifications",
  "settings.no_problems": "No problems right now.",
  "settings.notify_service": "Notify service",
  "settings.notify_none": "No notifications",
  "settings.notify_hint": "Receives the day's plan, the end of every run and problems.",
  "settings.entities": "Entities and devices",
  "settings.admin_only": "Only administrators can change settings.",
};

export type TranslationKey = keyof typeof en;
export type Localize = (key: TranslationKey, values?: Record<string, string | number>) => string;

/** The panel is English only; numbers and dates are formatted the same way everywhere. */
export const LANGUAGE = "en";

export function localizer(): Localize {
  return (key, values) => {
    let text: string = en[key] ?? key;
    for (const [name, value] of Object.entries(values ?? {})) {
      text = text.replace(`{${name}}`, String(value));
    }
    return text;
  };
}

/** Home Assistant reports a missing value as null, an absent attribute as undefined. */
export function formatNumber(value: number | null | undefined, digits = 1): string {
  if ((value === null) || (value === undefined) || !Number.isFinite(value)) return "–";
  return value.toLocaleString(LANGUAGE, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function timeLabel(date: Date): string {
  return date.toLocaleTimeString(LANGUAGE, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}

/** Today, tomorrow and yesterday by name, other days as a short date. */
export function dayLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const offset = Math.round((day.getTime() - today.getTime()) / 86_400_000);
  if (offset === 0) return "today";
  if (offset === 1) return "tomorrow";
  if (offset === -1) return "yesterday";
  return date.toLocaleDateString(LANGUAGE, { weekday: "short", day: "numeric", month: "short" });
}
