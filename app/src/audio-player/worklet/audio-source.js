// @ts-check
// Cannot be in TypeScript yet
// See: https://github.com/vitejs/vite/discussions/3804
/** @typedef {import('brstm').TrackDescription} TrackDescription */
/** @typedef {Array<boolean>} AudioPlayerTrackStates */
/**
 * @typedef {Object} AudioSourceNodeOptions
 * @property {number=} numberOfInputs
 * @property {number=} numberOfOutputs
 * @property {number=} outputChannelCount
 * @property {Record<string, number>=} parameterData
 * @property {any=} processorOptions
 */

/**
 * Purpose:
 * - All-in-one source node
 *
 * Features:
 * - Buffer can be dynamically updated
 *   - Use case: Decode first block, then write here, 
 *     and can be used for playing already!
 *     Afterwards, next blocks can be written and
 *     no need to disconnect/reconnect nodes
 * - Support buffer looping.
 *   - NOTE: currently loop end = buffer end,
 *     but support can be added for custom loop end in the future
 * - Support seeking to certain time
 * - Query accurate playback timestamp
 */
class AudioSourceNode extends AudioWorkletProcessor {
  /**
   *
   * @param {AudioSourceNodeOptions=} options
   */
  constructor(options) {
    super();
    /** @type {Float32Array[][]} segments of multi-channel samples */
    this.samples = [options?.processorOptions?.initialSamples];
    /** @type {Array<number>} list of offsets, each for each segment in this.samples */
    this.samplesOffsets = [0];

    /** @type {AudioPlayerTrackStates} */
    this.trackStates = options?.processorOptions?.trackStates || {};
    /** @type {TrackDescription[]} */
    this.trackDescriptions = options?.processorOptions?.trackDescriptions || [];
    /** @type {boolean} */
    this.shouldLoop = options?.processorOptions?.shouldLoop || true;

    /** @type {number} */
    this.totalSamples = options?.processorOptions?.totalSamples || 0;
    /** @type {number} */
    this.sampleRate = options?.processorOptions?.sampleRate || 44100;
    /** @type {number} */
    this.loopStartSample = options?.processorOptions?.loopStartSample || 0;

    /** @type {number} */
    this._bufferHead = 0;

    this.port.onmessage = (event) => {
      switch (event.data.type) {
        case 'ADD_SAMPLES': {
          const samples = /** @type {Float32Array[]} */ (
            event.data.payload.samples
          );
          const offset = /** @type {number} */ (event.data.payload.offset);

          this.samples.push(samples);
          this.samplesOffsets.push(offset);
          console.log('[AudioSourceNode] ADD_SAMPLES', samples.length, offset);
          break;
        }
        case 'UPDATE_TRACK_STATES': {
          this.trackStates = /** @type {AudioPlayerTrackStates} */ (
            event.data.payload.trackStates
          );
          console.log(
            '[AudioSourceNode] UPDATE_TRACK_STATES',
            this.trackStates
          );
          break;
        }
        case 'SEEK': {
          const playbackTimeInS = /** @type {number} */ (
            event.data.payload.playbackTimeInS
          );
          this._bufferHead = Math.floor(playbackTimeInS * this.sampleRate);
          console.log('[AudioSourceNode] SEEK', playbackTimeInS);
          break;
        }
        case 'UPDATE_SHOULD_LOOP': {
          this.shouldLoop = /** @type {boolean} */ (
            event.data.payload.shouldLoop
          );
          console.log('[AudioSourceNode] UPDATE_SHOULD_LOOP', this.shouldLoop);
          break;
        }
        case 'TIMESTAMP_QUERY': {
          this.port.postMessage({
            type: 'TIMESTAMP_REPLY',
            payload: {
              timestamp: this._bufferHead / this.sampleRate,
            },
          });
          break;
        }
      }
    };
  }

  /**
   *
   * @param {number} s sample index
   * @returns {number} segment index
   */
  getSegmentIndex(s) {
    // https://en.wikipedia.org/wiki/Binary_search_algorithm#Alternative_procedure
    let l = 0,
      r = this.samplesOffsets.length - 1;
    while (l !== r) {
      let mid = Math.ceil((l + r) / 2);
      if (this.samplesOffsets[mid] > s) {
        r = mid - 1;
      } else {
        l = mid;
      }
    }
    return l;
  }

  /**
   *
   * @param {Array<Array<Float32Array>>} _inputs
   * @param {Array<Array<Float32Array>>} outputs
   * @param {Object} _parameters
   * @returns {boolean}
   */
  process(_inputs, outputs, _parameters) {
    const output = outputs[0];
    if (!output || !output.length || !output[0].length) {
      return false;
    }
    let absoluteSampleIndex = this._bufferHead;

    for (let s = 0; s < output[0].length; s++) {
      if (absoluteSampleIndex >= this.totalSamples) {
        // We've reached the end, just output 0
        output[0][s] = 0;
        output[1][s] = 0;
        continue;
      }
      // Our samples are distributed in segments
      const i = this.getSegmentIndex(absoluteSampleIndex);

      const segmentOffset = this.samplesOffsets[i];
      const segment = this.samples[i];
      const segmentSampleIndex = absoluteSampleIndex - segmentOffset;

      // Mixing tracks, basically summing all active tracks together
      let sums = [0, 0];
      for (
        let trackIndex = 0, channelIndex = 0;
        trackIndex < this.trackStates.length;
        trackIndex++
      ) {
        // Not all tracks have 2 channels, must read from track descriptions
        const trackChannelCount =
          this.trackDescriptions[trackIndex].numberChannels;

        if (this.trackStates[trackIndex]) {
          const finalOddTrackChannelCountIndex =
            trackChannelCount - (trackChannelCount % 2);

          // Distribute left-right for first (N - (N % 2))
          for (let tc = 0; tc < finalOddTrackChannelCountIndex; tc++) {
            sums[tc % 2] += segment[channelIndex + tc][segmentSampleIndex];
          }

          // Put the final odd track into both left and right output
          if (trackChannelCount % 2 === 1) {
            sums[0] +=
              segment[channelIndex + finalOddTrackChannelCountIndex][
                segmentSampleIndex
              ];
            sums[1] +=
              segment[channelIndex + finalOddTrackChannelCountIndex][
                segmentSampleIndex
              ];
          }
        }
        channelIndex += trackChannelCount;
      }

      output[0][s] = clamp(sums[0], -1, 1);
      output[1][s] = clamp(sums[1], -1, 1);

      absoluteSampleIndex += 1;
      if (absoluteSampleIndex >= this.totalSamples) {
        if (this.shouldLoop) {
          absoluteSampleIndex = this.loopStartSample;
          this.port.postMessage({
            type: 'BUFFER_LOOPED',
          });
        } else {
          this.port.postMessage({
            type: 'BUFFER_ENDED',
          });
        }
      }
    }

    this._bufferHead = absoluteSampleIndex;
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

registerProcessor('audio-source-processor', AudioSourceNode);
