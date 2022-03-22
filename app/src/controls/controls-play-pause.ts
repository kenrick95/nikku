import { parseHTML } from './utils.js';

export class ControlsPlayPause extends HTMLElement {
  state: {
    /** Which icon is showing: play icon or pause icon? */
    mode: 'play' | 'pause';
    /** whether value is changable or not */
    disabled: boolean;
  };
  iconPlay: SVGElement | undefined;
  iconPause: SVGElement | undefined;
  button: HTMLButtonElement | undefined;
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.state = {
      mode: (this.getAttribute('mode') || 'play') as 'play' | 'pause',
      disabled: this.getAttribute('disabled') != null,
    };
    this.init();
  }
  async init() {
    let [iconPlayString, iconPauseString] = await Promise.all([
      fetch('./assets/play-icon.svg').then((res) => res.text()),
      fetch('./assets/pause-icon.svg').then((res) => res.text()),
    ]);
    this.iconPlay = parseHTML(iconPlayString) as SVGElement;
    this.iconPause = parseHTML(iconPauseString) as SVGElement;
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
  updateStateMode(newValue: 'play' | 'pause') {
    this.state.mode = newValue;
    const icon = this.state.mode === 'play' ? this.iconPlay : this.iconPause;
    if (icon && this.button?.firstChild) {
      this.button.replaceChild(icon, this.button.firstChild);
    }
  }

  updateStateDisabled(newValue: boolean) {
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
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
