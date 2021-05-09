/**
 * Basic Node.js-style "events"'s EventEmitter
 */
class EventEmitter {
  constructor() {
    /**
     * @type {{ [eventName: string]: Array<(...args: any[]) => void> }}
     */
    this.events = {};
  }
  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  /**
   *
   * @param {string} eventName
   * @param {(...args: any[]) => void} callback
   */
  off(eventName, callback) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = this.events[eventName].filter(
      (ev) => ev !== callback
    );
  }
  /**
   *
   * @param {string} eventName
   * @param {any[]} args
   */
  dispatch(eventName, ...args) {
    if (!this.events[eventName]) {
      return;
    }

    for (const ev of this.events[eventName]) {
      ev.apply(this, args);
    }
  }
}

/**
 * @template ReactiveValueType
 *
 * @example
 * ```
 * let something = new Reactive(42);
 * something.on('change', (newValue) => console.log('change', newValue));
 * console.log(something.get()); // "42"
 * something.set(100);
 * // "change 100"
 *
 * ```
 */
export class Reactive extends EventEmitter {
  /**
   * @param {ReactiveValueType} initialValue
   */
  constructor(initialValue) {
    super();
    this._value = initialValue;
  }
  get() {
    return this._value;
  }
  /**
   *
   * @param {ReactiveValueType} newValue
   */
  set(newValue) {
    if (this._value != newValue) {
      this._value = newValue;

      this.dispatch('change', newValue);
    }
  }
}
