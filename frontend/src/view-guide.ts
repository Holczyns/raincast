import { LitElement, css, html, type TemplateResult } from "lit";
import { shared } from "./styles";

interface Section {
  icon: string;
  title: string;
  body: TemplateResult;
}

const PIPELINE = ["Daily start", "Interval", "Soil and rain", "Plan", "Valves one by one", "Measured time"];

const pipeline = (steps: string[]) =>
  html`<div class="pipeline">${steps.map((step) => html`<span class="chip">${step}</span>`)}</div>`;

const SECTIONS: Section[] = [
  {
    icon: "mdi:information-outline",
    title: "How RainCast works",
    body: html`
      <p>
        Once a day, a number of hours before sunrise or at a fixed time, RainCast decides which zones need water and waters
        them one valve after another. Only one valve runs at a time, so the water pressure stays the same for every zone.
      </p>
      ${pipeline(PIPELINE)}
      <ol>
        <li><b>Interval.</b> A zone is due when its interval has passed since it was last watered, or when it was never watered.</li>
        <li>
          <b>Weather.</b> A due zone open to the sky is held while the soil is wetter than the soil limit or more rain is
          forecast than the rain limit. A zone under a roof is never held.
        </li>
        <li><b>Plan.</b> The due zones are sent as a notification at the start, the skipped ones with the reason.</li>
        <li>
          <b>Watering.</b> Each valve runs for its own time. Only the time the valve reports open counts; a zone counts as
          watered at 90 % of its planned time, and only then its date moves on.
        </li>
      </ol>
    `,
  },
  {
    icon: "mdi:rocket-launch-outline",
    title: "First start and taking over",
    body: html`
      <p>
        After installation <b>Valve control</b> is off: RainCast sends the day's plan as a <i>dry run</i> but opens no valve.
        Compare it for a few days with your current setup.
      </p>
      <p>Taking over:</p>
      <ol>
        <li>
          <b>Turn off every other schedule watering the same valves</b>, including the controller's own programs. Two writers
          on one valve end in runs nobody planned.
        </li>
        <li>Turn on <b>Valve control</b> in the settings and watch the first run on the <b>Home</b> tab.</li>
      </ol>
      <p>Turning control off ends a run in progress and closes its valve.</p>
    `,
  },
  {
    icon: "mdi:weather-partly-rainy",
    title: "Weather inputs",
    body: html`
      <p>Both inputs are optional and can be any sensor:</p>
      <ul>
        <li><b>Soil moisture</b> in %, measured or a model value such as Open-Meteo's soil moisture at 3–9 cm.</li>
        <li><b>Rain forecast</b> in mm for the coming day.</li>
      </ul>
      <p>
        Without an input, zones are watered by their intervals alone. When a configured input has no value, RainCast waters
        as if it was not there and reports a problem after an hour, so a dead weather service never stops the garden from
        being watered.
      </p>
    `,
  },
  {
    icon: "mdi:valve",
    title: "Valves and controllers",
    body: html`
      <p>
        A valve can be a <code>valve</code>, <code>switch</code> or <code>input_boolean</code> entity. RainCast opens it,
        watches its state every few seconds and closes it at the end.
      </p>
      <ul>
        <li>
          Controllers that end a manual run after their own preset time, such as Orbit B-hyve, are started again with the
          time left, at most ten times.
        </li>
        <li>B-hyve valves get the run time with the start command, so they close by themselves even if Home Assistant stops.</li>
        <li>
          A valve that does not report open within a minute is skipped, the zone is not counted as watered and a problem is
          reported.
        </li>
        <li>
          If Home Assistant restarts during a run, the valves of that run are closed at the next start and the run is not
          resumed.
        </li>
      </ul>
      <p>A valve time of 0 leaves the valve out of the zone without removing it.</p>
    `,
  },
  {
    icon: "mdi:hand-back-right-outline",
    title: "Manual watering",
    body: html`
      <ul>
        <li><b>Water due zones</b> runs the plan right now, as the daily start would.</li>
        <li>
          <b>Manual</b> on a zone card waters that zone now, regardless of its interval and the weather. Each valve runs for
          the minutes you enter, its own time by default; 0 leaves a valve out.
        </li>
        <li><b>Stop</b> ends the run and closes every valve of the controller.</li>
      </ul>
      <p>
        A manual run moves the zone's last watering date only when its valves ran for at least 90 % of the zone's own time,
        so a short test does not postpone the next watering. Manual runs need Valve control; Stop always works.
      </p>
      <p>The interval and the time of each valve are changed in the settings, under Zones.</p>
    `,
  },
  {
    icon: "mdi:alert-circle-outline",
    title: "Problems and notifications",
    body: html`
      <p>Problems appear on the Repairs page and, with a notify service set, on your phone:</p>
      <table>
        <tr><th>Problem</th><th>When</th></tr>
        <tr><td>Valve unavailable</td><td>a valve has had no state for 30 minutes</td></tr>
        <tr><td>Valve did not open</td><td>at once, cleared when the valve opens in a later run</td></tr>
        <tr><td>Valve still open</td><td>a valve reports open a minute after the stop command</td></tr>
        <tr><td>Weather data lost</td><td>a configured weather input has had no value for an hour</td></tr>
      </table>
      <p>The notify service also receives the day's plan and the end of every run.</p>
    `,
  },
];

export class RainCastGuide extends LitElement {
  render() {
    return html`
      <div class="guide">
        ${SECTIONS.map(
          (section, index) => html`
            <details class="card" ?open=${index === 0}>
              <summary><ha-icon icon=${section.icon}></ha-icon><span>${section.title}</span></summary>
              <div class="body">${section.body}</div>
            </details>
          `,
        )}
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      .guide {
        max-width: 860px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      details.card {
        padding: 0;
      }
      summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        cursor: pointer;
        font-weight: 500;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::after {
        content: "";
        margin-left: auto;
        width: 8px;
        height: 8px;
        border-right: 2px solid var(--rc-muted);
        border-bottom: 2px solid var(--rc-muted);
        transform: rotate(45deg);
        transition: transform 0.2s;
      }
      details[open] summary::after {
        transform: rotate(-135deg);
      }
      summary ha-icon {
        color: var(--primary-color);
      }
      .body {
        padding: 0 16px 16px 48px;
        line-height: 1.55;
      }
      .body p,
      .body ul,
      .body ol {
        margin: 0 0 10px;
      }
      .body li {
        margin-bottom: 6px;
      }
      .pipeline {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 8px 0 12px;
      }
      .pipeline .chip:not(:last-child)::after {
        content: "→";
        margin-left: 6px;
        color: var(--rc-muted);
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 4px 0 12px;
        font-size: 0.9rem;
      }
      th,
      td {
        text-align: left;
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      th {
        color: var(--rc-muted);
        font-weight: 500;
      }
      @media (max-width: 600px) {
        .body {
          padding-left: 16px;
        }
      }
    `,
  ];
}

customElements.get("raincast-guide") ?? customElements.define("raincast-guide", RainCastGuide);
