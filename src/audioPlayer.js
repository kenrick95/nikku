export class AudioPlayer {
  constructor(metadata) {
    this.metadata = metadata;

    this.audioContext = new AudioContext({
      sampleRate: metadata.sampleRate
    });
    this.bufferSource = this.audioContext.createBufferSource();

    /**
     * @private
     * @member {Array<Float32Array>} _floatSamples per-channel audio buffer data
     */
    this._floatSamples = [];
  }

  /**
   * Interpotale [-32768..32767] (Int16) to [-1..1] (Float32)
   * @returns {Float32Array} audio buffer's channel data
   * @param {Int16Array} pcmSamples
   */
  convertToAudioBufferData(pcmSamples) {
    // https://stackoverflow.com/a/17888298/917957
    const floats = new Float32Array(pcmSamples.length);
    pcmSamples.forEach(function(sample, i) {
      floats[i] = sample < 0 ? sample / 0x8000 : sample / 0x7fff;
    });
    return floats;
  }

  /**
   *
   * @param {Array<Int16Array>} samples per-channel PCM samples
   */
  async load(samples) {
    this._floatSamples = samples.map((sample) => {
      return this.convertToAudioBufferData(sample);
    });
    this.initPlayback();
  }

  initPlayback() {
    const { numberChannels, loopStartSample, totalSamples, sampleRate } = this.metadata;
    const audioBuffer = this.audioContext.createBuffer(
      numberChannels,
      numberChannels * this._floatSamples[0].length,
      this.audioContext.sampleRate
    );
    for (let c = 0; c < numberChannels; c++) {
      audioBuffer.getChannelData(c).set(this._floatSamples[c]);
    }

    this.bufferSource.buffer = audioBuffer;
    this.bufferSource.connect(this.audioContext.destination);
    this.bufferSource.start(0);

    this.bufferSource.loopStart = loopStartSample / sampleRate;
    this.bufferSource.loopEnd = totalSamples / sampleRate;

  }

  async play() {
    await this.audioContext.resume();
  }
  async pause() {
    await this.audioContext.suspend();
  }

  setLoop(value) {
    if (value) {
      this.bufferSource.loop = true;
    } else {
      this.bufferSource.loop = false;
    }
  }
}
