
export class ControlsProgress extends HTMLElement {
  state: {
    value: number;
    max: number;
    /** whether value is changable or not */
    disabled: boolean;
  };
  _isDragging: boolean;
  progressActive: HTMLDivElement | undefined;
  progressIndicator: HTMLDivElement | undefined;
  _cachedProgressBarOffsetLeft: number | null;
  _cachedProgressBarClientWidth: number | null;
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = {
      value: parseInt(this.getAttribute('value') || '0', 10) || 0,
      max: parseInt(this.getAttribute('max') || '0', 10) || 0,
      disabled: this.getAttribute('disabled') != null,
    };
    this._isDragging = false;

    this.progressActive = undefined;
    this.progressIndicator = undefined;

    // Cache the values because they cause page reflow
    this._cachedProgressBarOffsetLeft = null;
    this._cachedProgressBarClientWidth = null;

    this.init();
  }

  refreshCachedValues() {
    const progressBar = this.shadowRoot?.querySelector(
      '.progress-bar'
    ) as HTMLDivElement;

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
    let progressElement = (
      document.getElementById('template-progress') as HTMLTemplateElement
    ).content.cloneNode(true) as DocumentFragment;

    this.progressActive = progressElement.querySelector(
      '.progress-active'
    ) as HTMLDivElement;
    this.progressIndicator = progressElement.querySelector(
      '.progress-indicator'
    ) as HTMLDivElement;
    const progressBar = progressElement.querySelector(
      '.progress-bar'
    ) as HTMLDivElement;

    const updateVolumeFromEvent = (e: MouseEvent) => {
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
        if (this.state.disabled) {
          return;
        }
        this._isDragging = true;
        updateVolumeFromEvent(/** @type {MouseEvent} */ e);
      },
      { passive: true }
    );
    document?.addEventListener(
      'mousemove',
      (e) => {
        if (this.state.disabled) {
          return;
        }
        if (this._isDragging) {
          updateVolumeFromEvent(/** @type {MouseEvent} */ e);
        }
      },
      { passive: true }
    );
    document?.addEventListener(
      'mouseup',
      (_e) => {
        if (this.state.disabled) {
          return;
        }
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
    return ['max', 'value', 'disabled'];
  }

  updateStateMax(newMax: number) {
    this.state.max = newMax;
    this.render();
  }
  updateStateValue(newValue: number) {
    this.state.value = newValue;
    this.render();
  }
  updateStateDisabled(newValue: boolean) {
    this.state.disabled = newValue;
    this.render();
  }

  render() {
    const percentage = this.state.value / this.state.max;
    if (this.progressActive) {
      this.progressActive.style.transform = `scaleX(${percentage})`;
    }
    if (this.progressIndicator) {
      this.progressIndicator.style.transform = `translateX(calc(${
        percentage * (this._cachedProgressBarClientWidth ?? 0)
      }px - 50%))`;
    }

    const progressBar =
      /** @type {HTMLDivElement} */ this.shadowRoot?.querySelector(
        '.progress-bar'
      );
    if (progressBar) {
      if (this.state.disabled) {
        progressBar.classList.add('disabled');
      } else {
        progressBar.classList.remove('disabled');
      }
    }
  }

  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue != newValue) {
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
customElements.define('controls-progress', ControlsProgress);
