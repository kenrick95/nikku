/**
 * Basic Node.js-style "events"'s EventEmitter
 */
class EventEmitter {
  events: {
    [eventName: string]: Array<(...args: any[]) => void>;
  };
  constructor() {
    this.events = {};
  }
  on(eventName: string, callback: (...args: any[]) => void): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName: string, callback: (...args: any[]) => void) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = this.events[eventName].filter(
      (ev) => ev !== callback
    );
  }
  dispatch(eventName: string, ...args: any[]) {
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
export class Reactive<
  ReactiveValueType extends string | number | boolean | boolean[]
> extends EventEmitter {
  _value: ReactiveValueType;
  constructor(initialValue: ReactiveValueType) {
    super();
    this._value = initialValue;
  }
  get() {
    return this._value;
  }
  set(newValue: ReactiveValueType) {
    if (this._value != newValue) {
      this._value = newValue;

      this.dispatch('change', newValue);
    }
  }
}
