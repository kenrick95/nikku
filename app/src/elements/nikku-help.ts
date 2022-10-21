import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';

@customElement('nikku-help')
export class NikkuHelp extends LitElement {
  @state()
  private dialogOpen: boolean = false;

  dialog: Ref<HTMLDialogElement> = createRef();

  isDialogSupported = !!self.HTMLDialogElement;

  explanations = [
    `BRSTM is a file format that contains audio data that's being used for some Nintendo consoles. One of the differences with the usual audio format (MP3, etc) is that this format can contain a loop point, making it suitable for usage in games.`,
    `BRSTM file is not included in the repository.`,
  ];

  #openDialog() {
    this.dialog.value?.showModal();
  }

  #closeDialog() {
    this.dialog.value?.close();
  }

  render() {
    if (!this.isDialogSupported) {
      return html`<span id="help" title=${this.explanations.join('\n')}
        ><slot></slot>
      </span>`;
    }

    return html`
      <span
        id="help"
        @click=${this.#openDialog}
        title="Click to open explanation"
        ><slot></slot
      ></span>
      <dialog
        id="brstm-explanation"
        ?open=${this.dialogOpen}
        ${ref(this.dialog)}
      >
        ${this.explanations.map((exp) => html`<p>${exp}</p>`)}

        <button @click=${this.#closeDialog}>OK</button>
      </dialog>
    `;
  }

  static styles = css`
    #brstm-explanation {
      max-width: var(--max-width);
      background-color: var(--main-bg-color);
      color: var(--main-text-color);

      border: none;
      border-radius: 5px;
    }
    #brstm-explanation::backdrop {
      background-color: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(5px);
    }
    #help {
      text-decoration: underline;
    }
    #help:hover {
      cursor: help;
    }
    button {
      box-sizing: border-box;
      border-radius: 5px;
      color: var(--primary);
      background-color: var(--primary-lightest-2);
      outline-color: currentColor;

      min-width: 4rem;
      min-height: 1.6rem;
      border: none;
      border-radius: 5px;
      outline-style: solid;
    }
    button:hover {
      background-color: var(--primary-lightest-1);
    }

    @media (prefers-color-scheme: dark) {
      #brstm-explanation::backdrop {
        background-color: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(5px);
      }
      button {
        color: var(--main-text-color);
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'nikku-help': NikkuHelp;
  }
}
