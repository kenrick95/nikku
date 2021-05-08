//@ts-check
export class ControlsProgress extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    /**
     *
     * @type {{ value: number, max: number }}
     */
    this.state = {
      value: parseInt(this.getAttribute('value') || '0', 10) || 0,
      max: parseInt(this.getAttribute('max') || '0', 10) || 0,
    };
    this._isDragging = false;

    /** @type {HTMLDivElement | undefined} */
    this.progressActive = undefined;

    /** @type {HTMLDivElement | undefined} */
    this.progressIndicator = undefined;

    this.init();
  }

  async init() {
    let progressElement = /** @type {DocumentFragment} */ (
      /** @type {HTMLTemplateElement} */ (document.getElementById(
        'template-progress'
      )).content.cloneNode(true)
    );

    this.progressActive = /** @type {HTMLDivElement} */ (progressElement.querySelector(
      '.progress-active'
    ));
    this.progressIndicator = /** @type {HTMLDivElement} */ (progressElement.querySelector(
      '.progress-indicator'
    ));
    const progressBar = /** @type {HTMLDivElement} */ (progressElement.querySelector(
      '.progress-bar'
    ));

    // Cache the values because they cause page reflow
    /** @type {number | null} */
    let cachedProgressBarOffsetLeft = null;
    /** @type {number | null} */
    let cachedProgressBarClientWidth = null;

    /**
     *
     * @param {MouseEvent} e
     */
    const updateVolumeFromEvent = (e) => {
      if (!cachedProgressBarOffsetLeft) {
        cachedProgressBarOffsetLeft = progressBar?.offsetLeft ?? 0;
      }
      if (!cachedProgressBarClientWidth || cachedProgressBarClientWidth === 1) {
        cachedProgressBarClientWidth = progressBar?.clientWidth ?? 1;
      }
      const newValue =
        Math.min(
          1,
          Math.max(
            0,
            (e.clientX - cachedProgressBarOffsetLeft) /
              cachedProgressBarClientWidth
          )
        ) * this.state.max;
      this.updateStateValue(newValue);

      this.dispatchEvent(
        new CustomEvent('progressValueChange', {
          detail: {
            value: newValue,
          },
        })
      );
    };

    progressBar?.addEventListener(
      'mousedown',
      (e) => {
        this._isDragging = true;
        updateVolumeFromEvent(/** @type {MouseEvent} */ (e));
      },
      { passive: true }
    );
    document?.addEventListener(
      'mousemove',
      (e) => {
        if (this._isDragging) {
          updateVolumeFromEvent(/** @type {MouseEvent} */ (e));
        }
      },
      { passive: true }
    );
    document?.addEventListener(
      'mouseup',
      (_e) => {
        this._isDragging = false;
      },
      { passive: true }
    );

    // Invalidate cached values because they have changed
    window.addEventListener('resize', () => {
      cachedProgressBarOffsetLeft = null;
      cachedProgressBarClientWidth = null;
    });

    // @ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(progressElement);
  }

  static get observedAttributes() {
    return ['max', 'value'];
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

  render() {
    const percentage = this.state.value / this.state.max;
    if (this.progressActive) {
      this.progressActive.style.width = `${percentage * 100}%`;
    }
    if (this.progressIndicator) {
      this.progressIndicator.style.left = `calc(${percentage * 100}% - 5px)`;
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
      }
    }
  }
}
customElements.define('controls-progress', ControlsProgress);
