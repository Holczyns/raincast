import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { type EntryInfo, setNotifyService } from "./api";
import { type HomeAssistant, fireEvent, isOn } from "./ha";
import type { Localize, TranslationKey } from "./localize";
import { controlStyles, numberControl } from "./number-control";
import "./setup-cards";
import { shared } from "./styles";

const START_MODES = ["before_sunrise", "at_time", "off"];

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
    return html`
      <div class="layout">
        <div class="column">${this.renderControl()} ${this.renderSchedule()} ${this.renderLimits()}</div>
        <div class="column">
          <raincast-zones-card
            .hass=${this.hass}
            .entry=${this.entry}
            .localize=${this.localize}
            .focusZone=${this.focusZone}
          ></raincast-zones-card>
        </div>
        <div class="column">
          <raincast-sources-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></raincast-sources-card>
          ${this.renderNotifications()}
        </div>
      </div>
      <p class="small">
        <a href="/config/integrations/integration/raincast">${this.localize("settings.entities")}</a>
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

  private renderControl(): TemplateResult {
    const t = this.localize;
    const control = this.entry.entities.control;
    const switchTo = (on: boolean) => this.hass.callService("switch", on ? "turn_on" : "turn_off", { entity_id: control });
    return html`
      <section class="card">
        <h2>${t("settings.control_title")}</h2>
        ${this.renderToggle("settings.control", "settings.control_hint", isOn(this.hass, control), (on) => {
          if (on) {
            this.confirming = true;
            return;
          }
          switchTo(false);
        })}
        ${this.confirming
          ? html`<div class="confirm">
              <span>${t("settings.control_confirm")}</span>
              <button class="text" @click=${() => (this.confirming = false)}>${t("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${() => {
                  this.confirming = false;
                  switchTo(true);
                }}
              >
                ${t("settings.confirm")}
              </button>
            </div>`
          : nothing}
      </section>
    `;
  }

  private renderSchedule(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    const mode = this.hass.states[e.start_mode]?.state;
    const startTime = this.hass.states[e.start_time]?.state ?? "";
    return html`
      <section class="card">
        <h2>${t("settings.schedule")}</h2>
        <div class="field">
          <label>${t("settings.start_mode")}</label>
          <select
            @change=${(event: Event) =>
              this.hass.callService("select", "select_option", {
                entity_id: e.start_mode,
                option: (event.target as HTMLSelectElement).value,
              })}
          >
            ${START_MODES.map(
              (option) =>
                html`<option value=${option} ?selected=${option === mode}>${t(`mode.${option}` as TranslationKey)}</option>`,
            )}
          </select>
        </div>
        ${mode === "before_sunrise" ? numberControl(this.hass, e.sunrise_offset, t("settings.sunrise_offset")) : nothing}
        ${mode === "at_time"
          ? html`<div class="number">
              <span class="label">${t("settings.start_time")}</span>
              <input
                class="text"
                type="time"
                .value=${startTime.slice(0, 5)}
                @change=${(event: Event) =>
                  this.hass.callService("time", "set_value", {
                    entity_id: e.start_time,
                    time: `${(event.target as HTMLInputElement).value}:00`,
                  })}
              />
            </div>`
          : nothing}
        <p class="muted small">${t("settings.schedule_hint")}</p>
      </section>
    `;
  }

  private renderLimits(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    return html`
      <section class="card">
        <h2>${t("settings.limits")}</h2>
        ${numberControl(this.hass, e.soil_max, t("settings.soil_max"))}
        ${numberControl(this.hass, e.rain_max, t("settings.rain_max"))}
        <p class="muted small">${t("settings.limits_hint")}</p>
      </section>
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
