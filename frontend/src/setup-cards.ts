import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import {
  type EntryInfo,
  type ZoneFields,
  type ZoneInfo,
  addZone,
  durationEntities,
  maxFlowEntities,
  removeZone,
  updateSources,
  updateZone,
} from "./api";
import "./entity-picker";
import { type HomeAssistant, fireEvent } from "./ha";
import { LANGUAGE, type Localize, type TranslationKey } from "./localize";
import { controlStyles, numberControl } from "./number-control";
import { shared } from "./styles";

interface SourceField {
  key: string;
  label: TranslationKey;
  domains: string[];
  deviceClass?: string;
}

const SOURCE_GROUPS: { title: TranslationKey; fields: SourceField[] }[] = [
  {
    title: "src.weather",
    fields: [
      { key: "rain_sensor", label: "src.rain_sensor", domains: ["sensor", "input_number"] },
      { key: "outdoor_sensor", label: "src.outdoor_sensor", domains: ["sensor"], deviceClass: "temperature" },
      { key: "weather", label: "src.weather_entity", domains: ["weather"] },
    ],
  },
  { title: "src.water", fields: [{ key: "water_meter", label: "src.water_meter", domains: ["sensor"], deviceClass: "water" }] },
  { title: "src.mower_group", fields: [{ key: "mower", label: "src.mower", domains: ["lawn_mower"] }] },
];
const SOURCE_FIELDS = SOURCE_GROUPS.flatMap((group) => group.fields);
const VALVE_DOMAINS = ["valve", "switch", "input_boolean"];
const SOIL_DOMAINS = ["sensor", "input_number"];
const START_MODES = ["before_sunrise", "at_time", "off"];
const NEW_ZONE_INTERVAL = 3;
const NEW_ZONE_DURATION = 15;

function errorText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

function friendly(hass: HomeAssistant, entityId: string | null | undefined): string {
  if (!entityId) return "–";
  return String(hass.states[entityId]?.attributes.friendly_name ?? entityId);
}

/** Current state with its unit, as the entity reports it. */
function stateText(hass: HomeAssistant, entityId: string): string {
  const state = hass.states[entityId];
  if (!state) return "missing";
  const unit = state.attributes.unit_of_measurement;
  const number = Number(state.state);
  const value =
    (state.state !== "") && Number.isFinite(number)
      ? number.toLocaleString(LANGUAGE, { maximumFractionDigits: 3 })
      : state.state;
  return unit ? `${value} ${unit}` : value;
}

/** Everything RainCast reads and drives; weather and meter are edited here, valves in their zone. */
export class RainCastSourcesCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    draft: { state: true },
    error: { state: true },
    saving: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  draft?: Record<string, string | null>;
  error?: string;
  saving = false;

  private async save(): Promise<void> {
    if (!this.draft) return;
    this.saving = true;
    try {
      await updateSources(this.hass, this.entry.entry_id, this.draft);
      this.draft = undefined;
      fireEvent(this, "raincast-entries-changed");
    } catch (err) {
      this.error = errorText(err);
    } finally {
      this.saving = false;
    }
  }

  render() {
    const t = this.localize;
    return html`
      <section class="card">
        <h2>${t("settings.sources")}</h2>
        ${this.draft ? this.renderForm() : this.renderSummary()}
      </section>
    `;
  }

  private renderSummary(): TemplateResult {
    const t = this.localize;
    return html`
      ${SOURCE_GROUPS.map(
        (group) => html`
          <h3>${t(group.title)}</h3>
          ${group.fields.map((field) => this.renderEntity(t(field.label), this.entry.sources[field.key]))}
        `,
      )}
      <h3>${t("src.zones")}</h3>
      ${this.entry.zones.map(
        (zone) => html`
          <div class="zone-name">${zone.name}</div>
          ${zone.soil_sensor ? this.renderEntity(friendly(this.hass, zone.soil_sensor), zone.soil_sensor, t("src.zone_soil")) : nothing}
          ${zone.valves.map((valve) =>
            this.renderEntity(
              friendly(this.hass, valve),
              valve,
              t(this.entry.native_valves.includes(valve) ? "src.native" : "src.open_close"),
            ),
          )}
        `,
      )}
      <p class="muted small">${t("settings.sources_hint")}</p>
      <div class="actions">
        <button
          class="text primary"
          @click=${() => {
            this.draft = { ...this.entry.sources };
            this.error = undefined;
          }}
        >
          ${t("action.edit")}
        </button>
      </div>
    `;
  }

  private renderEntity(label: string, entityId: string | null | undefined, note?: string): TemplateResult {
    const t = this.localize;
    const missing = !!entityId && !this.hass.states[entityId];
    const unavailable = !!entityId && ["unavailable", "unknown"].includes(this.hass.states[entityId]?.state ?? "");
    return html`
      <div class="entity">
        <div class="grow">
          <div>${label}</div>
          <div class="muted small" title=${entityId ?? ""}>
            ${entityId ? html`${entityId}${note ? ` · ${note}` : ""}` : t("home.not_configured")}
          </div>
        </div>
        ${entityId
          ? html`<span class="value ${missing || unavailable ? "bad" : ""}">${stateText(this.hass, entityId)}</span>`
          : nothing}
      </div>
    `;
  }

  private renderForm(): TemplateResult {
    const t = this.localize;
    const draft = this.draft!;
    return html`
      ${SOURCE_FIELDS.map(
        (field) => html`
          <div class="field">
            <label>${t(field.label)}</label>
            <raincast-entity-picker
              .hass=${this.hass}
              .domains=${field.domains}
              .deviceClass=${field.deviceClass}
              .value=${draft[field.key]}
              optional
              @value-changed=${(event: CustomEvent) => (this.draft = { ...draft, [field.key]: event.detail })}
            ></raincast-entity-picker>
          </div>
        `,
      )}
      <p class="muted small">${t("settings.reload_hint")}</p>
      ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
      <div class="actions">
        <button class="text" @click=${() => (this.draft = undefined)}>${t("settings.cancel")}</button>
        <button class="text primary" ?disabled=${this.saving} @click=${this.save}>${t("action.save")}</button>
      </div>
    `;
  }

  static styles = [
    shared,
    controlStyles,
    css`
      h3 {
        margin: 12px 0 4px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--rc-muted);
      }
      h3:first-of-type {
        margin-top: 0;
      }
      .entity {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 4px 0;
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .grow .small {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .value {
        white-space: nowrap;
        font-size: 0.9rem;
      }
      .value.bad {
        color: var(--rc-error);
      }
      .zone-name {
        font-size: 0.85rem;
        margin-top: 4px;
      }
      .zone-name ~ .entity {
        padding-left: 12px;
      }
    `,
  ];
}

/** Zones with their interval and valve times, plus adding, editing and removing zones. */
export class RainCastZonesCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    focusZone: { attribute: false },
    editing: { state: true },
    draft: { state: true },
    confirmRemove: { state: true },
    error: { state: true },
    saving: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  /** Zone opened from its card on the Home tab; shown highlighted. */
  focusZone?: string;
  /** Zone id being edited, "new" while adding, undefined otherwise. */
  editing?: string;
  draft?: ZoneFields;
  confirmRemove = false;
  error?: string;
  saving = false;

  private startEdit(zone?: ZoneInfo): void {
    this.editing = zone?.id ?? "new";
    this.draft = {
      name: zone?.name ?? "",
      valves: [...(zone?.valves ?? [])],
      roofed: zone?.roofed ?? false,
      mower_conflict: zone?.mower_conflict ?? false,
      soil_sensor: zone?.soil_sensor ?? null,
    };
    this.confirmRemove = false;
    this.error = undefined;
  }

  private stopEdit(): void {
    this.editing = undefined;
    this.draft = undefined;
  }

  private async run(action: () => Promise<unknown>): Promise<void> {
    this.saving = true;
    try {
      await action();
      this.stopEdit();
      fireEvent(this, "raincast-entries-changed");
    } catch (err) {
      this.error = errorText(err);
    } finally {
      this.saving = false;
    }
  }

  render() {
    const t = this.localize;
    // Flow limits exist only while a water meter is connected.
    const metered = !!this.entry.sources.water_meter;
    return html`
      <section class="card">
        <h2>${t("settings.zones")}</h2>
        ${this.entry.zones.map((zone) => (this.editing === zone.id ? this.renderForm(zone) : this.renderZone(zone)))}
        ${this.editing === "new"
          ? this.renderForm()
          : html`<div class="actions">
              <button class="text primary" @click=${() => this.startEdit()}>+ ${t("action.add_zone")}</button>
            </div>`}
        ${metered ? html`<p class="muted small">${t("zone.max_flow_hint")}</p>` : nothing}
      </section>
    `;
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("focusZone") && this.focusZone) {
      this.renderRoot.querySelector(`[data-zone="${this.focusZone}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  private renderZone(zone: ZoneInfo): TemplateResult {
    const t = this.localize;
    const durations = durationEntities(zone);
    const maxFlows = maxFlowEntities(zone);
    return html`
      <div class="zone-block ${zone.id === this.focusZone ? "focus" : ""}" data-zone=${zone.id}>
        <div class="zone">
          <ha-icon icon=${zone.roofed ? "mdi:greenhouse" : "mdi:sprinkler"}></ha-icon>
          <div class="grow">
            ${zone.name}${zone.roofed ? html` <span class="muted small">· ${t("zone.roofed")}</span>` : nothing}
            ${zone.mower_conflict ? html` <span class="muted small">· ${t("zone.mower_conflict")}</span>` : nothing}
          </div>
          <button class="text icon" title=${t("action.edit")} @click=${() => this.startEdit(zone)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
        </div>
        ${this.renderStart(zone)} ${numberControl(this.hass, zone.entities.interval, t("zone.interval"))}
        ${numberControl(this.hass, zone.entities.soil_max, t("zone.soil_max"))}
        ${zone.valves.map(
          (valve, index) => html`
            <div class="valve-tuning">
              <div class="valve-name">${friendly(this.hass, valve)}</div>
              ${numberControl(this.hass, durations[index], t("zone.time"))}
              ${numberControl(this.hass, maxFlows[index], t("zone.max_flow"))}
            </div>
          `,
        )}
      </div>
    `;
  }

  /** Start mode of the zone, with the time or the offset it needs. */
  private renderStart(zone: ZoneInfo): TemplateResult {
    const t = this.localize;
    const mode = this.hass.states[zone.entities.start_mode]?.state;
    const startTime = this.hass.states[zone.entities.start_time]?.state ?? "";
    return html`
      <div class="number">
        <span class="label">${t("zone.start")}</span>
        <select
          class="start"
          @change=${(event: Event) =>
            this.hass.callService("select", "select_option", {
              entity_id: zone.entities.start_mode,
              option: (event.target as HTMLSelectElement).value,
            })}
        >
          ${START_MODES.map(
            (option) =>
              html`<option value=${option} ?selected=${option === mode}>${t(`mode.${option}` as TranslationKey)}</option>`,
          )}
        </select>
      </div>
      ${mode === "before_sunrise" ? numberControl(this.hass, zone.entities.sunrise_offset, t("zone.sunrise_offset")) : nothing}
      ${mode === "at_time"
        ? html`<div class="number">
            <span class="label">${t("zone.start_time")}</span>
            <input
              class="text"
              type="time"
              .value=${startTime.slice(0, 5)}
              @change=${(event: Event) =>
                this.hass.callService("time", "set_value", {
                  entity_id: zone.entities.start_time,
                  time: `${(event.target as HTMLInputElement).value}:00`,
                })}
            />
          </div>`
        : nothing}
    `;
  }

  private renderForm(zone?: ZoneInfo): TemplateResult {
    const t = this.localize;
    const draft = this.draft!;
    const valves = draft.valves.filter((valve) => !!valve);
    const valid = (draft.name.trim().length > 0) && (valves.length > 0);
    const setValve = (index: number, value: string | null) => {
      const next = [...draft.valves];
      next[index] = value ?? "";
      this.draft = { ...draft, valves: next };
    };
    const save = () => {
      const fields = { ...draft, valves };
      return this.run(() =>
        zone
          ? updateZone(this.hass, this.entry.entry_id, zone.id, fields)
          : addZone(this.hass, this.entry.entry_id, { ...fields, interval: NEW_ZONE_INTERVAL, duration: NEW_ZONE_DURATION }),
      );
    };
    return html`
      <div class="form">
        <div class="field">
          <label>${t("zone.name")} *</label>
          <input
            class="text"
            .value=${draft.name}
            @input=${(event: Event) => (this.draft = { ...draft, name: (event.target as HTMLInputElement).value })}
          />
        </div>
        <label class="check">
          <input
            type="checkbox"
            .checked=${draft.roofed}
            @change=${(event: Event) => (this.draft = { ...draft, roofed: (event.target as HTMLInputElement).checked })}
          />
          <span>${t("zone.roofed")}<br /><span class="muted small">${t("zone.roofed_hint")}</span></span>
        </label>
        <label class="check">
          <input
            type="checkbox"
            .checked=${draft.mower_conflict}
            @change=${(event: Event) =>
              (this.draft = { ...draft, mower_conflict: (event.target as HTMLInputElement).checked })}
          />
          <span>${t("zone.mower_conflict")}<br /><span class="muted small">${t("zone.mower_conflict_hint")}</span></span>
        </label>
        <div class="field">
          <label>${t("zone.soil_sensor")}</label>
          <raincast-entity-picker
            .hass=${this.hass}
            .domains=${SOIL_DOMAINS}
            .value=${draft.soil_sensor}
            optional
            @value-changed=${(event: CustomEvent) => (this.draft = { ...draft, soil_sensor: event.detail })}
          ></raincast-entity-picker>
          <span class="muted small">${t("zone.soil_sensor_hint")}</span>
        </div>
        <div class="field">
          <label>${t("zone.valves")} *</label>
          ${draft.valves.map(
            (valve, index) => html`
              <div class="valve-row">
                <raincast-entity-picker
                  .hass=${this.hass}
                  .domains=${VALVE_DOMAINS}
                  .value=${valve || null}
                  optional
                  @value-changed=${(event: CustomEvent) => setValve(index, event.detail)}
                ></raincast-entity-picker>
                <button
                  class="text icon"
                  title=${t("action.remove")}
                  @click=${() => (this.draft = { ...draft, valves: draft.valves.filter((_v, i) => i !== index) })}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
            `,
          )}
          <div>
            <button class="text" @click=${() => (this.draft = { ...draft, valves: [...draft.valves, ""] })}>
              + ${t("action.add_valve")}
            </button>
          </div>
        </div>
        <p class="muted small">${t(zone ? "zone.edit_hint" : "zone.new_hint")}</p>
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        ${this.confirmRemove && zone
          ? html`<div class="confirm">
              <span>${t("zone.remove_confirm", { name: zone.name })}</span>
              <button class="text" @click=${() => (this.confirmRemove = false)}>${t("settings.cancel")}</button>
              <button
                class="text danger"
                @click=${() => this.run(() => removeZone(this.hass, this.entry.entry_id, zone.id))}
              >
                ${t("action.remove")}
              </button>
            </div>`
          : nothing}
        <div class="actions">
          ${zone
            ? html`<button class="text danger" @click=${() => (this.confirmRemove = true)}>${t("action.remove")}</button>`
            : nothing}
          <span class="spacer"></span>
          <button class="text" @click=${() => this.stopEdit()}>${t("settings.cancel")}</button>
          <button class="text primary" ?disabled=${!valid || this.saving} @click=${save}>
            ${zone ? t("action.save") : t("action.add_zone")}
          </button>
        </div>
      </div>
    `;
  }

  static styles = [
    shared,
    controlStyles,
    css`
      .zone-block {
        border-bottom: 1px solid var(--divider-color);
        padding: 6px 0 8px;
      }
      select.start {
        padding: 4px 6px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
      }
      .valve-tuning {
        padding-left: 30px;
        margin-top: 4px;
      }
      .valve-name {
        font-size: 0.85rem;
        color: var(--rc-muted);
      }
      .zone-block.focus {
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        padding: 6px 10px 8px;
        margin: 4px -10px;
      }
      .zone {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 4px 0;
        font-weight: 500;
      }
      .zone ha-icon {
        color: var(--rc-muted);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      button.icon {
        padding: 4px;
        color: var(--rc-muted);
      }
      .form {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 12px;
        margin: 6px 0;
      }
      input.text {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
      }
      .check {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 10px;
        cursor: pointer;
      }
      .valve-row {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .valve-row raincast-entity-picker {
        flex: 1;
        min-width: 0;
      }
      .spacer {
        flex: 1;
      }
      .confirm {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin: 8px 0;
        border-radius: 8px;
        background: color-mix(in srgb, var(--rc-error) 12%, transparent);
      }
      .confirm span {
        flex: 1;
      }
    `,
  ];
}

customElements.get("raincast-sources-card") ?? customElements.define("raincast-sources-card", RainCastSourcesCard);
customElements.get("raincast-zones-card") ?? customElements.define("raincast-zones-card", RainCastZonesCard);
