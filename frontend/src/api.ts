import type { HomeAssistant } from "./ha";

export interface ZoneInfo {
  id: string;
  name: string;
  valves: string[];
  roofed: boolean;
  entities: Record<string, string>;
}

export interface ZoneFields {
  name: string;
  valves: string[];
  roofed: boolean;
}

export interface ZoneResult {
  key: string;
  name: string;
  planned_min: number;
  watered_min: number;
  watered: boolean;
  not_opened: string[];
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
