import { parseHTML } from './utils.js';

export class ControlsVolume extends HTMLElement {
  state: { muted: boolean; volume: number; disabled: boolean };
  _isDragging: boolean;
  volumeContainer: HTMLDivElement | undefined;
  volumeIconContainer: HTMLDivElement | undefined;
  iconVolumeNormal: SVGElement | undefined;
  iconVolumeMuted: SVGElement | undefined;
  volumeFill: HTMLDivElement | undefined;
  volumeIndicator: HTMLDivElement | undefined;
  _cachedVolumeBarOffsetLeft: number | null;
  _cachedVolumeBarClientWidth: number | null;
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
    this.volumeContainer = undefined;
    this.volumeIconContainer = undefined;
    this.iconVolumeNormal = undefined;
    this.iconVolumeMuted = undefined;
    this.volumeFill = undefined;
    this.volumeIndicator = undefined;

    // Cache the values because they cause page reflow
    this._cachedVolumeBarOffsetLeft = null;
    this._cachedVolumeBarClientWidth = null;

    this.init();
  }

  refreshCachedValues() {
    const volumeBarContainer = this.shadowRoot?.querySelector(
      '.volume-bar-container'
    ) as HTMLDivElement;

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
    let volumeElement = (
      document.getElementById('template-volume') as HTMLTemplateElement
    ).content.cloneNode(true) as DocumentFragment;
    this.iconVolumeNormal = parseHTML(
      await fetch('./assets/volume-icon.svg').then((res) => res.text())
    ) as SVGElement;
    this.iconVolumeMuted = parseHTML(
      await fetch('./assets/volume-icon-muted.svg').then((res) => res.text())
    ) as SVGElement;
    this.volumeIconContainer = volumeElement.querySelector(
      '.volume-icon-container'
    ) as HTMLDivElement;
    this.volumeContainer = volumeElement.querySelector(
      '.volume-container'
    ) as HTMLDivElement;
    this.volumeIndicator = volumeElement.querySelector(
      '.volume-indicator'
    ) as HTMLDivElement;
    this.volumeFill = volumeElement.querySelector(
      '.volume-fill'
    ) as HTMLDivElement;
    const volumeBarContainer = volumeElement.querySelector(
      '.volume-bar-container'
    ) as HTMLDivElement;

    if (this.state.muted) {
      this.volumeIconContainer.appendChild(this.iconVolumeMuted);
    } else {
      this.volumeIconContainer.appendChild(this.iconVolumeNormal);
    }

    this.volumeContainer?.prepend(this.volumeIconContainer);

    this.volumeIconContainer?.addEventListener('click', (_e: MouseEvent) => {
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

    const updateVolumeFromEvent = (e: MouseEvent) => {
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
  updateStateMuted(newValue: boolean) {
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
  updateStateDisabled(newValue: boolean) {
    this.state.disabled = newValue;
    this.render();
  }

  updateStateVolume(newValue: number) {
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

    const volumeBarContainer =
      /** @type {HTMLDivElement} */ this.shadowRoot?.querySelector(
        '.volume-bar-container'
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
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
