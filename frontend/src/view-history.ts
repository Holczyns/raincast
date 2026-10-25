import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import type { EntryInfo, RunLogEntry, ValveResult, ZoneResult } from "./api";
import { type HomeAssistant, type LovelaceCard, createCard } from "./ha";
import { type Localize, type TranslationKey, dayLabel, formatNumber, timeLabel } from "./localize";
import { shared } from "./styles";

const GRAPH_HOURS = 24 * 7;
// The latest runs are listed; the rest open on demand.
const RUNS_SHOWN = 15;
const WATER_DAYS = 30;

export class RainCastHistory extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    showAll: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  showAll = false;
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
    const runs = this.showAll ? this.entry.log : this.entry.log.slice(0, RUNS_SHOWN);
    return html`
      <div class="graphs"></div>
      <section class="card runs">
        <h2><ha-icon icon="mdi:history"></ha-icon>${t("history.runs")}</h2>
        ${this.entry.log.length
          ? html`
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>${t("history.when")}</th>
                    <th>${t("history.kind")}</th>
                    <th>${t("history.zones")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${runs.map((run) => this.renderRun(run))}
                </tbody>
              </table>
              ${this.entry.log.length > RUNS_SHOWN
                ? html`<div class="actions">
                    <button class="text" @click=${() => (this.showAll = !this.showAll)}>
                      ${t(this.showAll ? "history.show_less" : "history.show_all", { count: this.entry.log.length })}
                    </button>
                  </div>`
                : nothing}
            `
          : html`<p class="muted">${t("history.no_runs")}</p>`}
      </section>
    `;
  }

  /** One run as a table row; its valves open below the zone they belong to. */
  private renderRun(run: RunLogEntry): TemplateResult {
    const t = this.localize;
    const started = run.started ? new Date(run.started) : undefined;
    const ended = run.ended ? new Date(run.ended) : undefined;
    const complete = !run.interrupted && run.zones.every((zone) => zone.watered);
    const when = started ? `${dayLabel(started)} ${timeLabel(started)}${ended ? `–${timeLabel(ended)}` : ""}` : "–";
    return html`
      <tr>
        <td>
          <ha-icon class=${complete ? "ok" : "warn"} icon=${complete ? "mdi:check-circle" : "mdi:alert-circle-outline"}></ha-icon>
        </td>
        <td class="nowrap">${when}</td>
        <td class="nowrap">${t(`reason.${run.reason}` as TranslationKey)}</td>
        <td>
          ${run.zones.map((zone) => this.renderZone(zone))}
          ${run.interrupted ? html`<div class="warn-text small">${t("history.interrupted")}</div>` : nothing}
        </td>
      </tr>
    `;
  }

  private renderZone(zone: ZoneResult): TemplateResult {
    const t = this.localize;
    const summary = html`
      <span class="zone-name">${zone.name}</span>
      <span class=${zone.watered ? "" : "warn-text"}>
        ${t("history.watered", { watered: formatNumber(zone.watered_min, 0), planned: formatNumber(zone.planned_min, 0) })}
        ${zone.liters !== null && zone.liters !== undefined ? html` · ${formatNumber(zone.liters, 0)} l` : nothing}
      </span>
    `;
    const valves = zone.valves ?? [];
    if (!valves.length && !zone.not_opened.length) return html`<div class="zone">${summary}</div>`;
    return html`
      <details class="zone">
        <summary>${summary}</summary>
        ${valves.map((valve) => this.renderValve(valve))}
        ${zone.not_opened.length
          ? html`<div class="warn-text small">
              ${t("history.not_opened", { valves: zone.not_opened.map((valve) => this.friendly(valve)).join(", ") })}
            </div>`
          : nothing}
      </details>
    `;
  }

  private friendly(entityId: string): string {
    return String(this.hass.states[entityId]?.attributes.friendly_name ?? entityId);
  }

  private renderValve(valve: ValveResult): TemplateResult {
    const t = this.localize;
    const parts = [t("zone.minutes", { minutes: formatNumber(valve.minutes, 1) })];
    if (valve.liters !== null) parts.push(`${formatNumber(valve.liters, 0)} l`);
    if (valve.flow !== null) parts.push(t("zone.flow", { flow: formatNumber(valve.flow, 1) }));
    return html`
      <div class="valve muted small">
        <span>${this.friendly(valve.entity_id)}</span>
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
      /* Graphs two by two, the water per zone over the full width; the run log below them. */
      .graphs {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--rc-gap);
        margin-bottom: var(--rc-gap);
      }
      .graphs > :first-child:nth-last-child(odd) {
        grid-column: 1 / -1;
      }
      @media (max-width: 900px) {
        .graphs {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      th {
        text-align: left;
        font-weight: 500;
        color: var(--rc-muted);
        padding: 4px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      td {
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
        vertical-align: top;
      }
      tr:last-child td {
        border-bottom: none;
      }
      td:first-child,
      th:first-child {
        width: 24px;
        padding-right: 0;
      }
      .nowrap {
        white-space: nowrap;
      }
      .zone {
        margin-bottom: 2px;
      }
      .zone summary,
      div.zone {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        cursor: pointer;
      }
      div.zone {
        cursor: default;
      }
      .zone-name {
        font-weight: 500;
      }
      .valve {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 2px 0 2px 16px;
      }
      ha-icon {
        --mdc-icon-size: 18px;
      }
      ha-icon.ok {
        color: var(--rc-ok);
      }
      ha-icon.warn {
        color: var(--rc-warn);
      }
      .warn-text {
        color: var(--rc-warn);
      }
    `,
  ];
}

customElements.get("raincast-history") ?? customElements.define("raincast-history", RainCastHistory);
