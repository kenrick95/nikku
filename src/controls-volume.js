import { parseHTML } from './utils.js';

export class ControlsVolume extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    /**
     * - muted: whether the volume is muted (true) or not (false)
     * - volume: floating point number indicating silent (0.0) to loudest (1.0)
     * - disabled: whether value is changable or not
     * @type {{ muted: boolean; volume: number, disabled: boolean }}
     */
    this.state = {
      muted: this.getAttribute('muted') != null,
      volume: parseFloat(this.getAttribute('volume') || '1.0'),
      disabled: this.getAttribute('disabled') != null,
    };

    this._isDragging = false;
    /** @type {HTMLDivElement | undefined} */
    this.volumeContainer = undefined;
    /** @type {HTMLDivElement | undefined} */
    this.volumeIconContainer = undefined;

    /** @type {SVGElement | undefined} */
    this.iconVolumeNormal = undefined;
    /** @type {SVGElement | undefined} */
    this.iconVolumeMuted = undefined;

    /** @type {HTMLDivElement | undefined} */
    this.volumeFill = undefined;

    /** @type {HTMLDivElement | undefined} */
    this.volumeIndicator = undefined;

    // Cache the values because they cause page reflow
    /** @type {number | null} */
    this._cachedVolumeBarOffsetLeft = null;
    /** @type {number | null} */
    this._cachedVolumeBarClientWidth = null;

    this.init();
  }

  refreshCachedValues() {
    const volumeBarContainer = /** @type {HTMLDivElement} */ (
      this.shadowRoot?.querySelector('.volume-bar-container')
    );

    if (!this._cachedVolumeBarOffsetLeft) {
      this._cachedVolumeBarOffsetLeft = volumeBarContainer?.offsetLeft ?? 0;
    }
    if (
      !this._cachedVolumeBarClientWidth ||
      this._cachedVolumeBarClientWidth === 1
    ) {
      this._cachedVolumeBarClientWidth = volumeBarContainer?.clientWidth ?? 1;
    }
  }

  async init() {
    this._isDragging = false;
    let volumeElement = /** @type {DocumentFragment} */ (
      /** @type {HTMLTemplateElement} */ (
        document.getElementById('template-volume')
      ).content.cloneNode(true)
    );
    this.iconVolumeNormal = /** @type {SVGElement} */ (
      parseHTML(
        await fetch('./assets/volume-icon.svg').then((res) => res.text())
      )
    );
    this.iconVolumeMuted = /** @type {SVGElement} */ (
      parseHTML(
        await fetch('./assets/volume-icon-muted.svg').then((res) => res.text())
      )
    );
    this.volumeIconContainer = /** @type {HTMLDivElement} */ (
      volumeElement.querySelector('.volume-icon-container')
    );
    this.volumeContainer = /** @type {HTMLDivElement} */ (
      volumeElement.querySelector('.volume-container')
    );
    this.volumeIndicator = /** @type {HTMLDivElement} */ (
      volumeElement.querySelector('.volume-indicator')
    );
    this.volumeFill = /** @type {HTMLDivElement} */ (
      volumeElement.querySelector('.volume-fill')
    );
    const volumeBarContainer = /** @type {HTMLDivElement} */ (
      volumeElement.querySelector('.volume-bar-container')
    );

    if (this.state.muted) {
      this.volumeIconContainer.appendChild(this.iconVolumeMuted);
    } else {
      this.volumeIconContainer.appendChild(this.iconVolumeNormal);
    }

    this.volumeContainer?.prepend(this.volumeIconContainer);

    this.volumeIconContainer?.addEventListener('click', (e) => {
      const newMuted = !this.state.muted;
      this.updateStateMuted(newMuted);

      this.dispatchEvent(
        new CustomEvent('mutedChange', {
          detail: {
            muted: newMuted,
          },
        })
      );
    });

    /**
     *
     * @param {MouseEvent} e
     */
    const updateVolumeFromEvent = (e) => {
      this.refreshCachedValues();
      const newVolume = Math.min(
        1,
        Math.max(
          0,
          (e.clientX - (this._cachedVolumeBarOffsetLeft ?? 0)) /
            (this._cachedVolumeBarClientWidth ?? 1)
        )
      );
      this.updateStateVolume(newVolume);

      this.dispatchEvent(
        new CustomEvent('volumeChange', {
          detail: {
            volume: newVolume,
          },
        })
      );
    };

    volumeBarContainer?.addEventListener(
      'mousedown',
      (e) => {
        if (this.state.disabled) {
          return;
        }
        this._isDragging = true;
        updateVolumeFromEvent(/** @type {MouseEvent} */ (e));
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
          updateVolumeFromEvent(/** @type {MouseEvent} */ (e));
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
      this._cachedVolumeBarOffsetLeft = null;
      this._cachedVolumeBarClientWidth = null;
      this.refreshCachedValues();
    });

    // @ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(volumeElement);

    // Force reflow
    this.volumeContainer.clientWidth;
    this.refreshCachedValues();
    this.render();
  }

  static get observedAttributes() {
    return ['muted', 'volume', 'disabled'];
  }

  /**
   *
   * @param {boolean} newValue
   */
  updateStateMuted(newValue) {
    this.state.muted = newValue;
    if (this.volumeIconContainer) {
      const firstChild = this.volumeIconContainer.firstChild;
      if (
        newValue &&
        firstChild &&
        this.iconVolumeMuted &&
        firstChild !== this.iconVolumeMuted
      ) {
        this.volumeIconContainer.replaceChild(this.iconVolumeMuted, firstChild);
      } else if (
        !newValue &&
        firstChild &&
        this.iconVolumeNormal &&
        firstChild !== this.iconVolumeNormal
      ) {
        this.volumeIconContainer.replaceChild(
          this.iconVolumeNormal,
          firstChild
        );
      }
    }
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

  /**
   * @param {number} newValue
   */
  updateStateVolume(newValue) {
    this.state.volume = newValue;
    this.render();
  }

  render() {
    if (this.volumeFill) {
      if (this.state.muted) {
        this.volumeFill.style.transform = `scaleX(0)`;
      } else {
        this.volumeFill.style.transform = `scaleX(${this.state.volume})`;
      }
    }
    if (this.volumeIndicator) {
      if (this.state.muted) {
        this.volumeIndicator.style.transform = ``;
      } else {
        this.volumeIndicator.style.transform = `translateX(calc(${
          this.state.volume * (this._cachedVolumeBarClientWidth ?? 0)
        }px - 50%))`;
      }
    }

    const volumeBarContainer = /** @type {HTMLDivElement} */ (
      this.shadowRoot?.querySelector('.volume-bar-container')
    );
    if (volumeBarContainer) {
      if (this.state.disabled) {
        volumeBarContainer.classList.add('disabled');
      } else {
        volumeBarContainer.classList.remove('disabled');
      }
    }
  }

  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != newValue) {
      if (name === 'muted') {
        this.updateStateMuted(newValue != null);
      } else if (name === 'volume') {
        this.updateStateVolume(parseFloat(newValue));
      } else if (name === 'disabled') {
        this.updateStateDisabled(newValue != null);
      }
    }
  }
}
customElements.define('controls-volume', ControlsVolume);
