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
    /** @type {SVGElement | undefined} */
    this.iconVolume = undefined;

    /** @type {HTMLDivElement | undefined} */
    this.volumeFill = undefined;

    /** @type {HTMLDivElement | undefined} */
    this.volumeIndicator = undefined;

    this.init();
  }

  async init() {
    this._isDragging = false;
    let volumeElement = /** @type {DocumentFragment} */ (
      /** @type {HTMLTemplateElement} */ (
        document.getElementById('template-volume')
      ).content.cloneNode(true)
    );
    this.iconVolume = /** @type {SVGElement} */ (
      parseHTML(
        await fetch('../assets/volume-icon.svg').then((res) => res.text())
      )
    );
    this.iconVolume?.classList.add('volume-icon');
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

    this.volumeContainer?.prepend(/** @type {SVGElement} */ (this.iconVolume));

    // Cache the values because they cause page reflow
    /** @type {number | null} */
    let cachedVolumeBarOffsetLeft = null;
    /** @type {number | null} */
    let cachedVolumeBarClientWidth = null;

    /**
     *
     * @param {MouseEvent} e
     */
    const updateVolumeFromEvent = (e) => {
      if (!cachedVolumeBarOffsetLeft) {
        cachedVolumeBarOffsetLeft = volumeBarContainer?.offsetLeft ?? 0;
      }
      if (!cachedVolumeBarClientWidth || cachedVolumeBarClientWidth === 1) {
        cachedVolumeBarClientWidth = volumeBarContainer?.clientWidth ?? 1;
      }
      const newVolume = Math.min(
        1,
        Math.max(
          0,
          (e.clientX - cachedVolumeBarOffsetLeft) / cachedVolumeBarClientWidth
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
      cachedVolumeBarOffsetLeft = null;
      cachedVolumeBarClientWidth = null;
    });

    // @ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(volumeElement);

    // Force reflow
    this.volumeContainer.clientWidth;
    this.render();
  }

  static get observedAttributes() {
    return ['muted', 'volume', 'disabled'];
  }

  /**
   *
   * @param {boolean} newValue
   */
  updateStateMode(newValue) {
    this.state.muted = newValue;
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
    // TODO: Use transform translateX
    if (this.volumeFill) {
      this.volumeFill.style.width = `${this.state.volume * 100}%`;
    }
    if (this.volumeIndicator) {
      this.volumeIndicator.style.left = `calc(${
        this.state.volume * 100
      }% - 5px)`;
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
        this.updateStateMode(newValue != null);
      } else if (name === 'volume') {
        this.updateStateVolume(parseFloat(newValue));
      } else if (name === 'disabled') {
        this.updateStateDisabled(newValue != null);
      }
    }
  }
}
customElements.define('controls-volume', ControlsVolume);
