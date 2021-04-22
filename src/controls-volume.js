import { parseHTML } from './utils.js';

class ControlsVolume extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    /**
     * - muted: whether the volume is muted (true) or not (false)
     * - volume: floating point number indicating silent (0.0) to loudest (1.0)
     * @type {{ muted: boolean; volume: number }}
     */
    this.state = {
      muted: /** @type {boolean} */ (!!this.getAttribute('muted')),
      volume: parseFloat(this.getAttribute('volume') || '1.0'),
    };

    this._volumeContainerWidth = undefined;
    this.init();
  }

  get volumeContainerWidth() {
    if (this._volumeContainerWidth) {
      return this._volumeContainerWidth;
    }
    return (this._volumeContainerWidth =
      this.shadowRoot?.querySelector('.volume-container')?.clientWidth ?? 0);
  }

  async init() {
    let volumeElement = /** @type {DocumentFragment} */ (
      /** @type {HTMLTemplateElement} */ (document.getElementById(
        'template-volume'
      )).content.cloneNode(true)
    );
    this.iconVolume = /** @type {SVGElement} */ (parseHTML(
      await fetch('../assets/volume-icon.svg').then((res) => res.text())
    ));
    this.iconVolume?.classList.add('volume-icon');
    volumeElement.querySelector('.volume-container')?.prepend(this.iconVolume);

    volumeElement
      .querySelector('.volume-bar')
      .addEventListener('click', (e) => {
        // TODO: Not just click :thinking: need pointerdown, pointermove, pointerleave 
      });
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.append(volumeElement);
  }

  static get observedAttributes() {
    return ['muted', 'volume'];
  }

  updateStateMode() {
    // no-op, unsupported
  }

  updateStateVolume(newValue) {
    console.log('newValue', newValue)
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
      if (name === 'muted') {
        this.updateStateMode();
      } else if (name === 'volume') {
        this.updateStateVolume(newValue);
      }
    }
  }
}
customElements.define('controls-volume', ControlsVolume);
