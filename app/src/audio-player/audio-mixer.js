// @ts-check
// Cannot be in TypeScript yet
// See: https://github.com/vitejs/vite/discussions/3804
/** @typedef {import('brstm').TrackDescription} TrackDescription */
/** @typedef {import('./audio-player').AudioPlayerTrackStates} AudioPlayerTrackStates */

class AudioMixerProcessor extends AudioWorkletProcessor {
  /**
   *
   * @param {AudioWorkletNodeOptions=} options
   */
  constructor(options) {
    super();
    /** @type {AudioPlayerTrackStates} */
    this.trackStates = options?.processorOptions?.trackStates || {};
    /** @type {TrackDescription[]} */
    this.trackDescriptions = options?.processorOptions?.trackDescriptions || [];
    this.port.onmessage = (event) => {
      if (event.data.trackStates) this.trackStates = event.data.trackStates;
      if (event.data.trackDescriptions)
        this.trackDescriptions = event.data.trackDescriptions;
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

    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
      let sums = [0, 0];

      for (
        let trackIndex = 0, channelIndex = 0;
        trackIndex < this.trackStates.length;
        trackIndex++
      ) {
        const trackChannelCount =
          this.trackDescriptions[trackIndex].numberChannels;
        if (this.trackStates[trackIndex]) {
          const finalOddTrackChannelCountIndex =
            trackChannelCount - (trackChannelCount % 2);

          // Distribute left-right for first (N - (N % 2))
          for (let tc = 0; tc < finalOddTrackChannelCountIndex; tc++) {
            sums[tc % 2] += input[channelIndex + tc][sampleIndex];
          }

          // Put the final odd track into both left and right output
          if (trackChannelCount % 2 === 1) {
            sums[0] +=
              input[channelIndex + finalOddTrackChannelCountIndex][sampleIndex];
            sums[1] +=
              input[channelIndex + finalOddTrackChannelCountIndex][sampleIndex];
          }
        }
        channelIndex += trackChannelCount;
      }

      output[0][sampleIndex] = clamp(sums[0], -1, 1);
      output[1][sampleIndex] = clamp(sums[1], -1, 1);
    }

    return true;
  }
}

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return value <= min ? min : value >= max ? max : value;
}

registerProcessor('audio-mixer-processor', AudioMixerProcessor);
