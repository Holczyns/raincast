import type { HomeAssistant } from "./ha";

export interface ZoneInfo {
  id: string;
  name: string;
  valves: string[];
  roofed: boolean;
  /** The zone's soil sensor; null when the zone does not look at the soil. */
  soil_sensor: string | null;
  entities: Record<string, string>;
}

export interface ZoneFields {
  name: string;
  valves: string[];
  roofed: boolean;
  soil_sensor: string | null;
}

export interface ValveResult {
  entity_id: string;
  minutes: number;
  liters: number | null;
  flow: number | null;
  no_flow?: boolean;
  flow_high?: boolean;
}

export interface ZoneResult {
  key: string;
  name: string;
  planned_min: number;
  watered_min: number;
  watered: boolean;
  not_opened: string[];
  /** Missing in runs from before the water meter was added. */
  liters?: number | null;
  valves?: ValveResult[];
}

export interface RunLogEntry {
  started: string | null;
  ended: string | null;
  reason: "scheduled" | "manual" | "zone" | "restart";
  interrupted: boolean;
  zones: ZoneResult[];
}

export interface EntryInfo {
  entry_id: string;
  title: string;
  notify_service: string | null;
  notify_services: string[];
  sources: Record<string, string | null>;
  entities: Record<string, string>;
  zones: ZoneInfo[];
  log: RunLogEntry[];
  native_valves: string[];
}

export function fetchEntries(hass: HomeAssistant): Promise<EntryInfo[]> {
  return hass.callWS<EntryInfo[]>({ type: "raincast/entries" });
}

export function setNotifyService(hass: HomeAssistant, entryId: string, service: string | null): Promise<void> {
  return hass.callWS({ type: "raincast/set_options", entry_id: entryId, notify_service: service });
}

export function updateSources(hass: HomeAssistant, entryId: string, sources: Record<string, string | null>): Promise<void> {
  return hass.callWS({ type: "raincast/update_sources", entry_id: entryId, ...sources });
}

export function addZone(
  hass: HomeAssistant,
  entryId: string,
  zone: ZoneFields & { interval: number; duration: number },
): Promise<{ zone_id: string }> {
  return hass.callWS({ type: "raincast/add_zone", entry_id: entryId, ...zone });
}

export function updateZone(hass: HomeAssistant, entryId: string, zoneId: string, zone: ZoneFields): Promise<void> {
  return hass.callWS({ type: "raincast/update_zone", entry_id: entryId, zone_id: zoneId, ...zone });
}

export function removeZone(hass: HomeAssistant, entryId: string, zoneId: string): Promise<void> {
  return hass.callWS({ type: "raincast/remove_zone", entry_id: entryId, zone_id: zoneId });
}

export function pressButton(hass: HomeAssistant, entityId: string | undefined): Promise<unknown> {
  return hass.callService("button", "press", { entity_id: entityId });
}

/** Duration entities of a zone, in the order of its valves. */
export function durationEntities(zone: ZoneInfo): (string | undefined)[] {
  return zone.valves.map((_valve, index) => zone.entities[`duration_${index}`]);
}

/** Flow limit entities of a zone, in the order of its valves; only with a water meter. */
export function maxFlowEntities(zone: ZoneInfo): (string | undefined)[] {
  return zone.valves.map((_valve, index) => zone.entities[`max_flow_${index}`]);
}

/** Whether automatic watering is in season today, from the controller's season months. */
export function inSeason(first: number, last: number, today = new Date()): boolean {
  const month = today.getMonth() + 1;
  return first <= last ? month >= first && month <= last : month >= first || month <= last;
}

/** The zone's result in its latest run, from the log (newest first). */
export function latestResult(entry: EntryInfo, zoneId: string): ZoneResult | undefined {
  for (const run of entry.log) {
    const result = run.zones.find((zone) => zone.key === zoneId);
    if (result) return result;
  }
  return undefined;
}

/** Water one zone now; each valve runs for its given minutes, 0 leaves it out. */
export function runZone(
  hass: HomeAssistant,
  entryId: string,
  zoneId: string,
  minutes: Record<string, number>,
): Promise<void> {
  return hass.callWS({ type: "raincast/run_zone", entry_id: entryId, zone_id: zoneId, minutes });
}
