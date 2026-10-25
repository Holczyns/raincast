import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { type EntryInfo, type ZoneInfo, setNotifyService, updateZone } from "./api";
import { type HomeAssistant, fireEvent, isOn } from "./ha";
import { LANGUAGE, type Localize, type TranslationKey } from "./localize";
import { controlStyles, numberControl } from "./number-control";
import "./setup-cards";
import { shared } from "./styles";

const MOWER_MODES = ["sunrise", "sunset", "at_time", "off"];
const MONTHS = Array.from({ length: 12 }, (_value, index) =>
  new Date(2026, index, 1).toLocaleDateString(LANGUAGE, { month: "long" }),
);

export class RainCastSettings extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    focusZone: { attribute: false },
    confirming: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  focusZone?: string;
  confirming = false;

  render() {
    if (!this.hass.user?.is_admin) {
      return html`<section class="card muted">${this.localize("settings.admin_only")}</section>`;
    }
    const t = this.localize;
    const mower = !!this.entry.entities.automatic_mowing;
    return html`
      <h1 class="section"><ha-icon icon="mdi:sprinkler-variant"></ha-icon>${t("section.watering")}</h1>
      <div class="layout">
        <div class="column">${this.renderWatering()} ${this.renderWateringRules()}</div>
        <div class="column wide">
          <raincast-zones-card
            .hass=${this.hass}
            .entry=${this.entry}
            .localize=${this.localize}
            .focusZone=${this.focusZone}
          ></raincast-zones-card>
        </div>
      </div>
      ${mower
        ? html`
            <h1 class="section"><ha-icon icon="mdi:robot-mower-outline"></ha-icon>${t("section.mowing")}</h1>
            <div class="layout">
              <div class="column">${this.renderMowing()}</div>
              <div class="column">${this.renderMowingRules()}</div>
              <div class="column">${this.renderLawnZones()}</div>
            </div>
          `
        : nothing}
      <h1 class="section"><ha-icon icon="mdi:cog-outline"></ha-icon>${t("section.general")}</h1>
      <div class="layout">
        <div class="column wide">
          <raincast-sources-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></raincast-sources-card>
        </div>
        <div class="column">${this.renderNotifications()}</div>
      </div>
      <p class="small">
        <a href="/config/integrations/integration/raincast">${t("settings.entities")}</a>
      </p>
    `;
  }

  private renderToggle(title: TranslationKey, hint: TranslationKey, on: boolean, onChange: (on: boolean) => void) {
    return html`
      <div class="toggle-row">
        <div>
          <div>${this.localize(title)}</div>
          <div class="muted small">${this.localize(hint)}</div>
        </div>
        <button class="toggle ${on ? "on" : ""}" role="switch" aria-checked=${on} @click=${() => onChange(!on)}>
          <span></span>
        </button>
      </div>
    `;
  }

  private switchTo(entityId: string, on: boolean): void {
    this.hass.callService("switch", on ? "turn_on" : "turn_off", { entity_id: entityId });
  }

  private month(entityId: string, label: TranslationKey): TemplateResult {
    const t = this.localize;
    return html`
      <div class="number">
        <span class="label">${t(label)}</span>
        <select
          class="inline"
          @change=${(event: Event) =>
            this.hass.callService("select", "select_option", {
              entity_id: entityId,
              option: (event.target as HTMLSelectElement).value,
            })}
        >
          ${MONTHS.map(
            (name, index) =>
              html`<option value=${index + 1} ?selected=${this.hass.states[entityId]?.state === String(index + 1)}>
                ${name}
              </option>`,
          )}
        </select>
      </div>
    `;
  }

  /** Main switches of watering, then its season. */
  private renderWatering(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    return html`
      <section class="card">
        <h2>${t("settings.watering")}</h2>
        ${this.renderToggle("settings.automatic", "settings.automatic_hint", isOn(this.hass, e.automatic), (on) =>
          this.switchTo(e.automatic, on),
        )}
        ${this.renderToggle("settings.control", "settings.control_hint", isOn(this.hass, e.control), (on) => {
          if (on) {
            this.confirming = true;
            return;
          }
          this.switchTo(e.control, false);
        })}
        ${this.confirming
          ? html`<div class="confirm">
              <span>${t("settings.control_confirm")}</span>
              <button class="text" @click=${() => (this.confirming = false)}>${t("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${() => {
                  this.confirming = false;
                  this.switchTo(e.control, true);
                }}
              >
                ${t("settings.confirm")}
              </button>
            </div>`
          : nothing}
        <div class="divider"></div>
        ${this.month(e.season_start, "settings.season_start")} ${this.month(e.season_end, "settings.season_end")}
        <p class="muted small">${t("settings.season_hint")}</p>
      </section>
    `;
  }

  /** What holds watering: rain and frost; soil limits are per zone. */
  private renderWateringRules(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    return html`
      <section class="card">
        <h2>${t("settings.watering_rules")}</h2>
        ${numberControl(this.hass, e.rain_max, t("settings.rain_max"))}
        ${numberControl(this.hass, e.frost_min, t("settings.frost_min"))}
        <p class="muted small">${t("settings.limits_hint")}</p>
      </section>
    `;
  }

  /** Main switch of mowing, then its start and season. */
  private renderMowing(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    const mode = this.hass.states[e.mower_start_mode]?.state;
    const startTime = this.hass.states[e.mower_start_time]?.state ?? "";
    return html`
      <section class="card">
        <h2>${t("settings.mowing")}</h2>
        ${this.renderToggle("settings.automatic_mowing", "settings.automatic_mowing_hint", isOn(this.hass, e.automatic_mowing), (on) =>
          this.switchTo(e.automatic_mowing, on),
        )}
        <div class="divider"></div>
        <div class="number">
          <span class="label">${t("settings.mower_start")}</span>
          <select
            class="inline"
            @change=${(event: Event) =>
              this.hass.callService("select", "select_option", {
                entity_id: e.mower_start_mode,
                option: (event.target as HTMLSelectElement).value,
              })}
          >
            ${MOWER_MODES.map(
              (option) =>
                html`<option value=${option} ?selected=${option === mode}>${t(`mowmode.${option}` as TranslationKey)}</option>`,
            )}
          </select>
        </div>
        ${mode === "sunrise" || mode === "sunset" ? numberControl(this.hass, e.mower_offset, t("settings.mower_offset")) : nothing}
        ${mode === "at_time"
          ? html`<div class="number">
              <span class="label">${t("zone.start_time")}</span>
              <input
                class="text"
                type="time"
                .value=${startTime.slice(0, 5)}
                @change=${(event: Event) =>
                  this.hass.callService("time", "set_value", {
                    entity_id: e.mower_start_time,
                    time: `${(event.target as HTMLInputElement).value}:00`,
                  })}
              />
            </div>`
          : nothing}
        ${this.month(e.mower_season_start, "settings.season_start")}
        ${this.month(e.mower_season_end, "settings.season_end")}
        <p class="muted small">${t("settings.mower_season_hint")}</p>
      </section>
    `;
  }

  /** What keeps the mower in: rain behind and ahead; watering and frost come from the zones and the watering rules. */
  private renderMowingRules(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    return html`
      <section class="card">
        <h2>${t("settings.mowing_rules")}</h2>
        ${numberControl(this.hass, e.dry_hours, t("settings.dry_hours"))}
        ${numberControl(this.hass, e.rain_ahead_hours, t("settings.rain_ahead_hours"))}
        <p class="muted small">${t("settings.mower_hint")}</p>
      </section>
    `;
  }

  /** Which zones keep the mower in when they were watered today; saving reloads RainCast. */
  private renderLawnZones(): TemplateResult {
    const t = this.localize;
    return html`
      <section class="card">
        <h2>${t("settings.lawn_zones")}</h2>
        ${this.entry.zones.map((zone) =>
          this.renderToggleText(zone.name, t(zone.roofed ? "zone.roofed" : "settings.open_zone"), zone.mower_conflict, (on) =>
            this.setMowerConflict(zone, on),
          ),
        )}
        <p class="muted small">${t("settings.lawn_zones_hint")}</p>
      </section>
    `;
  }

  private async setMowerConflict(zone: ZoneInfo, on: boolean): Promise<void> {
    const fields = { name: zone.name, valves: zone.valves, roofed: zone.roofed, soil_sensor: zone.soil_sensor, mower_conflict: on };
    await updateZone(this.hass, this.entry.entry_id, zone.id, fields);
    fireEvent(this, "raincast-entries-changed");
  }

  private renderToggleText(title: string, hint: string, on: boolean, onChange: (on: boolean) => void) {
    return html`
      <div class="toggle-row">
        <div>
          <div>${title}</div>
          <div class="muted small">${hint}</div>
        </div>
        <button class="toggle ${on ? "on" : ""}" role="switch" aria-checked=${on} @click=${() => onChange(!on)}>
          <span></span>
        </button>
      </div>
    `;
  }

  private renderNotifications(): TemplateResult {
    const t = this.localize;
    const problems = (this.hass.states[this.entry.entities.problem]?.attributes.problems as string[] | undefined) ?? [];
    const services = [...this.entry.notify_services];
    const current = this.entry.notify_service;
    if (current && !services.includes(current)) services.unshift(current);
    return html`
      <section class="card">
        <h2>${t("settings.notifications")}</h2>
        ${problems.length
          ? html`<ul class="problems">
              ${problems.map((problem) => html`<li>${t(`problem.${problem}` as TranslationKey)}</li>`)}
            </ul>`
          : html`<p class="muted">${t("settings.no_problems")}</p>`}
        <div class="field">
          <label>${t("settings.notify_service")}</label>
          <select
            @change=${async (event: Event) => {
              const value = (event.target as HTMLSelectElement).value || null;
              await setNotifyService(this.hass, this.entry.entry_id, value);
              fireEvent(this, "raincast-entries-changed");
            }}
          >
            <option value="" ?selected=${!current}>${t("settings.notify_none")}</option>
            ${services.map(
              (service) => html`<option value=${service} ?selected=${service === current}>notify.${service}</option>`,
            )}
          </select>
        </div>
        <p class="muted small">${t("settings.notify_hint")}</p>
      </section>
    `;
  }

  static styles = [
    shared,
    controlStyles,
    css`
      /* Every card has a fixed column, so a card that grows never moves the others. */
      .layout {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--rc-gap);
        align-items: start;
      }
      .column.wide {
        grid-column: span 2;
      }
      h1.section {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 28px 0 12px;
        font-size: 1.1rem;
        font-weight: 500;
      }
      h1.section:first-child {
        margin-top: 4px;
      }
      h1.section ha-icon {
        --mdc-icon-size: 22px;
        color: var(--primary-color);
      }
      .divider {
        border-top: 1px solid var(--divider-color);
        margin: 8px 0;
      }
      select.inline {
        width: auto;
        min-width: 150px;
      }
      .column {
        display: flex;
        flex-direction: column;
        gap: var(--rc-gap);
        min-width: 0;
      }
      @media (max-width: 1250px) {
        .layout {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .column.wide {
          grid-column: span 1;
        }
      }
      @media (max-width: 760px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .toggle {
        flex: none;
        width: 44px;
        height: 24px;
        border-radius: 12px;
        border: none;
        padding: 2px;
        cursor: pointer;
        background: var(--disabled-color, #bdbdbd);
        transition: background 0.2s;
      }
      .toggle span {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
      }
      .toggle.on {
        background: var(--primary-color);
      }
      .toggle.on span {
        transform: translateX(20px);
      }
      .confirm {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin: 4px 0 8px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--rc-warn) 15%, transparent);
      }
      .confirm span {
        flex: 1;
      }
      a {
        color: var(--primary-color);
      }
      select.month {
        width: auto;
        min-width: 140px;
      }
      select {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--card-background-color, transparent);
        color: var(--primary-text-color);
        font: inherit;
      }
      .problems {
        margin: 0 0 10px;
        padding-left: 20px;
        color: var(--rc-error);
      }
    `,
  ];
}

customElements.get("raincast-settings") ?? customElements.define("raincast-settings", RainCastSettings);
