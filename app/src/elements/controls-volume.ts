import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import IconVolumeNormal from '../../assets/volume-icon.svg?raw';
import IconVolumeMuted from '../../assets/volume-icon-muted.svg?raw';

@customElement('controls-volume')
export class ControlsVolume extends LitElement {
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) muted = false;
  /** Floating point number from silent (0) to loudest (1). */
  @property({ type: Number }) volume = 1;

  static styles = css`
    .volume-container { display: flex; align-items: center; gap: 8px; }
    button {
      all: initial;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      color: var(--primary-dark);
      cursor: pointer;
    }
    button:hover:not(:disabled) { background: var(--primary-lightest-1); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    svg { width: 100%; height: 100%; fill: currentColor; }
    input {
      width: 100px;
      height: 28px;
      margin: 0;
      accent-color: var(--primary-dark);
      cursor: pointer;
    }
    input:disabled { cursor: not-allowed; }
    button:focus-visible, input:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
  `;

  render() {
    return html`<div class="volume-container">
      <button type="button" aria-label="Mute" aria-pressed=${this.muted}
        ?disabled=${this.disabled} @click=${this.#handleVolumeIconClick}>
        <span aria-hidden="true">${unsafeHTML(this.muted ? IconVolumeMuted : IconVolumeNormal)}</span>
      </button>
      <input type="range" aria-label="Volume"
        aria-valuetext=${`${Math.round(this.volume * 100)}%${this.muted ? ', muted' : ''}`}
        min="0" max="100" step="1"
        .value=${String(Math.round(this.volume * 100))}
        ?disabled=${this.disabled} @input=${this.#handleInput} />
    </div>`;
  }

  #handleVolumeIconClick() {
    if (this.disabled) return;
    this.muted = !this.muted;
    this.dispatchEvent(new CustomEvent('mutedChange', {
      detail: { muted: this.muted },
    }));
  }

  #handleInput(event: Event) {
    if (this.disabled) return;
    this.volume = Number((event.target as HTMLInputElement).value) / 100;
    this.muted = false;
    this.dispatchEvent(new CustomEvent('volumeChange', {
      detail: { volume: this.volume },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'controls-volume': ControlsVolume;
  }
}
