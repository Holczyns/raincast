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
import type { Localize, TranslationKey } from "./localize";
import { controlStyles, numberControl } from "./number-control";
import { shared } from "./styles";

const SOURCE_FIELDS: { key: string; label: TranslationKey; domains: string[]; deviceClass?: string }[] = [
  { key: "soil_sensor", label: "src.soil_sensor", domains: ["sensor", "input_number"] },
  { key: "rain_sensor", label: "src.rain_sensor", domains: ["sensor", "input_number"] },
  { key: "water_meter", label: "src.water_meter", domains: ["sensor"], deviceClass: "water" },
];
const VALVE_DOMAINS = ["valve", "switch", "input_boolean"];
const NEW_ZONE_INTERVAL = 3;
const NEW_ZONE_DURATION = 15;

function errorText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

function friendly(hass: HomeAssistant, entityId: string | null | undefined): string {
  if (!entityId) return "–";
  return String(hass.states[entityId]?.attributes.friendly_name ?? entityId);
}

/** Weather inputs; saving reloads the integration. */
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
      <dl>
        ${SOURCE_FIELDS.map(
          (field) => html`<dt>${t(field.label)}</dt>
            <dd title=${this.entry.sources[field.key] ?? ""}>${friendly(this.hass, this.entry.sources[field.key])}</dd>`,
        )}
      </dl>
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
      dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 6px 16px;
        margin: 0;
        font-size: 0.9rem;
      }
      dt {
        color: var(--rc-muted);
      }
      dd {
        margin: 0;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
    this.draft = { name: zone?.name ?? "", valves: [...(zone?.valves ?? [])], roofed: zone?.roofed ?? false };
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
    return html`
      <section class="card">
        <h2>${t("settings.zones")}</h2>
        ${this.entry.zones.map((zone) => (this.editing === zone.id ? this.renderForm(zone) : this.renderZone(zone)))}
        ${this.editing === "new"
          ? this.renderForm()
          : html`<div class="actions">
              <button class="text primary" @click=${() => this.startEdit()}>+ ${t("action.add_zone")}</button>
            </div>`}
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
          </div>
          <button class="text icon" title=${t("action.edit")} @click=${() => this.startEdit(zone)}>
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
        </div>
        ${numberControl(this.hass, zone.entities.interval, t("zone.interval"))}
        ${zone.valves.map(
          (valve, index) => html`
            <div class="valve-tuning">
              <div class="valve-name">${friendly(this.hass, valve)}</div>
              ${numberControl(this.hass, durations[index], t("zone.time"))}
              ${numberControl(this.hass, maxFlows[index], t("zone.max_flow"))}
            </div>
          `,
        )}
        ${maxFlows.some((entity) => !!entity) ? html`<p class="muted small">${t("zone.max_flow_hint")}</p>` : nothing}
      </div>
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
