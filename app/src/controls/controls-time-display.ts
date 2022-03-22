
export class ControlsTimeDisplay extends HTMLElement {
  state: {
    value: number;
    max: number;
    /** whether value is changable or not*/
    disabled: boolean;
  };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      value: parseInt(this.getAttribute('value') || '0', 10) || 0,
      max: parseInt(this.getAttribute('max') || '0', 10) || 0,
      disabled: this.getAttribute('disabled') != null,
    };

    this.init();
  }

  async init() {
    let timeDisplayElement = (
      document.getElementById('template-time-display') as HTMLTemplateElement
    ).content.cloneNode(true) as DocumentFragment;

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
  updateStateMax(newMax: number) {
    this.state.max = newMax;
    this.render();
  }
  /**
   * @param {number} newValue
   */
  updateStateValue(newValue: number) {
    this.state.value = newValue;
    this.render();
  }
  /**
   *
   * @param {boolean} newValue
   */
  updateStateDisabled(newValue: boolean) {
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
 
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ) {
    if (oldValue != null && oldValue != newValue) {
      if (name === 'max') {
        this.updateStateMax(parseFloat(newValue || ''));
      } else if (name === 'value') {
        this.updateStateValue(parseFloat(newValue || ''));
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
function getFormattedTime(timeAmountInS: number) {
  const mm = getTwoDigits(Math.floor(timeAmountInS / 60));
  const ss = getTwoDigits(Math.floor(timeAmountInS % 60));
  return `${mm}:${ss}`;
}
/**
 *
 * @param {number} number
 * @returns
 */
function getTwoDigits(number: number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}
customElements.define('controls-time-display', ControlsTimeDisplay);
