// @ts-check
// Cannot be in TypeScript yet
// See: https://github.com/vitejs/vite/discussions/3804

/**
 * Purpose:
 * - All-in-one source node
 *
 * Requirements:
 * - Buffer can be dynamically updated
 *   - Use case: Decode first block, then write here, and can be used for playing already! Afterwards, next blocks can be written and no need to disconnect/reconnect the node
 * - Support looping
 * - Support seeking to certain time
 */
class AudioSourceNode extends AudioWorkletProcessor {
  /**
   *
   * @param {AudioWorkletNodeOptions=} options
   */
  constructor(options) {
    super();
    /** @type {Float32Array[]} */
    this.initialSamples = options?.processorOptions?.initialSamples;
    /** @type {null | number} */
    this.subsequentSamplesOffset = null;
    /** @type {Float32Array[]} */
    this.subsequentSamples = [];

    this._bufferHead = 0;

    this.port.onmessage = (event) => {
      if (event.data.type === 'update-samples') {
        const samples = /** @type {Float32Array[]} */ (
          event.data.payload.samples
        );
        const offset = /** @type {number} */ (event.data.payload.offset);
        this.subsequentSamples = samples;
        this.subsequentSamplesOffset = offset;
      }
    };
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
    const offset = this._bufferHead;
    for (let c = 0; c < output.length; c++) {
      for (let s = 0; s < output[c].length; s++) {
        if (s + offset <= this.initialSamples[c].length) {
          output[c][s] = this.initialSamples[c][s + offset];
        } else if (
          this.subsequentSamplesOffset != null &&
          s + offset > this.subsequentSamplesOffset &&
          s + offset <=
            this.subsequentSamples[c].length + this.subsequentSamplesOffset
        ) {
          output[c][s] =
            this.subsequentSamples[c][
              s + offset - this.subsequentSamplesOffset
            ];
        } else {
          return false;
        }
      }
    }
    this._bufferHead += output[0].length;
    return true;
  }
}

registerProcessor('audio-source-processor', AudioSourceNode);
