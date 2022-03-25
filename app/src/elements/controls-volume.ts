import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
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
  @state()
  _cachedVolumeBarOffsetLeft: number | null = null;
  @state()
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
          <div
            class="volume-fill"
            style=${styleMap({
              transform: this.muted ? `scaleX(0)` : `scaleX(${this.volume})`,
            })}
            ${ref(this.volumeFill)}
          ></div>
          <div
            class="volume-indicator"
            style=${styleMap({
              transform: this.muted
                ? ``
                : `translateX(calc(${
                    this.volume * (this._cachedVolumeBarClientWidth ?? 0)
                  }px - 50%))`,
            })}
            ${ref(this.volumeIndicator)}
          ></div>
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
  }

  firstUpdated() {
    this.#isDragging = false;

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
      this.volume = newVolume;
      this.dispatchEvent(
        new CustomEvent('volumeChange', {
          detail: {
            volume: newVolume,
          },
        })
      );
    };

    this.volumeBarContainer.value?.addEventListener(
      'mousedown',
      (e) => {
        if (this.disabled) {
          return;
        }
        this.#isDragging = true;
        updateVolumeFromEvent(/** @type {MouseEvent} */ e);
      },
      { passive: true }
    );
    document?.addEventListener(
      'mousemove',
      (e) => {
        if (this.disabled) {
          return;
        }
        if (this.#isDragging) {
          updateVolumeFromEvent(/** @type {MouseEvent} */ e);
        }
      },
      { passive: true }
    );
    document?.addEventListener(
      'mouseup',
      (_e) => {
        if (this.disabled) {
          return;
        }
        this.#isDragging = false;
      },
      { passive: true }
    );

    // Invalidate cached values because they have changed
    window.addEventListener('resize', () => {
      this._cachedVolumeBarOffsetLeft = null;
      this._cachedVolumeBarClientWidth = null;
      this.refreshCachedValues();
    });

    this.refreshCachedValues();
    this.render();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'controls-volume': ControlsVolume;
  }
}
