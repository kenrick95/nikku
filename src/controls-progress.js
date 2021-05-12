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

    // Cache the values because they cause page reflow
    /** @type {number | null} */
    this._cachedProgressBarOffsetLeft = null;
    /** @type {number | null} */
    this._cachedProgressBarClientWidth = null;

    this.init();
  }

  refreshCachedValues() {
    const progressBar = /** @type {HTMLDivElement} */ (
      this.shadowRoot?.querySelector('.progress-bar')
    );

    if (!this._cachedProgressBarOffsetLeft) {
      this._cachedProgressBarOffsetLeft = progressBar?.offsetLeft ?? 0;
    }
    if (
      !this._cachedProgressBarClientWidth ||
      this._cachedProgressBarClientWidth === 1
    ) {
      this._cachedProgressBarClientWidth = progressBar?.clientWidth ?? 1;
    }
  }

  async init() {
    let progressElement = /** @type {DocumentFragment} */ (
      /** @type {HTMLTemplateElement} */ (
        document.getElementById('template-progress')
      ).content.cloneNode(true)
    );

    this.progressActive = /** @type {HTMLDivElement} */ (
      progressElement.querySelector('.progress-active')
    );
    this.progressIndicator = /** @type {HTMLDivElement} */ (
      progressElement.querySelector('.progress-indicator')
    );
    const progressBar = /** @type {HTMLDivElement} */ (
      progressElement.querySelector('.progress-bar')
    );

    /**
     *
     * @param {MouseEvent} e
     */
    const updateVolumeFromEvent = (e) => {
      this.refreshCachedValues();

      const newValue =
        Math.min(
          1,
          Math.max(
            0,
            (e.clientX - (this._cachedProgressBarOffsetLeft ?? 0)) /
              (this._cachedProgressBarClientWidth ?? 1)
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
      this._cachedProgressBarOffsetLeft = null;
      this._cachedProgressBarClientWidth = null;
      this.refreshCachedValues();
    });

    // @ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(progressElement);

    this.refreshCachedValues();
    this.render();
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
      this.progressActive.style.transform = `scaleX(${
        percentage 
      })`;
    }
    if (this.progressIndicator) {
      this.progressIndicator.style.transform = `translateX(calc(${
        percentage * (this._cachedProgressBarClientWidth ?? 0)
      }px - 50%))`;
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
