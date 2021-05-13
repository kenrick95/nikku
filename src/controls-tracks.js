//@ts-check
/**
 * Attributes
 * - "active" {string} comma-separated index of active tracks (0-based)
 * - "count" {string} number of tracks
 */
export class ControlsTracks extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const count = parseInt(this.getAttribute('count') || '0', 10) || 0;
    /**
     *
     * @type {{ active: { [trackNumber: number]: boolean }, count: number }}
     */
    this.state = {
      active: this.parseActiveAttribute(
        this.getAttribute('active') || '0',
        count
      ),
      count: count,
    };

    this.init();
  }

  /**
   *
   * @param {string} activeAttribute
   * @param {number} count
   * @returns {{ [trackNumber: number]: boolean }}
   */
  parseActiveAttribute(activeAttribute, count) {
    /** @type {{ [trackNumber: number]: boolean }} */
    const activeTracks = {};
    for (let i = 0; i < count; i++) {
      activeTracks[i] = false;
    }
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
    let trackElement = /** @type {DocumentFragment} */ (
      /** @type {HTMLTemplateElement} */ (
        document.getElementById('template-tracks')
      ).content.cloneNode(true)
    );

    // @ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(trackElement);

    this.renderList();
    this.render();
  }

  static get observedAttributes() {
    return ['active', 'count'];
  }

  /**
   * @param {number} newCount
   */
  updateStateCount(newCount) {
    this.state.count = newCount;
    this.renderList();
    this.render();
  }
  /**
   * @param {{ [trackNumber: number]: boolean }} newActive
   */
  updateStateActive(newActive) {
    this.state.active = newActive;
    this.render();
  }

  renderList() {
    const { count, active } = this.state;
    const elList = this.shadowRoot?.getElementById('list');
    if (elList) {
      for (let i = 0; i < count; i++) {
        const elLi = document.createElement('li');
        const elLabel = document.createElement('label');
        const elInput = document.createElement('input');
        elInput.type = 'checkbox';
        if (active[i]) {
          elInput.checked = true;
        }
        elInput.addEventListener('input', (e) => {
          // @ts-ignore
          const newChecked = e.target?.checked;
          this.updateStateActive({
            ...active,
            [i]: newChecked,
          });
        });

        elLabel.appendChild(elInput);
        elLabel.appendChild(document.createTextNode(` Track ${i + 1}`));
        elLi.appendChild(elLabel);
        elList.appendChild(elLi);
      }
    }
  }

  render() {
    const { count, active } = this.state;

    const elContainer = this.shadowRoot?.getElementById('container');
    if (elContainer) {
      if (count === 1) {
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

  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue != null && oldValue != newValue) {
      if (name === 'count') {
        this.updateStateCount(parseFloat(newValue));
      } else if (name === 'active') {
        this.updateStateActive(
          this.parseActiveAttribute(newValue, this.state.count)
        );
      }
    }
  }
}

customElements.define('controls-tracks', ControlsTracks);
