export class Timer {
  #shouldRender: boolean = false;
  #animationFrame: null | number = null;
  #renderCallback: undefined | (() => void) = undefined;

  constructor({ renderCallback }: { renderCallback?: () => void }) {
    this.#animationFrame = null;
    this.#renderCallback = renderCallback;
    this.render = this.render.bind(this);
  }
  start() {
    this.#shouldRender = true;
    this.#animationFrame = requestAnimationFrame(this.render);
  }
  stop() {
    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame);
    }
    this.#shouldRender = false;
  }
  render() {
    if (this.#renderCallback) {
      this.#renderCallback();
    }

    if (this.#shouldRender) {
      this.#animationFrame = requestAnimationFrame(this.render);
    }
  }
}
