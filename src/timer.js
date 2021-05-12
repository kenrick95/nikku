export class Timer {
  /**
   *
   * @param {Object} opts
   * @param {() => void} opts.renderCallback
   */
  constructor({ renderCallback }) {
    this.shouldRender = false;
    this._animationFrame = null;
    this.renderCallback = renderCallback;
    this.render = this.render.bind(this);
  }
  start() {
    this.shouldRender = true;
    this._animationFrame = requestAnimationFrame(this.render);
  }
  stop() {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }
    this.shouldRender = false;
  }
  render() {
    if (this.renderCallback) {
      this.renderCallback();
    }

    if (this.shouldRender) {
      this._animationFrame = requestAnimationFrame(this.render);
    }
  }
}
