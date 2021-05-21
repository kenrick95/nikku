import { parseHTML } from './utils.js';

//@ts-check
export class ControlsPlayPause extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    /**
     * - mode: Which icon is showing: play icon or pause icon?
     * - disabled: whether value is changable or not
     * @type {{ mode: 'play' | 'pause', disabled: boolean }}
     */
    this.state = {
      mode:
        /** @type {'play' | 'pause'} */ (this.getAttribute('mode')) || 'play',
      disabled: this.getAttribute('disabled') != null,
    };
    this.init();
  }
  async init() {
    let [iconPlayString, iconPauseString] = await Promise.all([
      fetch('./assets/play-icon.svg').then((res) => res.text()),
      fetch('./assets/pause-icon.svg').then((res) => res.text()),
    ]);
    this.iconPlay = parseHTML(iconPlayString);
    this.iconPause = parseHTML(iconPauseString);
    this.button = document.createElement('button');
    this.button.classList.add('button');
    if (this.state.disabled) {
      this.button.classList.add('disabled');
      this.button.disabled = true;
    }

    const icon = this.state.mode === 'play' ? this.iconPlay : this.iconPause;
    this.button.appendChild(icon);

    const style = document.createElement('style');
    style.textContent = this.elementStyle;

    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.append(style, this.button);
    }

    this.button.addEventListener('click', () => {
      if (this.state.disabled) {
        return;
      }
      const newMode = this.state.mode === 'play' ? 'pause' : 'play';
      this.dispatchEvent(
        new CustomEvent('playPauseClick', {
          detail: {
            mode: newMode,
          },
        })
      );
      this.setAttribute('mode', newMode);
    });
  }
  /**
   *
   * @param {'play' | 'pause'} newValue
   */
  updateStateMode(newValue) {
    this.state.mode = newValue;
    const icon = this.state.mode === 'play' ? this.iconPlay : this.iconPause;
    if (icon && this.button?.firstChild) {
      this.button.replaceChild(icon, this.button.firstChild);
    }
  }

  /**
   *
   * @param {boolean} newValue
   */
  updateStateDisabled(newValue) {
    this.state.disabled = newValue;
    if (!this.button) {
      return;
    }
    if (this.state.disabled) {
      this.button.classList.add('disabled');
      this.button.disabled = true;
    } else {
      this.button.classList.remove('disabled');
      this.button.disabled = false;
    }
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
      if (name === 'mode' && (newValue == 'play' || newValue == 'pause')) {
        this.updateStateMode(newValue);
      } else if (name === 'disabled') {
        this.updateStateDisabled(newValue != null);
      }
    }
  }

  get elementStyle() {
    return `
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
    }`;
  }
}
customElements.define('controls-play-pause', ControlsPlayPause);
