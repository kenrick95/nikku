import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('controls-time-display')
export class ControlsTimeDisplay extends LitElement {
  /** Whether value is changable or not */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Current time in seconds */
  @property({ type: Number }) value: number = 0;
  /** Max time in seconds */
  @property({ type: Number }) max: number = 0;

  static styles = css`
    .progress-time-display {
      display: flex;
      justify-content: flex-end;
    }
    .separator {
      margin-inline-start: 4px;
      margin-inline-end: 4px;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    .time {
      min-width: 3em;
      text-align: center;
    }
    @media (max-width: 640px) {
      .progress-time-display {
        justify-content: flex-start;
      }
      .time {
        text-align: left;
      }
    }
  `;

  render() {
    return html` <div class="progress-time-display" role="group" aria-label="Playback time">
      <div class="time" id="current"><span class="sr-only">Elapsed </span>${getFormattedTime(this.value)}</div>
      <div class="separator" aria-hidden="true">/</div>
      <div class="time" id="total"><span class="sr-only">Duration </span>${getFormattedTime(this.max)}</div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'controls-time-display': ControlsTimeDisplay;
  }
}

/**
 *
 * @param {number} timeAmountInS
 */
function getFormattedTime(timeAmountInS: number) {
  const mm = getTwoDigits(Math.floor(timeAmountInS / 60));
  const ss = getTwoDigits(Math.floor(timeAmountInS % 60));
  return `${mm}:${ss}`;
}
/**
 *
 * @param {number} number
 * @returns
 */
function getTwoDigits(number: number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}
