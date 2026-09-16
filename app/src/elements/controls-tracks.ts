import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

@customElement('controls-tracks')
export class ControlsTracks extends LitElement {
  /** JSON-Array of active tracks */
  @property({ type: Array }) active: Array<boolean> = [];
  /** number of tracks */
  @property({ type: Number }) count: number = 0;
  /** Whether or not UI is interactable */
  @property({ type: Boolean }) disabled: boolean = false;

  static styles = css`
    .hidden {
      display: none;
    }
    #list {
      list-style: none;
      padding-left: 0;
      margin-top: 6px;
      user-select: none;
    }
    label {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-height: 28px;
      cursor: pointer;
    }
    input:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
    input[type='checkbox'] {
      appearance: none;
      position: relative;
      background: var(--primary-lightest-2);
      border-radius: 2px;
      padding: 2px;
      margin: 0;

      width: 15px;
      height: 15px;
      display: inline-block;
      vertical-align: middle;
      top: -1px;
    }
    input[type='checkbox']:checked:after {
      content: '✔';
      position: absolute;
      left: 2px;
      top: 0;
      font-size: 12px;
      line-height: 13px;
      color: var(--primary-darker);
    }
  `;

  render() {
    return html`
      <div
        id="container"
        role="group"
        aria-label="Active audio tracks"
        class=${classMap({
          hidden: this.count === 1 || this.disabled,
        })}
      >
        Active tracks:
        <ol id="list">
          ${Array(this.count)
            .fill(0)
            .map((_, i) => {
              return html`<li>
                <label>
                  <input
                    type="checkbox"
                    .checked=${this.active[i]}
                    ?disabled=${this.disabled}
                    @input=${(e: InputEvent) => {
                      const newChecked = (e.target as HTMLInputElement).checked;
                      const newStateActive = [...this.active];
                      newStateActive[i] = newChecked;
                      this.active = newStateActive;
                      this.dispatchEvent(
                        new CustomEvent('tracksActiveChange', {
                          detail: {
                            active: newStateActive,
                          },
                        })
                      );
                    }}
                  />
                  Track ${i + 1}
                </label>
              </li>`;
            })}
        </ol>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'controls-tracks': ControlsTracks;
  }
}
