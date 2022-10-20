import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import IconVolumeNormal from '../../assets/volume-icon.svg?raw';
import IconVolumeMuted from '../../assets/volume-icon-muted.svg?raw';

@customElement('controls-volume')
export class ControlsVolume extends LitElement {
  /** Whether value is changable or not */
  @property({ type: Boolean }) disabled: boolean = false;
  /** whether the volume is muted (true) or not (false) */
  @property({ type: Boolean }) muted: boolean = false;
  /** floating point number indicating silent (0.0) to loudest (1.0) */
  @property({ type: Number }) volume: number = 1;

  static styles = css`
    :root {
      margin: 0;
      padding: 0;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .volume-icon-container {
      width: 40px;
    }
    .volume-container {
      display: flex;
      align-items: center;
    }
    .volume-bar-container {
      height: 40px;
      margin-left: 8px;
      display: flex;
      align-items: center;
      user-select: none;
    }
    .volume-bar {
      position: relative;
      width: 100px;
      height: 10px;
    }
    .volume-background {
      position: absolute;
      top: 4px;
      width: 100%;
      height: 2px;
      border-radius: 1px;
      background-color: #e0e4e8;
    }
    .volume-fill {
      position: absolute;
      top: 4px;
      width: 100%;
      transform-origin: left;
      height: 2px;
      /* NOTE: Because of scaleX transform, this border-radius is also "scaled", need to find a way to have a fixed border-radius*/
      /* border-radius: 1px; */
      background-color: var(--primary);
    }
    .volume-indicator {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--primary);
    }
    .disabled {
      cursor: not-allowed;
    }
  `;

  #isDragging: boolean = false;
  _cachedVolumeBarOffsetLeft: number | null = null;
  _cachedVolumeBarClientWidth: number | null = null;
  volumeBarContainer: Ref<HTMLDivElement> = createRef();
  volumeFill: Ref<HTMLDivElement> = createRef();
  volumeIndicator: Ref<HTMLDivElement> = createRef();

  render() {
    return html`<div class="volume-container">
      <div class="volume-icon-container" @click=${this.#handleVolumeIconClick}>
        ${this.muted
          ? unsafeHTML(IconVolumeMuted)
          : unsafeHTML(IconVolumeNormal)}
      </div>
      <div
        class=${classMap({
          'volume-bar-container': true,
          disabled: this.disabled,
        })}
        ${ref(this.volumeBarContainer)}
      >
        <div class="volume-bar">
          <div class="volume-background"></div>
          <div class="volume-fill" ${ref(this.volumeFill)}></div>
          <div class="volume-indicator" ${ref(this.volumeIndicator)}></div>
        </div>
      </div>
    </div>`;
  }
  #handleVolumeIconClick() {
    const newMuted = !this.muted;
    this.muted = newMuted;
    this.dispatchEvent(
      new CustomEvent('mutedChange', {
        detail: {
          muted: newMuted,
        },
      })
    );
  }

  updateStyles() {
    if (this.volumeIndicator.value) {
      this.volumeIndicator.value.style.transform = this.muted
        ? ``
        : `translateX(calc(${
            this.volume * (this._cachedVolumeBarClientWidth ?? 0)
          }px - 50%))`;
    }

    if (this.volumeFill.value) {
      this.volumeFill.value.style.transform = this.muted
        ? `scaleX(0)`
        : `scaleX(${this.volume})`;
    }
  }

  refreshCachedValues() {
    if (!this._cachedVolumeBarOffsetLeft) {
      this._cachedVolumeBarOffsetLeft =
        this.volumeBarContainer.value?.offsetLeft ?? 0;
    }
    if (
      !this._cachedVolumeBarClientWidth ||
      this._cachedVolumeBarClientWidth === 1
    ) {
      this._cachedVolumeBarClientWidth =
        this.volumeBarContainer.value?.clientWidth ?? 1;
    }
    this.updateStyles();
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('muted') || changedProperties.has('volume')) {
      this.updateStyles();
    }
  }

  updateVolumeFromEvent = (e: MouseEvent | TouchEvent) => {
    this.refreshCachedValues();

    let x = 0;
    if (e instanceof MouseEvent) {
      x = e.clientX;
    } else if (e instanceof TouchEvent) {
      x = e.touches[0].clientX;
    }

    const newVolume = Math.min(
      1,
      Math.max(
        0,
        (x - (this._cachedVolumeBarOffsetLeft ?? 0)) /
          (this._cachedVolumeBarClientWidth ?? 1)
      )
    );
    this.volume = newVolume;
    this.dispatchEvent(
      new CustomEvent('volumeChange', {
        detail: {
          volume: newVolume,
        },
      })
    );
  };

  handleDraggingStart = (e: MouseEvent | TouchEvent) => {
    if (this.disabled || this.#isDragging) {
      return;
    }
    this.#isDragging = true;
    this.updateVolumeFromEvent(e);
  };

  handleDraggingMove = (e: MouseEvent | TouchEvent) => {
    if (this.disabled || !this.#isDragging) {
      return;
    }
    this.updateVolumeFromEvent(e);
  };
  handleDraggingEnd = (_e: MouseEvent | TouchEvent) => {
    if (this.disabled) {
      return;
    }
    this.#isDragging = false;
  };
  handleWindowResize = () => {
    // Invalidate cached values because they have changed
    this._cachedVolumeBarOffsetLeft = null;
    this._cachedVolumeBarClientWidth = null;
    this.refreshCachedValues();
  };

  firstUpdated() {
    this.#isDragging = false;

    this.volumeBarContainer.value?.addEventListener(
      'mousedown',
      this.handleDraggingStart,
      { passive: true }
    );
    document?.addEventListener('mousemove', this.handleDraggingMove, {
      passive: true,
    });
    document?.addEventListener('mouseup', this.handleDraggingEnd, {
      passive: true,
    });
    this.volumeBarContainer.value?.addEventListener(
      'touchstart',
      this.handleDraggingStart,
      { passive: true }
    );
    document?.addEventListener('touchmove', this.handleDraggingMove, {
      passive: true,
    });
    document?.addEventListener('touchend', this.handleDraggingEnd, {
      passive: true,
    });

    window.addEventListener('resize', this.handleWindowResize);

    this.refreshCachedValues();
  }

  disconnectedCallback(): void {
    this.volumeBarContainer.value?.removeEventListener(
      'mousedown',
      this.handleDraggingStart
    );
    document?.removeEventListener('mousemove', this.handleDraggingMove);
    document?.removeEventListener('mouseup', this.handleDraggingEnd);
    this.volumeBarContainer.value?.removeEventListener(
      'touchstart',
      this.handleDraggingStart
    );
    document?.removeEventListener('touchmove', this.handleDraggingMove);
    document?.removeEventListener('touchend', this.handleDraggingEnd);
    window.removeEventListener('resize', this.handleWindowResize);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'controls-volume': ControlsVolume;
  }
}
