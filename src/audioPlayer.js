// @ts-check

/**
 * @typedef {import("./brstm/index.js").Metadata} Metadata
 */

/**
 * @typedef {Object} AudioPlayerHooks
 * @property {() => void} onPlayed
 * @property {() => void} onPaused
 */

/**
 * @class AudioPlayer
 */

export class AudioPlayer {
  /**
   * @param {Metadata} metadata
   * @param {AudioPlayerHooks} hooks
   */
  constructor(metadata, hooks) {
    this.init(metadata);
    this.hooks = hooks;
  }

  /**
   * @param {Metadata=} metadata
   */
  init(metadata) {
    if (metadata) {
      this.metadata = metadata;
      this.audioContext = new AudioContext({
        sampleRate: metadata.sampleRate,
      });
    } else {
      // For destroy
      this.metadata = null;
      this.audioContext = null;
    }

    /**
     * One BRSTM file can have more than 2 channels
     * For example the ones given in [#1](https://github.com/kenrick95/nikku/issues/1) have 8 and 4 channels!
     *
     * One "stream" is a pair of 2 channels
     *
     * @type {Array<boolean>}
     */
    this._streamStates = [true];

    this._audioBuffer = null;
    this.bufferSource = null;
    this._loopStartInS = null;
    this._loopEndInS = null;
    this._loopDurationInS = null;

    this._startTimestamp = 0;
    this._pauseTimestamp = 0;

    this._shouldLoop = true;
    this._initNeeded = true;
    this._isSeeking = false;
    this.isPlaying = false;

    /**
     * 0..1
     */
    this._volume = 1;
    this._gainNode = null;
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
    const floatSamples = samples.map((sample) => {
      return this.convertToAudioBufferData(sample);
    });

    const { numberChannels } = this.metadata;
    this._audioBuffer = this.audioContext.createBuffer(
      numberChannels,
      floatSamples[0].length,
      this.audioContext.sampleRate
    );
    for (let c = 0; c < numberChannels; c++) {
      this._audioBuffer.getChannelData(c).set(floatSamples[c]);
    }
    const numberStreams = Math.floor(numberChannels / 2);
    this._streamStates = [];
    for (let i = 0; i < numberStreams; i++) {
      if (i === 0) {
        this._streamStates.push(true);
      } else {
        this._streamStates.push(false);
      }
    }

    this.initPlayback();
    this.isPlaying = true;
    this.hooks.onPlayed();
  }

  /**
   * @param {number=} bufferStart
   */
  initPlayback(bufferStart = 0) {
    const {
      loopStartSample,
      totalSamples,
      sampleRate,
      numberChannels,
    } = this.metadata;

    if (this.bufferSource) {
      this.bufferSource.stop(0);
      this.bufferSource = null;
    }

    this.bufferSource = this.audioContext.createBufferSource();
    this.bufferSource.buffer = this._audioBuffer;

    this._gainNode = this.audioContext.createGain();
    this._gainNode.gain.value = this._volume;

    if (numberChannels <= 1) {
      // if mono, only connect buffer -> gain (volume) -> destination
      this.bufferSource.connect(this._gainNode);
      this._gainNode.connect(this.audioContext.destination);
    } else {
      /**
       * The purpose of this branch is to only play one stream at a time, i.e. max 2 channels
       * The illustration is shown below
       */

      /*
       * Example when numberChannels = 4
       *                                            /-0-->
       *                                            |
       * [  buffer source  ]  -->   [splitter]   ---+-1-->
       *                                            |
       *                                            +-2-->
       *                                            |
       *                                            \-3-->
       *
       */

      /*
       * Continued example, and when only "stream" index = 1 is active
       *
       * --0-->
       *
       * --1-->
       *          /-->-L-\
       * --2-->--/        +--> [merger]  --> [gain] --> [  context destination  ]
       *            /->R-/
       * --3-->----/
       *
       */
      const splitter = this.audioContext.createChannelSplitter(numberChannels);

      let mergerChannels = 2;
      for (const streamState of this._streamStates) {
        if (streamState) {
          mergerChannels += 2;
        }
      }
      const merger = this.audioContext.createChannelMerger(mergerChannels);

      this.bufferSource.connect(splitter);

      let mergerIndex = 0;
      for (let i = 0; i < this._streamStates.length; i++) {
        const streamState = this._streamStates[i];

        if (streamState) {
          splitter.connect(merger, 2 * i + 0, mergerIndex);
          splitter.connect(merger, 2 * i + 1, mergerIndex + 1);
          mergerIndex += 2;
        }
      }

      merger.connect(this._gainNode);
      this._gainNode.connect(this.audioContext.destination);
    }

    this._loopStartInS = loopStartSample / sampleRate;
    this._loopEndInS = totalSamples / sampleRate;
    this._loopDurationInS = this._loopEndInS - this._loopStartInS;

    this.bufferSource.loopStart = this._loopStartInS;
    this.bufferSource.loopEnd = this._loopEndInS;
    this.bufferSource.loop = this._shouldLoop;
    this.bufferSource.onended = () => {
      if (!this._isSeeking) {
        this.pause();
        this._initNeeded = true;
      } else {
        /**
         * Naturally, this piece of code shouldn't be here, but since I called
         * `this.bufferSource.stop(0);` earlier on, this `onended` event will be triggered
         * much much later than any other codes.
         */
        this._isSeeking = false;
      }
    };
    this.bufferSource.start(this.audioContext.currentTime, bufferStart);
    this._startTimestamp = Date.now() - bufferStart * 1000;

    this._initNeeded = false;
  }

  /**
   * @param {number} playbackTimeInS
   */
  async seek(playbackTimeInS) {
    this._isSeeking = true;
    this.initPlayback(playbackTimeInS);
    if (!this.isPlaying) {
      this.isPlaying = true;
      // Cannot use this.play() as it will adjust _startTimestamp based on previous _pauseTimestamp
      await this.audioContext.resume();
      this.hooks.onPlayed();
    }
  }

  async play() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    await this.audioContext.resume();
    this.hooks.onPlayed();

    if (this._initNeeded) {
      this.initPlayback();
    } else {
      this._startTimestamp =
        this._startTimestamp + Date.now() - this._pauseTimestamp;
    }
  }
  async pause() {
    if (!this.isPlaying) {
      return;
    }
    this.isPlaying = false;
    this._pauseTimestamp = Date.now();
    await this.audioContext.suspend();
    this.hooks.onPaused();
  }

  /**
   *
   * @param {Array<boolean>} newStates
   */
  async setStreamStates(newStates) {
    this._streamStates = newStates;
    // NOTE: Only works well when this.isPlaying is true!
    this.seek(this.getCurrrentPlaybackTime());
  }

  /**
   * Set the gain node's value
   * @param {number} value 0..1
   */
  async setVolume(value) {
    this._volume = value;
    if (this._gainNode) {
      this._gainNode.gain.value = value;
    }
  }

  /**
   * @param {boolean} value
   */
  setLoop(value) {
    this._shouldLoop = value;
    this.bufferSource.loop = this._shouldLoop;
  }

  /**
   * This timer does not rely on Web Audio API at all, might be less accurate, but more or less working
   * @returns {number} current time in seconds, accounted for looping
   */
  getCurrrentPlaybackTime() {
    const currentTimestamp = Date.now();
    const playbackTime = currentTimestamp - this._startTimestamp;
    let playbackTimeInS = playbackTime / 1000;

    /**
     * This is to account for this._startTimestamp > currentTimestamp
     * 
     * https://github.com/kenrick95/nikku/issues/15
     * 
     * Bug description:
     * - Load a file, tick Loop, pause it for N seconds, where N > file's duration
     * - When played again, it will show a wrong playback time
     * 
     * This is because during the resume of the file, `this._startTimestamp` is changed at multiple places
     * 1. getCurrrentPlaybackTime() will change `this._startTimestamp`
     * 2. then play() will also change `this._startTimestamp`
     * 3. then the next getCurrrentPlaybackTime() will result in a negative value
     * 
     */
    while (playbackTimeInS < 0) {
      this._startTimestamp =
        this._startTimestamp - this._loopDurationInS * 1000;
      playbackTimeInS = (currentTimestamp - this._startTimestamp) / 1000;
    }
    while (playbackTimeInS > this._loopEndInS) {
      if (this._shouldLoop && this.isPlaying) {
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
