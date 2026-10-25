import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { type EntryInfo, type ZoneInfo, durationEntities, pressButton } from "./api";
import { type HomeAssistant, isOn, numberState } from "./ha";
import { type Localize, type TranslationKey, dayLabel, formatNumber, timeLabel } from "./localize";
import { controlStyles, numberControl } from "./number-control";
import { shared } from "./styles";

const STATUS_CHIP: Record<string, string> = {
  watering: "water",
  due: "ok",
  waiting: "",
  wet_soil: "warn",
  rain_forecast: "warn",
  no_duration: "warn",
};
const OPEN_STATES = ["open", "opening", "on"];

function errorText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

export class RainCastHome extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    error: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  error?: string;

  private async press(entityId: string | undefined): Promise<void> {
    this.error = undefined;
    try {
      await pressButton(this.hass, entityId);
    } catch (err) {
      this.error = errorText(err);
    }
  }

  private name(entityId: string): string {
    return String(this.hass.states[entityId]?.attributes.friendly_name ?? entityId);
  }

  render() {
    return html`
      <div class="layout">
        <div class="column">${this.renderStatus()} ${this.renderWeather()} ${this.renderProblems()}</div>
        <div class="zones">${this.entry.zones.map((zone) => this.renderZone(zone))}</div>
      </div>
    `;
  }

  private renderStatus(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    const control = isOn(this.hass, e.control);
    const running = this.hass.states[e.running];
    const watering = running?.state === "on";
    return html`
      <section class="card status ${watering ? "active" : ""}">
        <div class="headline">
          <ha-icon icon=${watering ? "mdi:sprinkler-variant" : "mdi:calendar-clock"}></ha-icon>
          <div class="grow">${watering ? this.renderRunning() : this.renderNext()}</div>
          <span class="chip ${control ? "ok" : "warn"}">${t(control ? "home.control_on" : "home.dry_run")}</span>
        </div>
        ${this.renderPlan()}
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        <div class="actions">
          ${watering
            ? html`<button class="text danger" @click=${() => this.press(e.stop)}>
                <ha-icon icon="mdi:water-off"></ha-icon> ${t("home.stop")}
              </button>`
            : html`<button
                class="text primary"
                ?disabled=${!control}
                title=${control ? "" : t("home.control_needed")}
                @click=${() => this.press(e.run_due)}
              >
                <ha-icon icon="mdi:play"></ha-icon> ${t("home.run_due")}
              </button>`}
        </div>
      </section>
    `;
  }

  private renderRunning(): TemplateResult {
    const t = this.localize;
    const attributes = this.hass.states[this.entry.entities.running]?.attributes ?? {};
    const valve = attributes.valve ? this.name(attributes.valve) : "";
    const ends = attributes.valve_ends ? timeLabel(new Date(attributes.valve_ends)) : "";
    return html`
      <div class="big">${t("home.watering", { zone: attributes.zone ?? "" })}</div>
      <div class="muted small">${valve}${ends ? ` · ${t("home.valve_ends", { time: ends })}` : ""}</div>
    `;
  }

  private renderNext(): TemplateResult {
    const t = this.localize;
    const next = this.hass.states[this.entry.entities.next_start]?.state;
    const date = next && !["unknown", "unavailable"].includes(next) ? new Date(next) : undefined;
    if (!date) {
      return html`<div class="big">${t("home.no_start")}</div>
        <div class="muted small">${t("home.no_start_hint")}</div>`;
    }
    return html`
      <div class="big">${t("home.next_start", { day: dayLabel(date), time: timeLabel(date) })}</div>
      <div class="muted small">${t("home.planned_now", { minutes: this.hass.states[this.entry.entities.planned]?.state ?? "0" })}</div>
    `;
  }

  private renderPlan(): TemplateResult {
    const t = this.localize;
    const planned = this.hass.states[this.entry.entities.planned]?.attributes ?? {};
    const due = (planned.due as string[] | undefined) ?? [];
    const skipped = (planned.skipped as Record<string, string> | undefined) ?? {};
    return html`
      <ul class="plan">
        ${due.map((name) => html`<li><ha-icon class="ok" icon="mdi:check-circle"></ha-icon>${name}</li>`)}
        ${Object.entries(skipped).map(
          ([name, status]) =>
            html`<li class="muted">
              <ha-icon icon="mdi:skip-next-circle-outline"></ha-icon>${name} · ${t(`status.${status}` as TranslationKey)}
            </li>`,
        )}
      </ul>
    `;
  }

  private renderWeather(): TemplateResult {
    const t = this.localize;
    const s = this.entry.sources;
    const e = this.entry.entities;
    return html`
      <section class="card">
        <h2><ha-icon icon="mdi:weather-partly-rainy"></ha-icon>${t("home.weather")}</h2>
        ${this.renderGauge(t("home.soil"), s.soil_sensor, e.soil_max, "%")}
        ${this.renderGauge(t("home.rain"), s.rain_sensor, e.rain_max, "mm")}
        <p class="muted small">${t("home.weather_hint")}</p>
      </section>
    `;
  }

  /** Value against its limit; the bar is full at twice the limit. */
  private renderGauge(label: string, sensor: string | null | undefined, limitEntity: string, unit: string): TemplateResult {
    const t = this.localize;
    if (!sensor) {
      return html`<div class="gauge"><span>${label}</span><span class="muted">${t("home.not_configured")}</span></div>`;
    }
    const value = numberState(this.hass, sensor);
    const limit = numberState(this.hass, limitEntity);
    const over = value !== undefined && limit !== undefined && value > limit;
    const share = value !== undefined && limit ? Math.min(value / (2 * limit), 1) : 0;
    return html`
      <div class="gauge">
        <span>${label}</span>
        <span class=${over ? "warn-text" : ""}>
          ${value === undefined ? t("home.no_value") : `${formatNumber(value, 1)} ${unit}`}
          <span class="muted small">/ ${formatNumber(limit, 1)} ${unit}</span>
        </span>
      </div>
      <div class="bar"><span class=${over ? "over" : ""} style="width: ${share * 100}%"></span><i></i></div>
    `;
  }

  private renderProblems(): TemplateResult | typeof nothing {
    const problems = (this.hass.states[this.entry.entities.problem]?.attributes.problems as string[] | undefined) ?? [];
    if (!problems.length) return nothing;
    return html`
      <section class="card problems">
        <h2><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this.localize("home.problems")}</h2>
        <ul>
          ${problems.map((problem) => html`<li>${this.localize(`problem.${problem}` as TranslationKey)}</li>`)}
        </ul>
      </section>
    `;
  }

  private renderZone(zone: ZoneInfo): TemplateResult {
    const t = this.localize;
    const status = this.hass.states[zone.entities.status];
    const state = status?.state ?? "unknown";
    const last = this.hass.states[zone.entities.last_watered]?.state;
    const next = this.hass.states[zone.entities.next_due]?.state;
    const control = isOn(this.hass, this.entry.entities.control);
    const watering = isOn(this.hass, this.entry.entities.running);
    const durations = durationEntities(zone);
    return html`
      <section class="card zone ${state === "watering" ? "active" : ""}">
        <h2>
          <ha-icon icon=${zone.roofed ? "mdi:greenhouse" : "mdi:sprinkler"}></ha-icon>
          <span class="grow">${zone.name}</span>
          <span class="chip ${STATUS_CHIP[state] ?? ""}">${t(`status.${state}` as TranslationKey)}</span>
        </h2>
        <dl>
          <dt>${t("zone.last_watered")}</dt>
          <dd>${this.dateText(last, status?.attributes.days_since)}</dd>
          <dt>${t("zone.next_due")}</dt>
          <dd>${this.dateText(next)}</dd>
          <dt>${t("zone.total")}</dt>
          <dd>${t("zone.minutes", { minutes: status?.attributes.minutes ?? 0 })}</dd>
        </dl>
        ${numberControl(this.hass, zone.entities.interval, t("zone.interval"))}
        <div class="valves">
          ${zone.valves.map((valve, index) => {
            const open = OPEN_STATES.includes(this.hass.states[valve]?.state ?? "");
            return html`
              <div class="valve">
                <span class="dot ${open ? "open" : ""}" title=${this.hass.states[valve]?.state ?? ""}></span>
                ${numberControl(this.hass, durations[index], this.name(valve))}
              </div>
            `;
          })}
        </div>
        <div class="actions">
          <button
            class="text primary"
            ?disabled=${!control || watering}
            title=${control ? "" : t("home.control_needed")}
            @click=${() => this.press(zone.entities.run)}
          >
            <ha-icon icon="mdi:play"></ha-icon> ${t("zone.run")}
          </button>
        </div>
      </section>
    `;
  }

  private dateText(value: string | undefined, daysSince?: number | null): string {
    const t = this.localize;
    if (!value || ["unknown", "unavailable"].includes(value)) return t("zone.never");
    const date = new Date(`${value}T00:00:00`);
    const label = dayLabel(date);
    if ((daysSince === undefined) || (daysSince === null) || (daysSince < 2)) return label;
    return `${label} · ${t("zone.days_ago", { days: daysSince })}`;
  }

  static styles = [
    shared,
    controlStyles,
    css`
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
        gap: var(--rc-gap);
        align-items: start;
      }
      .column {
        display: flex;
        flex-direction: column;
        gap: var(--rc-gap);
        min-width: 0;
      }
      .zones {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--rc-gap);
        align-items: start;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .card.active {
        border-color: var(--rc-water);
        box-shadow: 0 0 0 1px var(--rc-water);
      }
      .headline {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .headline ha-icon {
        --mdc-icon-size: 32px;
        color: var(--rc-water);
      }
      .grow {
        flex: 1;
        min-width: 0;
      }
      .big {
        font-size: 1.15rem;
        font-weight: 500;
      }
      .plan {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .plan li {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .plan ha-icon {
        --mdc-icon-size: 18px;
      }
      ha-icon.ok {
        color: var(--rc-ok);
      }
      .actions button ha-icon {
        --mdc-icon-size: 18px;
      }
      .gauge {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-top: 8px;
      }
      .warn-text {
        color: var(--rc-warn);
        font-weight: 500;
      }
      .bar {
        position: relative;
        height: 6px;
        border-radius: 3px;
        margin: 6px 0 4px;
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
        overflow: hidden;
      }
      .bar span {
        display: block;
        height: 100%;
        background: var(--rc-water);
      }
      .bar span.over {
        background: var(--rc-warn);
      }
      /* The limit sits in the middle of the bar. */
      .bar i {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--primary-text-color);
        opacity: 0.4;
      }
      .problems ul {
        margin: 0;
        padding-left: 20px;
        color: var(--rc-error);
      }
      dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px 16px;
        margin: 0 0 8px;
        font-size: 0.9rem;
      }
      dt {
        color: var(--rc-muted);
      }
      dd {
        margin: 0;
        text-align: right;
      }
      .valves {
        border-top: 1px solid var(--divider-color);
        margin-top: 6px;
        padding-top: 4px;
      }
      .valve {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .valve > :last-child {
        flex: 1;
      }
      .dot {
        flex: none;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--disabled-color, #bdbdbd);
      }
      .dot.open {
        background: var(--rc-water);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--rc-water) 30%, transparent);
      }
    `,
  ];
}

customElements.get("raincast-home") ?? customElements.define("raincast-home", RainCastHome);
