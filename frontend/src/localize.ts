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
  "home.no_start": "No daily start",
  "home.no_start_hint": "The start is off in the settings; manual runs still work.",
  "home.stop": "Stop",
  "home.run_due": "Water due zones",
  "home.control_needed": "Turn on Valve control in the settings first.",
  "home.weather": "Weather",
  "home.soil": "Soil moisture",
  "home.rain": "Rain forecast",
  "home.not_configured": "not set",
  "home.no_value": "no value",
  "home.weather_hint": "Zones open to the sky are held while a value is above its limit, the line in the middle of the bar.",
  "home.problems": "Problems",
  "status.watering": "Watering",
  "status.due": "Due",
  "status.waiting": "Waiting",
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
  "zone.start": "Start",
  "zone.cancel": "Cancel",
  "zone.name": "Name",
  "zone.valves": "Valves, in the order they run",
  "zone.roofed": "Under a roof",
  "zone.roofed_hint": "The weather does not hold a greenhouse or a covered bed.",
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
  "src.soil_sensor": "Soil moisture",
  "src.rain_sensor": "Rain forecast",
  "src.water_meter": "Water meter",
  "src.weather": "Weather",
  "src.water": "Water",
  "src.valves": "Valves",
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
  "settings.schedule": "Daily start",
  "settings.start_mode": "Start",
  "settings.sunrise_offset": "Hours before sunrise",
  "settings.start_time": "Start time",
  "settings.schedule_hint": "Watering before sunrise loses the least water to evaporation and leaves the lawn dry by day.",
  "settings.limits": "Weather limits",
  "settings.soil_max": "Soil limit",
  "settings.rain_max": "Rain limit",
  "settings.limits_hint": "Zones open to the sky are held above these values. Zones under a roof are never held.",
  "settings.sources": "Connected entities",
  "settings.sources_hint":
    "Edit changes the weather inputs and the water meter; valves are changed with the pencil of their zone. Without the weather inputs, zones are watered by their intervals alone.",
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
