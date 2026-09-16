import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('controls-progress')
export class ControlsProgress extends LitElement {
  @property({ type: Boolean }) disabled = false;
  /** Current and maximum playback time in seconds. */
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 0;

  static styles = css`
    :host {
      display: block;
      height: 15px;
    }
    input {
      appearance: none;
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 24px;
      margin: -4.5px 0 0;
      background: transparent;
      cursor: pointer;
    }
    input::-webkit-slider-runnable-track {
      height: 4px;
      border-radius: 2px;
      background: linear-gradient(to right, var(--primary) 0 var(--progress), #e0e4e8 var(--progress) 100%);
    }
    input::-webkit-slider-thumb {
      appearance: none;
      width: 15px;
      height: 15px;
      margin-top: -5.5px;
      border: 0;
      border-radius: 50%;
      background: var(--primary);
    }
    input::-moz-range-track {
      height: 4px;
      border: 0;
      border-radius: 2px;
      background: #e0e4e8;
    }
    input::-moz-range-progress {
      height: 4px;
      border-radius: 2px;
      background: var(--primary);
    }
    input::-moz-range-thumb {
      width: 15px;
      height: 15px;
      border: 0;
      border-radius: 50%;
      background: var(--primary);
    }
    input:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
    input:disabled { opacity: 1; cursor: not-allowed; }
  `;

  render() {
    return html`<input
      type="range"
      aria-label="Playback position"
      aria-valuetext=${`${describeTime(this.value)} of ${describeTime(this.max)}`}
      min="0"
      max=${this.max}
      step="any"
      .value=${String(this.value)}
      style=${`--progress: ${this.max > 0 ? Math.max(0, Math.min(100, this.value / this.max * 100)) : 0}%`}
      ?disabled=${this.disabled || this.max <= 0}
      @input=${this.#handleInput}
    />`;
  }

  #handleInput(event: Event) {
    if (this.disabled || this.max <= 0) return;
    this.value = Number((event.target as HTMLInputElement).value);
    this.dispatchEvent(new CustomEvent('progressValueChange', {
      detail: { value: this.value },
    }));
  }
}

function describeTime(seconds: number) {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  const remainder = wholeSeconds % 60;
  return `${minutes} minute${minutes === 1 ? '' : 's'} ${remainder} second${remainder === 1 ? '' : 's'}`;
}

declare global {
  interface HTMLElementTagNameMap {
    'controls-progress': ControlsProgress;
  }
}
