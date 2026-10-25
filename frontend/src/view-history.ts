import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import type { EntryInfo, RunLogEntry, ValveResult } from "./api";
import { type HomeAssistant, type LovelaceCard, createCard } from "./ha";
import { type Localize, type TranslationKey, dayLabel, formatNumber, timeLabel } from "./localize";
import { shared } from "./styles";

const GRAPH_HOURS = 24 * 7;
const WATER_DAYS = 30;

export class RainCastHistory extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  private cards: LovelaceCard[] = [];
  private cardsFor?: EntryInfo;

  protected updated(): void {
    if (this.cardsFor !== this.entry) {
      this.cardsFor = this.entry;
      this.buildCards();
    }
    for (const card of this.cards) card.hass = this.hass;
  }

  /** Native graphs: daily water per zone, weather inputs against time, and the valves as a timeline. */
  private async buildCards(): Promise<void> {
    const t = this.localize;
    const weather = [...this.entry.zones.map((zone) => zone.soil_sensor), this.entry.sources.rain_sensor].filter(
      (entity): entity is string => !!entity,
    );
    const valves = this.entry.zones.flatMap((zone) => zone.valves);
    // Zones have a water sensor only while a water meter is connected.
    const water = this.entry.zones
      .map((zone) => (zone.entities.water_used ? { entity: zone.entities.water_used, name: zone.name } : null))
      .filter((item) => item !== null);
    const configs = [
      water.length
        ? {
            type: "statistics-graph",
            title: t("history.water"),
            entities: water,
            stat_types: ["change"],
            chart_type: "bar",
            period: "day",
            days_to_show: WATER_DAYS,
          }
        : null,
      weather.length ? { type: "history-graph", title: t("history.weather"), hours_to_show: GRAPH_HOURS, entities: weather } : null,
      valves.length ? { type: "history-graph", title: t("history.valves"), hours_to_show: GRAPH_HOURS, entities: valves } : null,
    ].filter((config) => config !== null);
    const cards = await Promise.all(configs.map((config) => createCard(config)));
    this.cards = cards.filter((card): card is LovelaceCard => !!card);
    const holder = this.renderRoot.querySelector(".graphs");
    if (!holder) return;
    holder.replaceChildren(...this.cards);
    for (const card of this.cards) card.hass = this.hass;
  }

  render() {
    const t = this.localize;
    return html`
      <div class="layout">
        <section class="card">
          <h2><ha-icon icon="mdi:history"></ha-icon>${t("history.runs")}</h2>
          ${this.entry.log.length
            ? html`<div class="runs">${this.entry.log.map((run) => this.renderRun(run))}</div>`
            : html`<p class="muted">${t("history.no_runs")}</p>`}
        </section>
        <div class="graphs"></div>
      </div>
    `;
  }

  private renderRun(run: RunLogEntry): TemplateResult {
    const t = this.localize;
    const started = run.started ? new Date(run.started) : undefined;
    const ended = run.ended ? new Date(run.ended) : undefined;
    const complete = !run.interrupted && run.zones.every((zone) => zone.watered);
    const when = started ? `${dayLabel(started)} ${timeLabel(started)}${ended ? `–${timeLabel(ended)}` : ""}` : "–";
    return html`
      <div class="run">
        <div class="run-head">
          <ha-icon
            class=${complete ? "ok" : "warn"}
            icon=${complete ? "mdi:check-circle" : "mdi:alert-circle-outline"}
          ></ha-icon>
          <span class="grow">${when}</span>
          <span class="chip">${t(`reason.${run.reason}` as TranslationKey)}</span>
        </div>
        ${run.zones.map(
          (zone) => html`
            <div class="zone-row">
              <span>${zone.name}</span>
              <span class=${zone.watered ? "" : "warn-text"}>
                ${t("history.watered", { watered: formatNumber(zone.watered_min, 0), planned: formatNumber(zone.planned_min, 0) })}
                ${zone.liters !== null && zone.liters !== undefined ? html` · ${formatNumber(zone.liters, 0)} l` : nothing}
              </span>
            </div>
            ${(zone.valves ?? []).map((valve) => this.renderValve(valve))}
            ${zone.not_opened.length
              ? html`<div class="muted small">${t("history.not_opened", { valves: zone.not_opened.map((valve) => this.hass.states[valve]?.attributes.friendly_name ?? valve).join(", ") })}</div>`
              : nothing}
          `,
        )}
        ${run.interrupted ? html`<div class="muted small">${t("history.interrupted")}</div>` : nothing}
      </div>
    `;
  }

  private renderValve(valve: ValveResult): TemplateResult {
    const t = this.localize;
    const parts = [t("zone.minutes", { minutes: formatNumber(valve.minutes, 1) })];
    if (valve.liters !== null) parts.push(`${formatNumber(valve.liters, 0)} l`);
    if (valve.flow !== null) parts.push(t("zone.flow", { flow: formatNumber(valve.flow, 1) }));
    return html`
      <div class="valve-row muted small">
        <span>${this.hass.states[valve.entity_id]?.attributes.friendly_name ?? valve.entity_id}</span>
        <span>
          ${valve.no_flow ? html`<b class="warn-text">${t("history.no_flow")}</b> · ` : nothing}
          ${valve.flow_high ? html`<b class="warn-text">${t("history.flow_high")}</b> · ` : nothing} ${parts.join(" · ")}
        </span>
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
        gap: var(--rc-gap);
        align-items: start;
      }
      .graphs {
        display: flex;
        flex-direction: column;
        gap: var(--rc-gap);
        min-width: 0;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .runs {
        display: grid;
        gap: 10px;
      }
      .run {
        border-bottom: 1px solid var(--divider-color);
        padding-bottom: 10px;
      }
      .run:last-child {
        border-bottom: none;
      }
      .run-head {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }
      .grow {
        flex: 1;
      }
      ha-icon.ok {
        color: var(--rc-ok);
      }
      ha-icon.warn {
        color: var(--rc-warn);
      }
      .zone-row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        font-size: 0.9rem;
        padding-left: 28px;
      }
      .small {
        padding-left: 28px;
      }
      .warn-text {
        color: var(--rc-warn);
      }
      .valve-row {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        padding-left: 40px;
      }
    `,
  ];
}

customElements.get("raincast-history") ?? customElements.define("raincast-history", RainCastHistory);
