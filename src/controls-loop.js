import { parseHTML } from './utils.js';

//@ts-check
export class ControlsLoop extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    /**
     * - mode: Which icon is showing: ON (looping) or OFF (not looping)
     * @type {{ mode: 'on' | 'off' }}
     */
    this.state = {
      mode: /** @type {'on' | 'off'} */ (this.getAttribute('mode')) || 'on',
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
    this.button.classList.remove('on');
    this.button.classList.remove('off');
    this.button.classList.add(this.state.mode);
  }

  async init() {
    let loopElement = /** @type {HTMLTemplateElement} */ (document.getElementById(
      'template-loop'
    )).content.cloneNode(true);

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
    return ['mode'];
  }

  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != null && oldValue != newValue) {
      if (name === 'mode') {
        this.state.mode = this.state.mode === 'on' ? 'off' : 'on';
        this.updateButtonClass();
      }
    }
  }
}
customElements.define('controls-loop', ControlsLoop);
