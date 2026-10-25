import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import {
  type EntryInfo,
  type ZoneInfo,
  durationEntities,
  inSeason,
  latestResult,
  pressButton,
  runZone,
} from "./api";
import { type HomeAssistant, fireEvent, isOn, numberState } from "./ha";
import { type Localize, type TranslationKey, dayLabel, formatNumber, timeLabel } from "./localize";
import { controlStyles } from "./number-control";
import { shared } from "./styles";

const STATUS_CHIP: Record<string, string> = {
  watering: "water",
  due: "ok",
  waiting: "",
  frost: "warn",
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
    manual: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  error?: string;
  /** Zone whose manual form is open, with the minutes entered per valve. */
  manual?: { zoneId: string; minutes: Record<string, number> };

  private openManual(zone: ZoneInfo): void {
    const durations = durationEntities(zone);
    const minutes = Object.fromEntries(
      zone.valves.map((valve, index) => [valve, numberState(this.hass, durations[index]) ?? 0]),
    );
    this.manual = { zoneId: zone.id, minutes };
    this.error = undefined;
  }

  private async startManual(zone: ZoneInfo): Promise<void> {
    if (!this.manual) return;
    this.error = undefined;
    try {
      await runZone(this.hass, this.entry.entry_id, zone.id, this.manual.minutes);
      this.manual = undefined;
    } catch (err) {
      this.error = errorText(err);
    }
  }

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
    const t = this.localize;
    const mower = !!this.entry.sources.mower && !!this.entry.entities.mowing;
    return html`
      ${this.renderProblems()}
      <div class="status-row">${this.renderWatering()} ${mower ? this.renderMowing() : nothing} ${this.renderWeather()}</div>
      <h1 class="section"><ha-icon icon="mdi:sprinkler"></ha-icon>${t("section.zones")}</h1>
      <div class="zones">${this.entry.zones.map((zone) => this.renderZone(zone))}</div>
    `;
  }

  /** Chip shared by both status cards: switched off, out of season, or what the next start does. */
  private modeChip(automatic: string, first: string, last: string, active: TemplateResult): TemplateResult {
    const t = this.localize;
    if (!isOn(this.hass, automatic)) return html`<span class="chip warn">${t("home.automatic_off")}</span>`;
    const from = numberState(this.hass, first);
    const to = numberState(this.hass, last);
    const outOfSeason = (from !== undefined) && (to !== undefined) && !inSeason(from, to);
    if (outOfSeason) return html`<span class="chip warn">${t("home.out_of_season")}</span>`;
    return active;
  }

  private nextText(entityId: string | undefined, label: TranslationKey, offLabel: TranslationKey, automatic: string) {
    const t = this.localize;
    const next = entityId ? this.hass.states[entityId]?.state : undefined;
    const date = next && !["unknown", "unavailable"].includes(next) ? new Date(next) : undefined;
    if (date) return t(label, { day: dayLabel(date), time: timeLabel(date) });
    return t(isOn(this.hass, automatic) ? "home.no_start" : offLabel);
  }

  private renderWatering(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    const control = isOn(this.hass, e.control);
    const running = this.hass.states[e.running];
    const watering = running?.state === "on";
    const attributes = running?.attributes ?? {};
    const chip = watering
      ? html`<span class="chip water">${t("status.watering")}</span>`
      : this.modeChip(
          e.automatic,
          e.season_start,
          e.season_end,
          html`<span class="chip ${control ? "ok" : "warn"}">${t(control ? "home.control_on" : "home.dry_run")}</span>`,
        );
    const valve = attributes.valve ? this.name(attributes.valve) : "";
    const ends = attributes.valve_ends ? timeLabel(new Date(attributes.valve_ends)) : "";
    return html`
      <section class="card status ${watering ? "active" : ""}">
        <h2>
          <ha-icon icon="mdi:sprinkler-variant"></ha-icon>
          <span class="grow">${t("section.watering")}</span>
          ${chip}
        </h2>
        <div class="big">
          ${watering
            ? t("home.watering", { zone: attributes.zone ?? "" })
            : this.nextText(e.next_start, "home.next_start", "home.automatic_off_title", e.automatic)}
        </div>
        <div class="muted small">
          ${watering
            ? html`${valve}${ends ? ` · ${t("home.valve_ends", { time: ends })}` : ""}`
            : t("home.planned_now", { minutes: this.hass.states[e.planned]?.state ?? "0" })}
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

  private renderPlan(): TemplateResult {
    const t = this.localize;
    const planned = this.hass.states[this.entry.entities.planned]?.attributes ?? {};
    const due = (planned.due as string[] | undefined) ?? [];
    const skipped = (planned.skipped as Record<string, string> | undefined) ?? {};
    return html`
      <ul class="checks">
        ${due.map((name) => this.check(true, name, t("status.due")))}
        ${Object.entries(skipped).map(([name, status]) => this.check(false, name, t(`status.${status}` as TranslationKey)))}
      </ul>
    `;
  }

  /** One line of a status list: passed or held, with its reason. */
  private check(passed: boolean, label: string, detail: string): TemplateResult {
    return html`<li class=${passed ? "" : "muted"}>
      <ha-icon class=${passed ? "ok" : "held"} icon=${passed ? "mdi:check-circle" : "mdi:minus-circle-outline"}></ha-icon>
      <span class="grow">${label}</span><span class="small">${detail}</span>
    </li>`;
  }

  private renderMowing(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    const mower = this.entry.sources.mower ?? "";
    const status = this.hass.states[e.mowing]?.state ?? "unknown";
    const mowing = status === "mowing";
    const chip = mowing
      ? html`<span class="chip water">${t("mow.mowing")}</span>`
      : this.modeChip(
          e.automatic_mowing,
          e.mower_season_start,
          e.mower_season_end,
          html`<span class="chip ${status === "ready" ? "ok" : "warn"}">${t(status === "ready" ? "mow.ready" : "mow.held")}</span>`,
        );
    return html`
      <section class="card status ${mowing ? "active" : ""}">
        <h2>
          <ha-icon icon="mdi:robot-mower-outline"></ha-icon>
          <span class="grow">${t("section.mowing")}</span>
          ${chip}
        </h2>
        <div class="big">
          ${mowing ? t("mow.mowing") : this.nextText(e.next_mowing, "home.next_mowing_at", "home.automatic_mowing_off", e.automatic_mowing)}
        </div>
        <div class="muted small">${t("home.mower_is", { state: this.hass.states[mower]?.state ?? "–" })}</div>
        ${this.renderMowChecks()}
        <div class="actions">
          <button class="text primary" ?disabled=${mowing} @click=${() => this.press(e.mow_now)}>
            <ha-icon icon="mdi:play"></ha-icon> ${t("home.mow_now")}
          </button>
        </div>
      </section>
    `;
  }

  /** Every condition the mower waits for, each with its own state, in the order the mower checks them. */
  private renderMowChecks(): TemplateResult {
    const t = this.localize;
    const e = this.entry.entities;
    const s = this.entry.sources;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const lawn = this.entry.zones.filter((zone) => zone.mower_conflict);
    const watered = lawn.some((zone) => this.hass.states[zone.entities.last_watered]?.state === today);
    const wateringNow = this.hass.states[e.mowing]?.state === "watering";
    const raining = isOn(this.hass, e.raining);
    const since = numberState(this.hass, e.hours_since_rain);
    const ahead = numberState(this.hass, e.hours_to_rain);
    const dry = numberState(this.hass, e.dry_hours) ?? 0;
    const window = numberState(this.hass, e.rain_ahead_hours) ?? 0;
    const outdoor = numberState(this.hass, s.outdoor_sensor ?? undefined);
    const frostMin = numberState(this.hass, e.frost_min);
    const rained = raining || ((since !== undefined) && (since < dry));
    const soon = (ahead !== undefined) && (ahead < window);
    const frost = (outdoor !== undefined) && (frostMin !== undefined) && (outdoor < frostMin);
    const sinceText = raining ? t("home.raining") : since === undefined ? "–" : t("home.hours_ago", { hours: formatNumber(since, 1) });
    const aheadText = ahead === undefined ? t("home.no_rain_ahead") : t("home.in_hours", { hours: formatNumber(ahead, 1) });
    return html`
      <ul class="checks">
        ${this.check(!(watered || wateringNow), t("mowcheck.lawn"), t(wateringNow ? "mow.watering" : watered ? "mow.watered" : "mowcheck.dry_lawn"))}
        ${s.weather ? this.check(!rained, t("mowcheck.rain_behind", { hours: formatNumber(dry, 0) }), sinceText) : nothing}
        ${s.weather ? this.check(!soon, t("mowcheck.rain_ahead", { hours: formatNumber(window, 1) }), aheadText) : nothing}
        ${s.outdoor_sensor ? this.check(!frost, t("mowcheck.frost"), outdoor === undefined ? "–" : `${formatNumber(outdoor, 1)} °C`) : nothing}
      </ul>
    `;
  }

  /** Every weather input in one place: rain forecast and frost for watering, rain now, behind and ahead. */
  private renderWeather(): TemplateResult {
    const t = this.localize;
    const s = this.entry.sources;
    const e = this.entry.entities;
    const raining = isOn(this.hass, e.raining);
    const since = numberState(this.hass, e.hours_since_rain);
    const ahead = numberState(this.hass, e.hours_to_rain);
    return html`
      <section class="card status">
        <h2>
          <ha-icon icon="mdi:weather-partly-rainy"></ha-icon>
          <span class="grow">${t("home.weather")}</span>
          ${s.weather ? html`<span class="chip ${raining ? "warn" : "ok"}">${t(raining ? "home.raining" : "home.dry")}</span>` : nothing}
        </h2>
        ${this.renderGauge(t("home.rain"), s.rain_sensor, e.rain_max, "mm")}
        ${s.outdoor_sensor ? this.renderGauge(t("home.outdoor"), s.outdoor_sensor, e.frost_min, "°C", true) : nothing}
        ${s.weather
          ? html`
              <div class="gauge">
                <span>${t("home.last_rain")}</span>
                <span>${raining ? t("home.raining") : since === undefined ? "–" : t("home.hours_ago", { hours: formatNumber(since, 1) })}</span>
              </div>
              <div class="gauge">
                <span>${t("home.next_rain")}</span>
                <span>${ahead === undefined ? t("home.no_rain_ahead") : t("home.in_hours", { hours: formatNumber(ahead, 1) })}</span>
              </div>
            `
          : nothing}
        <p class="muted small">${t("home.weather_hint")}</p>
      </section>
    `;
  }

  /**
   * Value against its limit; the bar is full at twice the limit. With below, the value holds
   * when it is under the limit (frost) and the bar is left out.
   */
  private renderGauge(
    label: string,
    sensor: string | null | undefined,
    limitEntity: string,
    unit: string,
    below = false,
  ): TemplateResult {
    const t = this.localize;
    if (!sensor) {
      return html`<div class="gauge"><span>${label}</span><span class="muted">${t("home.not_configured")}</span></div>`;
    }
    const value = numberState(this.hass, sensor);
    const limit = numberState(this.hass, limitEntity);
    const known = value !== undefined && limit !== undefined;
    const over = known && (below ? value < limit : value > limit);
    const share = value !== undefined && limit ? Math.min(value / (2 * limit), 1) : 0;
    if (below) {
      return html`
        <div class="gauge">
          <span>${label}</span>
          <span class=${over ? "warn-text" : ""}>
            ${value === undefined ? t("home.no_value") : `${formatNumber(value, 1)} ${unit}`}
            <span class="muted small">/ ${t("home.frost_below", { limit: formatNumber(limit, 1) })}</span>
          </span>
        </div>
      `;
    }
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
    const interval = numberState(this.hass, zone.entities.interval);
    const durations = durationEntities(zone);
    const manual = this.manual?.zoneId === zone.id ? this.manual : undefined;
    const latest = latestResult(this.entry, zone.id);
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
          <dt>${t("zone.next_start")}</dt>
          <dd>${this.startText(zone)}</dd>
          <dt>${t("zone.interval")}</dt>
          <dd>${t("zone.every_days", { days: interval ?? "–" })}</dd>
          ${this.renderSoil(zone)} ${this.renderWater(zone)}
        </dl>
        <div class="valves">
          ${zone.valves.map((valve, index) => {
            const open = OPEN_STATES.includes(this.hass.states[valve]?.state ?? "");
            const flow = latest?.valves?.find((item) => item.entity_id === valve)?.flow;
            return html`
              <div class="valve">
                <span class="dot ${open ? "open" : ""}" title=${this.hass.states[valve]?.state ?? ""}></span>
                <span class="grow">${this.name(valve)}</span>
                ${manual
                  ? html`<input
                        class="text minutes"
                        type="number"
                        min="0"
                        max="240"
                        step="1"
                        .value=${String(manual.minutes[valve] ?? 0)}
                        @change=${(event: Event) => {
                          const value = Number.parseFloat((event.target as HTMLInputElement).value);
                          this.manual = {
                            ...manual,
                            minutes: { ...manual.minutes, [valve]: Number.isFinite(value) ? Math.max(0, value) : 0 },
                          };
                        }}
                      /><span class="unit">min</span>`
                  : html`<span class="muted">
                      ${flow !== null && flow !== undefined ? html`${t("zone.flow", { flow: formatNumber(flow, 1) })} · ` : nothing}
                      ${t("zone.minutes", { minutes: formatNumber(numberState(this.hass, durations[index]), 0) })}
                    </span>`}
              </div>
            `;
          })}
        </div>
        ${manual ? this.renderManualActions(zone) : this.renderZoneActions(zone)}
      </section>
    `;
  }

  private startText(zone: ZoneInfo): string {
    const value = this.hass.states[zone.entities.next_start]?.state;
    if (!value || ["unknown", "unavailable"].includes(value)) return this.localize("zone.no_start");
    const date = new Date(value);
    return `${dayLabel(date)}, ${timeLabel(date)}`;
  }

  /** Soil moisture the zone is judged on, against the zone's own limit. */
  private renderSoil(zone: ZoneInfo): TemplateResult | typeof nothing {
    const t = this.localize;
    const sensor = zone.soil_sensor;
    if (!sensor) return nothing;
    const value = numberState(this.hass, sensor);
    const limit = numberState(this.hass, zone.entities.soil_max);
    const wet = value !== undefined && limit !== undefined && value > limit;
    return html`
      <dt>${t("zone.soil")}</dt>
      <dd>
        <span class=${wet ? "warn-text" : ""}>${value === undefined ? t("home.no_value") : `${formatNumber(value, 1)} %`}</span>
        <span class="muted">/ ${formatNumber(limit, 0)} %</span>
      </dd>
    `;
  }

  /** Water of the latest run and in total; only with a water meter. */
  private renderWater(zone: ZoneInfo): TemplateResult | typeof nothing {
    const t = this.localize;
    if (!zone.entities.water_used) return nothing;
    const total = numberState(this.hass, zone.entities.water_used);
    const liters = latestResult(this.entry, zone.id)?.liters;
    return html`
      <dt>${t("zone.water")}</dt>
      <dd>
        ${liters !== null && liters !== undefined ? t("zone.last_run_liters", { liters: formatNumber(liters, 0) }) : "–"}
        <span class="muted">· ${t("zone.total_liters", { liters: formatNumber(total, 0) })}</span>
      </dd>
    `;
  }

  private renderZoneActions(zone: ZoneInfo): TemplateResult {
    const t = this.localize;
    return html`
      <div class="actions">
        <button class="text" @click=${() => fireEvent(this, "raincast-open-zone", zone.id)}>
          <ha-icon icon="mdi:cog-outline"></ha-icon> ${t("zone.settings")}
        </button>
        <button class="text primary" @click=${() => this.openManual(zone)}>
          <ha-icon icon="mdi:hand-water"></ha-icon> ${t("zone.manual")}
        </button>
      </div>
    `;
  }

  private renderManualActions(zone: ZoneInfo): TemplateResult {
    const t = this.localize;
    const control = isOn(this.hass, this.entry.entities.control);
    const watering = isOn(this.hass, this.entry.entities.running);
    const anyTime = Object.values(this.manual?.minutes ?? {}).some((value) => value > 0);
    return html`
      <p class="muted small">${t(control ? "zone.manual_hint" : "home.control_needed")}</p>
      <div class="actions">
        <button class="text" @click=${() => (this.manual = undefined)}>${t("zone.cancel")}</button>
        <button
          class="text primary"
          ?disabled=${!control || watering || !anyTime}
          @click=${() => this.startManual(zone)}
        >
          <ha-icon icon="mdi:play"></ha-icon> ${t("zone.run_start")}
        </button>
      </div>
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
      /* Statuses side by side, each the same width; zones below on the same grid. */
      .status-row,
      .zones {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--rc-gap);
        align-items: stretch;
      }
      .zones {
        align-items: start;
      }
      @media (max-width: 1250px) {
        .status-row,
        .zones {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 760px) {
        .status-row,
        .zones {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .card.status {
        display: flex;
        flex-direction: column;
      }
      .card.status .actions {
        margin-top: auto;
        padding-top: 8px;
      }
      h1.section {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 28px 0 12px;
        font-size: 1.1rem;
        font-weight: 500;
      }
      h1.section ha-icon {
        --mdc-icon-size: 22px;
        color: var(--primary-color);
      }
      .problems {
        margin-bottom: var(--rc-gap);
      }
      h1.section {
        margin-top: 28px;
      }
      .card.active {
        border-color: var(--rc-water);
        box-shadow: 0 0 0 1px var(--rc-water);
      }
      .card h2 ha-icon {
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
      .checks {
        list-style: none;
        margin: 12px 0 0;
        padding: 0;
        display: grid;
        gap: 4px;
      }
      .checks li {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .checks ha-icon {
        --mdc-icon-size: 18px;
      }
      ha-icon.held {
        color: var(--rc-warn);
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
      .valve {
        padding: 4px 0;
        min-height: 32px;
      }
      input.minutes {
        width: 64px;
        text-align: right;
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
