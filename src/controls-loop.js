import { parseHTML } from './utils.js';

//@ts-check
export class ControlsLoop extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    /**
     * - mode: Which icon is showing: ON (looping) or OFF (not looping)
     * - disabled: whether value is changable or not
     * @type {{ mode: 'on' | 'off', disabled: boolean }}
     */
    this.state = {
      mode: /** @type {'on' | 'off'} */ (this.getAttribute('mode')) || 'on',
      disabled: this.getAttribute('disabled') != null,
    };
    /**
     * @type {undefined | HTMLButtonElement}
     */
    this.button = undefined;
    this.init();
  }

  updateButtonClass() {
    if (!this.button) {
      return;
    }
    if (this.state.mode === 'on') {
      this.button.classList.add('on');
      this.button.classList.remove('off');
    } else {
      this.button.classList.remove('on');
      this.button.classList.add('off');
    }

    if (this.state.disabled) {
      this.button.classList.add('disabled');
    } else {
      this.button.classList.remove('disabled');
    }
  }

  async init() {
    let loopElement = /** @type {HTMLTemplateElement} */ (
      document.getElementById('template-loop')
    ).content.cloneNode(true);

    this.iconLoop = parseHTML(
      await fetch('../assets/loop-icon.svg').then((res) => res.text())
    );
    this.button = document.createElement('button');
    this.button.classList.add('button');
    this.updateButtonClass();

    this.button.appendChild(this.iconLoop);
    loopElement.appendChild(this.button);

    //@ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(loopElement);

    this.button.addEventListener('click', () => {
      if (this.state.disabled) {
        return;
      }
      const newMode = this.state.mode === 'on' ? 'off' : 'on';
      this.dispatchEvent(
        new CustomEvent('loopClick', {
          detail: {
            mode: newMode,
          },
        })
      );
      this.setAttribute('mode', newMode);
    });
  }

  static get observedAttributes() {
    return ['mode', 'disabled'];
  }

  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != newValue) {
      if (name === 'mode') {
        this.state.mode = /** @type {'on' | 'off'} */ (newValue);
        this.updateButtonClass();
      } else if (name === 'disabled') {
        this.state.disabled = newValue != null;
        this.updateButtonClass();
      }
    }
  }
}
customElements.define('controls-loop', ControlsLoop);
