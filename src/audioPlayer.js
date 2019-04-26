export class AudioPlayer {
  constructor(metadata) {
    this.metadata = metadata;

    this.audioContext = new AudioContext({
      sampleRate: metadata.sampleRate
    });
    this.bufferSource = this.audioContext.createBufferSource();
    this._loopStartInS = null;
    this._loopEndInS = null;
    this._loopDurationInS = null;
    this._currentTime = 0;
    this._prevRawCurrentTime = 0;
    this._shouldLoop = true;
    this._initNeeded = true;

    /**
     * @private
     * @member {Array<Float32Array>} _floatSamples per-channel audio buffer data
     */
    this._floatSamples = [];
  }

  async destroy() {
    await this.pause();
    this.metadata = null;
    this.audioContext = null;
    this.bufferSource = null;
    this._floatSamples = [];
    this._initNeeded = true;
  }

  /**
   * Interpotale [-32768..32767] (Int16) to [-1..1] (Float32)
   * @returns {Float32Array} audio buffer's channel data
   * @param {Int16Array} pcmSamples
   */
  convertToAudioBufferData(pcmSamples) {
    // https://stackoverflow.com/a/17888298/917957
    const floats = new Float32Array(pcmSamples.length);
    for (let i = 0; i < pcmSamples.length; i++) {
      const sample = pcmSamples[i];
      floats[i] = sample < 0 ? sample / 0x8000 : sample / 0x7fff;
    }
    return floats;
  }

  /**
   *
   * @param {Array<Int16Array>} samples per-channel PCM samples
   */
  async load(samples) {
    // console.log('samples', samples);
    this._floatSamples = samples.map((sample) => {
      return this.convertToAudioBufferData(sample);
    });
    this.initPlayback();
  }

  initPlayback() {
    const {
      numberChannels,
      loopStartSample,
      totalSamples,
      sampleRate
    } = this.metadata;
    const audioBuffer = this.audioContext.createBuffer(
      numberChannels,
      this._floatSamples[0].length,
      this.audioContext.sampleRate
    );
    for (let c = 0; c < numberChannels; c++) {
      audioBuffer.getChannelData(c).set(this._floatSamples[c]);
    }

    this.bufferSource.buffer = audioBuffer;
    this.bufferSource.connect(this.audioContext.destination);

    this._loopStartInS = loopStartSample / sampleRate;
    this._loopEndInS = totalSamples / sampleRate;
    this._loopDurationInS = this._loopEndInS - this._loopStartInS;

    this.bufferSource.loopStart = this._loopStartInS;
    this.bufferSource.loopEnd = this._loopEndInS;
    this.bufferSource.loop = this._shouldLoop;
    this.bufferSource.onended = () => {
      this.pause();
      this._initNeeded = true;
    }
    this.bufferSource.start(0);
    this._currentTime = 0;
    this._initNeeded = false;

    // console.log('this.audioContext', this.audioContext, this.bufferSource);
  }

  async play() {
    if (this._initNeeded) {
      this.initPlayback();
      return;
    }
    await this.audioContext.resume();
  }
  async pause() {
    await this.audioContext.suspend();
  }

  setLoop(value) {
    if (value) {
      this.bufferSource.loop = this._shouldLoop = true;
    } else {
      this.bufferSource.loop = this._shouldLoop = false;
    }
  }

  /**
   * This is kinda a hack, and `currentTime` isn't that accurate anyway
   * TODO: Buggy for non-loop
   *
   * @returns current time in seconds, accounted for looping
   */
  getCurrentTime() {
    // `audioContext.currentTime` will grow past loopEndInS
    const rawCurrentTime = this.audioContext.currentTime;
    const diff = rawCurrentTime - this._prevRawCurrentTime;
    let newCurrentTime = this._currentTime + diff;
    if (newCurrentTime > this._loopEndInS) {
      newCurrentTime = newCurrentTime - this._loopEndInS + this._loopStartInS;
    }
    this._currentTime = newCurrentTime;
    this._prevRawCurrentTime = rawCurrentTime;
    return this._currentTime;
  }
}
