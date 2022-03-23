import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { classMap } from 'lit/directives/class-map.js';
import IconLoop from '../../assets/loop-icon.svg?raw';

@customElement('controls-loop')
export class ControlsLoop extends LitElement {
  /** Which icon is showing: ON (looping) or OFF (not looping) */
  @property({ type: Boolean }) disabled: boolean = false;
  /** whether value is changable or not */
  @property({ type: String }) mode: 'on' | 'off' = 'on';

  static styles = css`
    :root {
      margin: 0;
      padding: 0;
    }
    .button {
      all: initial;
      width: 40px;
      height: 40px;
      border-radius: 20px;
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
    .button.off > svg {
      fill: var(--primary-lighter);
    }
    .button.disabled:hover {
      cursor: not-allowed;
    }
  `;

  render() {
    return html`<button
      class=${classMap({
        on: this.mode === 'on',
        off: this.mode === 'off',
        disabled: this.disabled,
        button: true,
      })}
      @click="${this.#loopClick}"
    >
      ${unsafeHTML(IconLoop)}
    </button>`;
  }

  #loopClick() {
    if (this.disabled) {
      return;
    }
    const newMode = this.mode === 'on' ? 'off' : 'on';
    this.dispatchEvent(
      new CustomEvent('loopClick', {
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
    'controls-loop': ControlsLoop;
  }
}
