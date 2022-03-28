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
    this.port.onmessage = (event) => {};
  }

  /**
   *
   * @param {Array<Array<Float32Array>>} inputs
   * @param {Array<Array<Float32Array>>} outputs
   * @param {Object} _parameters
   */
  process(inputs, outputs, _parameters) {
    return true;
  }
}

registerProcessor('audio-source-processor', AudioSourceNode);
