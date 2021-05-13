//@ts-check
export class ControlsTimeDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    /**
     *
     * - disabled: whether value is changable or not
     * @type {{ value: number, max: number, disabled: boolean }}
     */
    this.state = {
      value: parseInt(this.getAttribute('value') || '0', 10) || 0,
      max: parseInt(this.getAttribute('max') || '0', 10) || 0,
      disabled: this.getAttribute('disabled') != null,
    };

    this.init();
  }

  async init() {
    let timeDisplayElement = /** @type {DocumentFragment} */ (
      /** @type {HTMLTemplateElement} */ (
        document.getElementById('template-time-display')
      ).content.cloneNode(true)
    );

    // @ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(timeDisplayElement);

    this.render();
  }

  static get observedAttributes() {
    return ['max', 'value', 'disabled'];
  }

  /**
   * @param {number} newMax
   */
  updateStateMax(newMax) {
    this.state.max = newMax;
    this.render();
  }
  /**
   * @param {number} newValue
   */
  updateStateValue(newValue) {
    this.state.value = newValue;
    this.render();
  }
  /**
   *
   * @param {boolean} newValue
   */
  updateStateDisabled(newValue) {
    this.state.disabled = newValue;
    this.render();
  }

  render() {
    const elCurrentTime = this.shadowRoot?.getElementById('current');
    const elTotalTime = this.shadowRoot?.getElementById('total');


    if (elCurrentTime) {
      elCurrentTime.textContent = getFormattedTime(this.state.value);
    }
    if (elTotalTime) {
      elTotalTime.textContent = getFormattedTime(this.state.max);
    }
  }

  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != null && oldValue != newValue) {
      if (name === 'max') {
        this.updateStateMax(parseFloat(newValue));
      } else if (name === 'value') {
        this.updateStateValue(parseFloat(newValue));
      } else if (name === 'disabled') {
        this.updateStateDisabled(newValue != null);
      }
    }
  }
}

/**
 *
 * @param {number} timeAmountInS
 */
function getFormattedTime(timeAmountInS) {
  const mm = getTwoDigits(Math.floor(timeAmountInS / 60));
  const ss = getTwoDigits(Math.floor(timeAmountInS % 60));
  return `${mm}:${ss}`;
}
/**
 *
 * @param {number} number
 * @returns
 */
function getTwoDigits(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}
customElements.define('controls-time-display', ControlsTimeDisplay);
