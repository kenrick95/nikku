export class AudioPlayer {
  constructor(metadata) {
    this.init(metadata);
  }

  init(metadata) {
    if (metadata) {
      this.metadata = metadata;
      this.audioContext = new AudioContext({
        sampleRate: metadata.sampleRate
      });
    } else {
      // For destroy
      this.metadata = null;
      this.audioContext = null;
    }

    /**
     * @private
     * @member {Array<Float32Array>} _floatSamples per-channel audio buffer data
     */
    this._floatSamples = [];
    this.bufferSource = null;
    this._loopStartInS = null;
    this._loopEndInS = null;
    this._loopDurationInS = null;

    this._startTimestamp = 0;
    this._pauseTimestamp = 0;

    this._shouldLoop = true;
    this._initNeeded = true;
  }

  async destroy() {
    await this.pause();
    this.init();
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

    this.bufferSource = this.audioContext.createBufferSource();
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
    };
    this.bufferSource.start(0);
    this._startTimestamp = performance.now();

    this._initNeeded = false;

    // console.log('this.audioContext', this.audioContext, this.bufferSource);
  }

  async play() {
    if (this._initNeeded) {
      this.initPlayback();
      return;
    }
    this._startTimestamp =
      this._startTimestamp + (performance.now() - this._pauseTimestamp);
    await this.audioContext.resume();
  }
  async pause() {
    this._pauseTimestamp = performance.now();
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
   * This timer does not rely on Web Audio API at all, might be less accurate, but more or less working
   * @returns current time in seconds, accounted for looping
   */
  getCurrrentPlaybackTime() {
    const currentTimestamp = performance.now();
    const playbackTime = currentTimestamp - this._startTimestamp;
    let playbackTimeInS = playbackTime / 1000;
    if (playbackTimeInS > this._loopEndInS) {
      if (this._shouldLoop) {
        this._startTimestamp =
          this._startTimestamp + this._loopDurationInS * 1000;
        playbackTimeInS = (currentTimestamp - this._startTimestamp) / 1000;
      } else {
        playbackTimeInS = Math.min(playbackTimeInS, this._loopEndInS);
      }
    }
    return playbackTimeInS;
  }
}
