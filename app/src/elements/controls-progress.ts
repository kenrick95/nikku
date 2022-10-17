import { html, css, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

@customElement('controls-progress')
export class ControlsProgress extends LitElement {
  /** Whether value is changable or not */
  @property({ type: Boolean }) disabled: boolean = false;
  /** Current time in seconds */
  @property({ type: Number }) value: number = 0;
  /** Max time in seconds */
  @property({ type: Number }) max: number = 0;

  static styles = css`
    .progress-bar-container {
      height: 15px;
    }
    .progress-bar {
      position: relative;
      height: 15px;
      user-select: none;
    }
    .progress-background {
      position: absolute;
      top: 5px;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background-color: #e0e4e8;
    }
    .progress-active {
      position: absolute;
      top: 5px;
      width: 100%;
      transform-origin: left;
      height: 4px;
      /* NOTE: Because of scaleX transform, this border-radius is also "scaled", need to find a way to have a fixed border-radius*/
      /* border-radius: 2px; */
      background-color: var(--primary);
    }
    .progress-indicator {
      position: absolute;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: var(--primary);
    }
    .disabled {
      cursor: not-allowed;
    }
  `;

  #isDragging: boolean = false;
  _cachedProgressBarOffsetLeft: number | null = null;
  _cachedProgressBarClientWidth: number | null = null;

  progressBar: Ref<HTMLDivElement> = createRef();
  progressActive: Ref<HTMLDivElement> = createRef();
  progressIndicator: Ref<HTMLDivElement> = createRef();

  get percentage() {
    return this.max <= 0 ? 0 : this.value / this.max;
  }

  render() {
    return html`
      <div class="progress-bar-container">
        <div
          class=${classMap({
            'progress-bar': true,
            disabled: this.disabled,
          })}
          ${ref(this.progressBar)}
        >
          <div class="progress-background"></div>
          <div class="progress-active" ${ref(this.progressActive)}></div>
          <div class="progress-indicator" ${ref(this.progressIndicator)}></div>
        </div>
      </div>
    `;
  }

  updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('value')) {
      this.updateStyles();
    }
  }

  updateStyles() {
    if (this.progressIndicator.value) {
      this.progressIndicator.value.style.transform = `translateX(calc(${
        this.percentage * (this._cachedProgressBarClientWidth ?? 0)
      }px - 50%))`;
    }

    if (this.progressActive.value) {
      this.progressActive.value.style.transform = `scaleX(${this.percentage})`;
    }
  }

  refreshCachedValues() {
    if (!this._cachedProgressBarOffsetLeft) {
      this._cachedProgressBarOffsetLeft =
        this.progressBar.value?.offsetLeft ?? 0;
    }
    if (
      !this._cachedProgressBarClientWidth ||
      this._cachedProgressBarClientWidth === 1
    ) {
      this._cachedProgressBarClientWidth =
        this.progressBar.value?.clientWidth ?? 1;
    }
    this.updateStyles();
  }

  updateProgressFromEvent = (e: MouseEvent | TouchEvent) => {
    this.refreshCachedValues();

    let x = 0;
    if (e instanceof MouseEvent) {
      x = e.clientX;
    } else if (e instanceof TouchEvent) {
      x = e.touches[0].clientX;
    }

    const newValue =
      Math.min(
        1,
        Math.max(
          0,
          (x - (this._cachedProgressBarOffsetLeft ?? 0)) /
            (this._cachedProgressBarClientWidth ?? 1)
        )
      ) * this.max;

    this.dispatchEvent(
      new CustomEvent('progressValueChange', {
        detail: {
          value: newValue,
        },
      })
    );
    this.value = newValue;
  };

  handleDraggingStart = (e: MouseEvent | TouchEvent) => {
    if (this.disabled || this.#isDragging) {
      return;
    }
    this.#isDragging = true;
    this.updateProgressFromEvent(e);
  };
  handleDraggingMove = (e: MouseEvent | TouchEvent) => {
    if (this.disabled || !this.#isDragging) {
      return;
    }
    this.updateProgressFromEvent(e);
  };
  handleDraggingEnd = (_e: MouseEvent | TouchEvent) => {
    if (this.disabled) {
      return;
    }
    this.#isDragging = false;
  };
  handleWindowResize = () => {
    // Invalidate cached values because they have changed
    this._cachedProgressBarOffsetLeft = null;
    this._cachedProgressBarClientWidth = null;
    this.refreshCachedValues();
  };

  firstUpdated() {
    this.progressBar.value?.addEventListener(
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
    this.progressBar.value?.addEventListener(
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
    this.progressBar.value?.removeEventListener(
      'mousedown',
      this.handleDraggingStart
    );
    document?.removeEventListener('mousemove', this.handleDraggingMove);
    document?.removeEventListener('mouseup', this.handleDraggingEnd);
    this.progressBar.value?.removeEventListener(
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
    'controls-progress': ControlsProgress;
  }
}
