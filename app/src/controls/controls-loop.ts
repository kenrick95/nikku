import { parseHTML } from './utils.js';

export class ControlsLoop extends HTMLElement {
  state: {
    /** Which icon is showing: ON (looping) or OFF (not looping) */
    mode: 'on' | 'off';
    /** whether value is changable or not */
    disabled: boolean;
  };
  button: HTMLButtonElement | undefined;
  iconLoop: SVGElement | undefined;
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.state = {
      mode: (this.getAttribute('mode') as 'on' | 'off') || 'on',
      disabled: this.getAttribute('disabled') != null,
    };
    this.button = undefined;
    this.init();
  }

  updateButtonClass() {
    if (!this.button) {
      return;
    }
    if (this.state.mode === 'on') {
      this.button.classList.add('on');
      this.button.classList.remove('off');
    } else {
      this.button.classList.remove('on');
      this.button.classList.add('off');
    }

    if (this.state.disabled) {
      this.button.classList.add('disabled');
    } else {
      this.button.classList.remove('disabled');
    }
  }

  async init() {
    let loopElement = (
      document.getElementById('template-loop') as HTMLTemplateElement
    ).content.cloneNode(true);

    this.iconLoop = parseHTML(
      await fetch('./assets/loop-icon.svg').then((res) => res.text())
    ) as SVGElement;
    this.button = document.createElement('button');
    this.button.classList.add('button');
    this.updateButtonClass();

    this.button.appendChild(this.iconLoop);
    loopElement.appendChild(this.button);

    //@ts-ignore
    this.shadowRoot.innerHTML = '';
    this.shadowRoot?.append(loopElement);

    this.button.addEventListener('click', () => {
      if (this.state.disabled) {
        return;
      }
      const newMode = this.state.mode === 'on' ? 'off' : 'on';
      this.dispatchEvent(
        new CustomEvent('loopClick', {
          detail: {
            mode: newMode,
          },
        })
      );
      this.setAttribute('mode', newMode);
    });
  }

  static get observedAttributes() {
    return ['mode', 'disabled'];
  }

  /**
   *
   * @param {string} name
   * @param {string} oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue != newValue) {
      if (name === 'mode') {
        this.state.mode = newValue as 'on' | 'off';
        this.updateButtonClass();
      } else if (name === 'disabled') {
        this.state.disabled = newValue != null;
        this.updateButtonClass();
      }
    }
  }
}
customElements.define('controls-loop', ControlsLoop);
