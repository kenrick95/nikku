
/**
 * Attributes
 * - "active" {string} comma-separated index of active tracks (0-based)
 * - "count" {string} number of tracks
 * - "disabled" {string} if attribute is present, the UI is not interactable
 */
export class ControlsTracks extends HTMLElement {
  state: { active: boolean[]; count: number; disabled: boolean };
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const count = parseInt(this.getAttribute('count') || '0', 10) || 0;
    this.state = {
      active: this.parseActiveAttribute(
        this.getAttribute('active') || '0',
        count
      ),
      count: count,
      disabled: this.getAttribute('disabled') != null,
    };

    this.init();
  }

  /**
   *
   * @param {string} activeAttribute
   * @param {number} count
   * @returns {Array<boolean>}
   */
  parseActiveAttribute(activeAttribute: string, count: number): boolean[] {
    /** @type {Array<boolean>} */
    const activeTracks = new Array(count).fill(false);

    activeAttribute
      .split(',')
      .map((el) => {
        return parseInt(el.trim(), 10);
      })
      .forEach((trackIndex) => {
        if (activeTracks[trackIndex] != null) activeTracks[trackIndex] = true;
      });
    return activeTracks;
  }

  async init() {
    let trackElement = (
      document.getElementById('template-tracks') as HTMLTemplateElement
    ).content.cloneNode(true) as DocumentFragment;

    // @ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(trackElement);

    this.renderList();
    this.render();
  }

  static get observedAttributes() {
    return ['active', 'count', 'disabled'];
  }
  updateStateCount(newCount: number) {
    this.state.count = newCount;
    this.renderList();
    this.render();
  }
  updateStateActive(newActive: boolean[]) {
    this.state.active = [...newActive];
    this.render();
  }
  updateStateDisabled(newValue: boolean) {
    this.state.disabled = newValue;
    this.render();
  }

  renderList() {
    const { count, active } = this.state;
    const elList = this.shadowRoot?.getElementById('list');
    if (elList) {
      elList.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const elLi = document.createElement('li');
        const elLabel = document.createElement('label');
        const elInput = document.createElement('input');
        elInput.type = 'checkbox';
        if (active[i]) {
          elInput.checked = true;
        }
        elInput.addEventListener('input', (e) => {
          if (this.state.disabled) {
            return;
          }
          // @ts-ignore
          const newChecked = e.target?.checked;
          const newStateActive = [...this.state.active];
          newStateActive[i] = newChecked;
          this.updateStateActive(newStateActive);

          this.dispatchEvent(
            new CustomEvent('tracksActiveChange', {
              detail: {
                active: newStateActive,
              },
            })
          );
        });

        elLabel.appendChild(elInput);
        elLabel.appendChild(document.createTextNode(` Track ${i + 1}`));
        elLi.appendChild(elLabel);
        elList.appendChild(elLi);
      }
    }
  }

  render() {
    const { count, active, disabled } = this.state;

    const elContainer = this.shadowRoot?.getElementById('container');
    if (elContainer) {
      if (count === 1 || disabled) {
        elContainer.classList.add('hidden');
      } else {
        elContainer.classList.remove('hidden');
      }
    }
    const elInputs = this.shadowRoot?.querySelectorAll('input');
    if (elInputs) {
      elInputs.forEach((elInput, i) => {
        elInput.checked = active[i];
      });
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue != newValue) {
      if (name === 'count') {
        this.updateStateCount(parseFloat(newValue));
      } else if (name === 'active') {
        this.updateStateActive(
          this.parseActiveAttribute(newValue, this.state.count)
        );
      } else if (name === 'disabled') {
        this.updateStateDisabled(newValue != null);
      }
    }
  }
}

customElements.define('controls-tracks', ControlsTracks);
