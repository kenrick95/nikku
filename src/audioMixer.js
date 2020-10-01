/**
 * @typedef {import("./audioPlayer.js").AudioPlayerStreamStates} AudioPlayerStreamStates
 */

class AudioMixerProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    /**
     * @type {AudioPlayerStreamStates}
     */
    this._streamStates = options.processorOptions.streamStates || {};
    this.port.onmessage = (event) => {
      if (event.data.streamStates) this.streamStates = event.data.streamStates;
    };
  }

  /**
   *
   * @param {Array<Array<Float32Array>>} inputs
   * @param {Array<Array<Float32Array>>} outputs
   * @param {Object} _parameters
   */
  process(inputs, outputs, _parameters) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input) {
      return false;
    }
    const channelCount = input.length;
    if (!channelCount) {
      return false;
    }
    const sampleCount = input[0].length;
    if (!sampleCount) {
      return false;
    }

    // let enabledChannelCount = 0;
    // for (let channelIndex = 0; channelIndex < channelCount; channelIndex++) {
    //   if (
    //     this._streamStates &&
    //     this._streamStates[Math.floor(channelIndex / 2)]
    //   ) {
    //     enabledChannelCount++;
    //   }
    // }
    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
      let sums = [0, 0];
      for (let channelIndex = 0; channelIndex < channelCount; channelIndex++) {
        if (
          this._streamStates &&
          this._streamStates[Math.floor(channelIndex / 2)]
        ) {
          sums[channelIndex % 2] +=
            input[Math.floor(channelIndex / 2)][sampleIndex];
        }
      }
      /**
       * NOTE: I initially thought I need to `sum[0] / enabledChannelCount`, but it makes the audio _really_ soft. 
       * clamp()-ing the sum makes each channel still audible, with minimum distortion (I guess :?)
       */
      output[0][sampleIndex] = clamp(sums[0], -1, 1);
      output[1][sampleIndex] = clamp(sums[1], -1, 1);
    }

    return true;
  }
}

function clamp(value, min, max) {
  return value <= min ? min : value >= max ? max : value;
}

registerProcessor('audio-mixer-processor', AudioMixerProcessor);
