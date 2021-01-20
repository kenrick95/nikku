//@ts-check
class ControlsProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    /**
     *
     * @type {{ value: number, max: number }}
     */
    this.state = {
      value: parseInt(this.getAttribute('value'), 10) || 0,
      max: parseInt(this.getAttribute('max'), 10) || 0,
    };
    this.init();
  }

  async init() {
    let progressElement = /** @type {HTMLTemplateElement} */ (document.getElementById(
      'template-progress'
    )).content.cloneNode(true);

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.append(progressElement);
  }

  static get observedAttributes() {
    return ['max', 'value'];
  }

  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    this.state[name] = parseInt(newValue, 10);
    if (oldValue != null && oldValue != newValue) {
      this.update();
    }
  }
  async update() {
    console.log('u', this.state);
  }
}
customElements.define('controls-progress', ControlsProgress);
