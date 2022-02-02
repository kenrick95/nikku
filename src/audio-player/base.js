// @ts-check

/**
 * @typedef {import("../brstm/index.js").Metadata} Metadata
 */

/**
 * @typedef {Object} AudioPlayerHooks
 * @property {() => void} onPlay
 * @property {() => void} onPause
 */

/**
 * @class AudioPlayerBase
 */

export class AudioPlayerBase {
  /**
   * @param {Metadata} metadata
   * @param {AudioPlayerHooks} hooks
   */
  constructor(metadata, hooks) {
    /** @type {null | ((value?: any) => void)} */
    this._readyPromiseCallback = null;
    /** @type {Promise<void>} */
    this.readyPromise = new Promise((resolve) => {
      this._readyPromiseCallback = resolve;
    });
    this.hooks = hooks;
  }

  async destroy() {}

  /**
   * @param {number} playbackTimeInS
   */
  async seek(playbackTimeInS) {}

  /**
   *
   * @param {Array<Int16Array>} samples per-channel PCM samples
   */
  load(samples) {}
  
  async play() {}
  async pause() {}

  /**
   *
   * @param {Array<boolean>} newStates
   */
  async setTrackStates(newStates) {}

  /**
   * Set the gain node's value
   * @param {number} value 0..1
   */
  async setVolume(value) {}

  /**
   * @param {boolean} value
   */
  setLoop(value) {}

  /**
   * This timer does not rely on Web Audio API at all, might be less accurate, but more or less working
   * @returns {number} current time in seconds, accounted for looping
   */
  getCurrrentPlaybackTime() {
    return 0;
  }
}
