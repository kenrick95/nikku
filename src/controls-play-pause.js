import { parseHTML } from './utils.js';

//@ts-check
class ControlsPlayPause extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    /**
     * - mode: Which icon is showing: play icon or pause icon?
     * @type {{ mode: 'play' | 'pause' }}
     */
    this.state = {
      mode:
        /** @type {'play' | 'pause'} */ (this.getAttribute('mode')) || 'play',
    };
    this.init();
  }
  async init() {
    let [iconPlayString, iconPauseString] = await Promise.all([
      fetch('../assets/play-icon.svg').then((res) => res.text()),
      fetch('../assets/pause-icon.svg').then((res) => res.text()),
    ]);
    this.iconPlay = parseHTML(iconPlayString);
    this.iconPause = parseHTML(iconPauseString);
    this.button = document.createElement('button');
    this.button.classList.add('button');

    const icon = this.state.mode === 'play' ? this.iconPlay : this.iconPause;
    this.button.appendChild(icon);

    const style = document.createElement('style');
    style.textContent = this.elementStyle;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.append(style, this.button);

    this.button.addEventListener('click', () => {
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
    this.state[name] = newValue;
    if (oldValue != null && oldValue != newValue) {
      if (name === 'mode' && this.button) {
        const icon =
          this.state.mode === 'play' ? this.iconPlay : this.iconPause;
        this.button.replaceChild(icon, this.button.firstChild);
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
    .button:hover {
      background: var(--primary-lightest-1);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
      cursor: pointer;
    }`;
  }
}
customElements.define('controls-play-pause', ControlsPlayPause);
