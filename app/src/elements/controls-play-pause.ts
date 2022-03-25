import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';
import IconPlay from '../../assets/play-icon.svg?raw';
import IconPause from '../../assets/pause-icon.svg?raw';

@customElement('controls-play-pause')
export class ControlsPlayPause extends LitElement {
  /** whether value is changable or not */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Which icon is showing: play icon or pause icon? */
  @property({ type: String }) mode: 'play' | 'pause' = 'play';

  static styles = css`
    .button {
      all: initial;
      width: 80px;
      height: 80px;
      border-radius: 40px;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .button:not(.disabled):hover {
      background: var(--primary-lightest-1);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
      cursor: pointer;
    }
    .button.disabled {
      cursor: not-allowed;
    }
  `;

  render() {
    return html`<button
      class=${classMap({
        button: true,
        disabled: this.disabled,
      })}
      ?disabled=${this.disabled}
      @click=${this.#handleClick}
    >
      ${this.mode === 'play' ? unsafeHTML(IconPlay) : unsafeHTML(IconPause)}
    </button>`;
  }
  #handleClick() {
    if (this.disabled) {
      return;
    }
    const newMode = this.mode === 'play' ? 'pause' : 'play';
    this.dispatchEvent(
      new CustomEvent('playPauseClick', {
        detail: {
          mode: newMode,
        },
      })
    );
    this.mode = newMode;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'controls-play-pause': ControlsPlayPause;
  }
}
