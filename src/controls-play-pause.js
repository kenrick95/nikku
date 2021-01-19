class ControlsPlayPause extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    /**
     * - icon: Which icon is showing: play icon or pause icon?
     * @type {{ icon: 'play' | 'pause' }}
     */
    this.state = {
      icon: this.getAttribute('status') || 'play',
    };
    this.init();
  }
  parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true).childNodes[0];
  }

  async init() {
    this.iconPlay = this.parseHTML(
      await (await fetch('../assets/play-icon.svg')).text()
    );
    this.iconPause = this.parseHTML(
      await (await fetch('../assets/pause-icon.svg')).text()
    );
    this.render();
  }

  static get observedAttributes() {
    return ['status'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Attributes changed.', name, oldValue, newValue);
  }

  get elementStyle() {
    return `
    .button {
        all: initial;
        width: 80px;
        height: 80px;
        border-radius: 40px;
    }
    svg {
        width: 100%;
        height: 100%;
    }
    .button:hover {
        background: var(--primary-lightest-1);
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.24);
    }`;
  }

  render() {
    const button = document.createElement('button');
    button.setAttribute('class', 'button');

    const icon = this.state.icon === 'play' ? this.iconPlay : this.iconPause;
    button.appendChild(icon);

    const style = document.createElement('style');
    style.textContent = this.elementStyle;

    this.shadowRoot.append(style, button);
  }
}
customElements.define('controls-play-pause', ControlsPlayPause);
