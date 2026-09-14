import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('controls-progress')
export class ControlsProgress extends LitElement {
  @property({ type: Boolean }) disabled = false;
  /** Current and maximum playback time in seconds. */
  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 0;

  static styles = css`
    :host { display: block; }
    input {
      display: block;
      box-sizing: border-box;
      width: 100%;
      height: 28px;
      margin: 0;
      accent-color: var(--primary-dark);
      cursor: pointer;
    }
    input:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
    input:disabled { cursor: not-allowed; }
  `;

  render() {
    return html`<input
      type="range"
      aria-label="Playback position"
      aria-valuetext=${`${describeTime(this.value)} of ${describeTime(this.max)}`}
      min="0"
      max=${this.max}
      step="1"
      .value=${String(this.value)}
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
