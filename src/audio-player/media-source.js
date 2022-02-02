// @ts-check
import { AudioPlayerBase } from './base.js';
import { convertToAudioBufferData } from './utils.js';

/** @typedef {import("../brstm/index.js").Metadata} Metadata */
/** @typedef {import("./base.js").AudioPlayerHooks} AudioPlayerHooks */

/**
 * @implements {AudioPlayerBase}
 */
export class AudioPlayerMediaSource extends AudioPlayerBase {
  /**
   * @param {Metadata} metadata
   * @param {AudioPlayerHooks} hooks
   */
  constructor(metadata, hooks) {
    super(metadata, hooks);
    this._audioEncoder = null;
    this.init(metadata);
  }

  /**
   *
   * @param {Metadata} metadata
   */
  init(metadata) {
    if (metadata) {
      this.metadata = metadata;

      // @ts-ignore
      WasmMediaEncoder.createOggEncoder().then((encoder) => {
        encoder.configure({
          sampleRate: metadata.sampleRate,
          channels: metadata.numberChannels,
        });
        this._audioEncoder = encoder;

        if (this._readyPromiseCallback) this._readyPromiseCallback();
      });

      this.audioElement = document.createElement('audio');
      this.mediaSource = new MediaSource();
      const mediaSource = this.mediaSource;
      this.audioElement.src = URL.createObjectURL(mediaSource);
      const mimeCodec = 'audio/webm;codecs:pcm';
      mediaSource.addEventListener('sourceopen', () => {
        this.sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
      });
    } else {
      this.metadata = null;
      this.mediaSource = null;
    }
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
  load(samples) {
    const floatSamples = samples.map(convertToAudioBufferData);
    if (this._audioEncoder) {
      const meow = /** @type {Uint8Array} */ (
        this._audioEncoder.encode(floatSamples).slice()
      );
      const finalized = this._audioEncoder.finalize(floatSamples).slice();

      const { sourceBuffer } = this;
      if (sourceBuffer) {
        sourceBuffer.appendBuffer(meow);
      }
    }
  }

  async play() {
    if (this.audioElement) {
      this.audioElement.play();
    }
  }
  async pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

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
