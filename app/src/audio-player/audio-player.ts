import type { Metadata } from 'brstm';
import AudioMixer from './audio-mixer?url';

export type AudioPlayerHooks = {
  onPlay: () => void;
  onPause: () => void;
};

/**
 * One BRSTM file can have >1 track.
 * Each track has its own channel count
 */
export type AudioPlayerTrackStates = Array<boolean>;

export class AudioPlayer {
  hooks: AudioPlayerHooks;
  metadata: Metadata | null = null;
  #audioContext: AudioContext | null = null;
  #trackStates: AudioPlayerTrackStates = [];
  #audioBuffer: null | AudioBuffer = null;
  #bufferSource: null | AudioBufferSourceNode = null;
  #gainNode: null | GainNode = null;
  #loopStartInS: null | number = null;
  #loopEndInS: null | number = null;
  #loopDurationInS: null | number = null;
  #startTimestamp: number = 0;
  #pauseTimestamp: number = 0;
  #shouldLoop: boolean = false;
  #initNeeded: boolean = true;
  #isSeeking: boolean = false;
  #isPlaying: boolean = false;
  #volume: number = 0;

  constructor(hooks: AudioPlayerHooks) {
    this.hooks = hooks;
    this.init();
  }

  async init(metadata?: Metadata) {
    if (metadata) {
      this.metadata = metadata;
      this.#audioContext = new AudioContext({
        sampleRate: metadata.sampleRate,
      });
      if (this.#audioContext.audioWorklet) {
        await this.#audioContext.audioWorklet.addModule(AudioMixer);
      }
    } else {
      // For destroy
      this.metadata = null;
      this.#audioContext = null;
    }

    this.#trackStates = [true];
    if (this.metadata && this.metadata.numberTracks > 1) {
      this.#trackStates = [];
      for (let i = 0; i < this.metadata.numberTracks; i++) {
        if (i === 0) {
          this.#trackStates.push(true);
        } else {
          this.#trackStates.push(false);
        }
      }
    }

    this.#audioBuffer = null;
    this.#bufferSource = null;
    this.#loopStartInS = null;
    this.#loopEndInS = null;
    this.#loopDurationInS = null;

    this.#startTimestamp = 0;
    this.#pauseTimestamp = 0;

    this.#shouldLoop = true;
    this.#initNeeded = true;
    this.#isSeeking = false;
    this.#isPlaying = false;

    /**
     * 0..1
     */
    this.#volume = 1;
    this.#gainNode = null;
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
  convertToAudioBufferData(pcmSamples: Int16Array): Float32Array {
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
   * @param {number} offset
   */
  load(samples: Int16Array[], offset: number | undefined = 0): void {
    if (!this.metadata || !this.#audioContext) {
      return;
    }
    const floatSamples = samples.map((sample) => {
      return this.convertToAudioBufferData(sample);
    });

    const { numberChannels, totalSamples } = this.metadata;
    if (!this.#audioBuffer) {
      this.#audioBuffer = this.#audioContext.createBuffer(
        numberChannels,
        totalSamples,
        this.#audioContext.sampleRate
      );
    }
    for (let c = 0; c < numberChannels; c++) {
      this.#audioBuffer.getChannelData(c).set(floatSamples[c], offset);
    }

    if (offset === 0) {
      this.initPlayback(offset);
      this.#isPlaying = true;
      this.hooks.onPlay();
    } else {
      // "Seek" to current playback time to reinitialize AudioBufferSourceNode (this.#bufferSource) with latest AudioBuffer data
      // Assumption: user is still playing the audio player. Time between first & second load() should be quite small
      this.seek(this.#audioContext.currentTime); 
    }
  }

  /**
   * @param {number=} bufferStart
   */
  initPlayback(bufferStart: number | undefined = 0) {
    if (
      !this.metadata ||
      !this.#audioContext ||
      !this.#audioBuffer ||
      this.#volume == null
    ) {
      return;
    }
    const {
      loopStartSample,
      totalSamples,
      sampleRate,
      numberTracks,
      trackDescriptions,
    } = this.metadata;

    if (this.#bufferSource) {
      this.#bufferSource.stop(0);
      this.#bufferSource = null;
    }

    this.#bufferSource = this.#audioContext.createBufferSource();
    this.#bufferSource.buffer = this.#audioBuffer;

    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = this.#volume;

    if (numberTracks === 1) {
      // if mono or stereo, no need to be complicated, just connect [source] -> [gain] -> [destination]
      this.#bufferSource.connect(this.#gainNode);
      this.#gainNode.connect(this.#audioContext.destination);
    } else {
      if (!this.#audioContext.audioWorklet) {
        throw new Error(
          'Sorry, playback of multi-track BRSTM is not supported in this browser'
        );
      }
      /**
       *
       * Why we cannot use the set up below?
       *
       * [source] --> [splitter] ===> [merger] --> [gain] --> [destination]
       *
       * This is because when split into >4 channels, when these channels are going back to be merged,
       * we can only choose to either merge them using these channel intepretation:
       * - "speaker": downmix using "speaker" intepretation algorithm, didn't work as expected if channel = 6 since it is special (treated as if it is downmix 5.1 to mono)
       * - "discrete": downmix
       *
       * P.S. using "merger" node downmixed the audio into mono
       *
       */
      const audioMixerNode = new AudioWorkletNode(
        this.#audioContext,
        'audio-mixer-processor',
        {
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [2],
          processorOptions: {
            trackStates: this.#trackStates,
            trackDescriptions,
          },
        }
      );

      this.#bufferSource.connect(audioMixerNode);
      audioMixerNode.connect(this.#gainNode);
      this.#gainNode.connect(this.#audioContext.destination);
    }

    this.#loopStartInS = loopStartSample / sampleRate;
    this.#loopEndInS = totalSamples / sampleRate;
    this.#loopDurationInS = this.#loopEndInS - this.#loopStartInS;

    this.#bufferSource.loopStart = this.#loopStartInS;
    this.#bufferSource.loopEnd = this.#loopEndInS;
    this.#bufferSource.loop = !!this.#shouldLoop;
    this.#bufferSource.onended = () => {
      if (!this.#isSeeking) {
        this.pause();
        this.#initNeeded = true;
      } else {
        /**
         * Naturally, this piece of code shouldn't be here, but since I called
         * `this.#bufferSource.stop(0);` earlier on, this `onended` event will be triggered
         * much much later than any other codes.
         */
        this.#isSeeking = false;
      }
    };
    this.#bufferSource.start(this.#audioContext.currentTime, bufferStart);
    this.#startTimestamp = Date.now() - bufferStart * 1000;

    this.#initNeeded = false;
  }

  /**
   * @param {number} playbackTimeInS
   */
  async seek(playbackTimeInS: number) {
    if (!this.#audioContext) {
      return;
    }
    this.#isSeeking = true;
    this.initPlayback(playbackTimeInS);
    if (!this.#isPlaying) {
      this.#isPlaying = true;
      this.hooks.onPlay();
      // Cannot use this.play() as it will adjust _startTimestamp based on previous _pauseTimestamp
      await this.#audioContext.resume();
    }
  }

  async play() {
    if (this.#isPlaying || !this.#audioContext) {
      return;
    }
    this.#isPlaying = true;
    this.hooks.onPlay();
    await this.#audioContext.resume();

    if (this.#initNeeded) {
      this.initPlayback();
    } else {
      this.#startTimestamp =
        this.#startTimestamp + Date.now() - (this.#pauseTimestamp ?? 0);
    }
  }
  async pause() {
    if (!this.#isPlaying || !this.#audioContext) {
      return;
    }
    this.#isPlaying = false;
    this.hooks.onPause();
    this.#pauseTimestamp = Date.now();
    await this.#audioContext.suspend();
  }

  /**
   *
   * @param {Array<boolean>} newStates
   */
  async setTrackStates(newStates: Array<boolean>) {
    this.#trackStates = newStates;
    // NOTE: Only works well when this.#isPlaying is true!
    this.seek(this.getCurrrentPlaybackTime());
  }

  /**
   * Set the gain node's value
   * @param {number} value 0..1
   */
  async setVolume(value: number) {
    this.#volume = value;
    if (this.#gainNode) {
      this.#gainNode.gain.value = value;
    }
  }

  /**
   * @param {boolean} value
   */
  setLoop(value: boolean) {
    this.#shouldLoop = value;
    if (this.#bufferSource) {
      this.#bufferSource.loop = this.#shouldLoop;
    }
  }

  /**
   * This timer does not rely on Web Audio API at all, might be less accurate, but more or less working
   * @returns {number} current time in seconds, accounted for looping
   */
  getCurrrentPlaybackTime(): number {
    if (this.#loopDurationInS == null || this.#loopEndInS == null) {
      return 0;
    }

    const currentTimestamp = Date.now();
    const playbackTime = currentTimestamp - this.#startTimestamp;
    let playbackTimeInS = playbackTime / 1000;

    /**
     * This is to account for this.#startTimestamp > currentTimestamp
     *
     * https://github.com/kenrick95/nikku/issues/15
     *
     * Bug description:
     * - Load a file, tick Loop, pause it for N seconds, where N > file's duration
     * - When played again, it will show a wrong playback time
     *
     * This is because during the resume of the file, `this.#startTimestamp` is changed at multiple places
     * 1. getCurrrentPlaybackTime() will change `this.#startTimestamp`
     * 2. then play() will also change `this.#startTimestamp`
     * 3. then the next getCurrrentPlaybackTime() will result in a negative value
     *
     */
    while (playbackTimeInS < 0) {
      this.#startTimestamp =
        this.#startTimestamp - this.#loopDurationInS * 1000;
      playbackTimeInS = (currentTimestamp - this.#startTimestamp) / 1000;
    }
    while (playbackTimeInS > this.#loopEndInS) {
      if (this.#shouldLoop && this.#isPlaying) {
        this.#startTimestamp =
          this.#startTimestamp + this.#loopDurationInS * 1000;
        playbackTimeInS = (currentTimestamp - this.#startTimestamp) / 1000;
      } else {
        playbackTimeInS = Math.min(playbackTimeInS, this.#loopEndInS);
      }
    }
    return playbackTimeInS;
  }
}
