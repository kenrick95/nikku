import type { Metadata } from 'brstm';
// import AudioMixer from './audio-mixer?url';
import AudioSource from './audio-source?url';

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
  #audioSourceNode: null | AudioWorkletNode = null;
  #audioSamples: null | Float32Array[] = null;
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
        await this.#audioContext.audioWorklet.addModule(AudioSource);
        // await this.#audioContext.audioWorklet.addModule(AudioMixer);
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

    this.#audioSourceNode = null;
    this.#audioSamples = null;

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
   *
   * @param {Array<Float32Array>} samples per-channel PCM samples
   * @param {number} offset
   */
  load(newSamples: Float32Array[], offset: number | undefined = 0): void {
    if (!this.metadata || !this.#audioContext) {
      return;
    }
    const { numberChannels, totalSamples } = this.metadata; 

    if (offset === 0) {
      const fullSamples: Float32Array[] = [];
      for (let c = 0; c < numberChannels; c++) {
        const channelFullSamples = new Float32Array(newSamples[c].length).fill(0);
        for (let s = 0; s < newSamples[c].length; s++) {
          channelFullSamples[s] = newSamples[c][s];
        }
        fullSamples.push(channelFullSamples);
      }

      this.initPlayback(offset, fullSamples);
      this.#isPlaying = true;
      this.hooks.onPlay();
    } else {
      if (this.#audioSourceNode) {
        console.log('newSamples', newSamples[0].length)
        // TODO: this is slow... maybe need to chunk out into several more postMessage. having a slow postMessage could affect audio, apparently...
        this.#audioSourceNode.port.postMessage({
          type: 'update-samples',
          payload: {
            samples: newSamples,
            offset,
          },
        }, newSamples.map(c => c.buffer));
        console.log('newSamples2', newSamples[0].length)
      }
      // "Seek" to current playback time to reinitialize AudioBufferSourceNode (this.#bufferSource) with latest AudioBuffer data
      // Assumption: user is still playing the audio player. Time between first & second load() should be quite small
      // this.seek(this.#audioContext.currentTime);
    }
  }

  initPlayback(
    bufferStart: number | undefined = 0,
    initialSamples: Float32Array[]
  ) {
    if (
      !this.metadata ||
      !this.#audioContext || 
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

    this.#audioSourceNode = new AudioWorkletNode(
      this.#audioContext,
      'audio-source-processor',
      {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
        processorOptions: {
          initialSamples: initialSamples,
        },
      }
    );
    console.log('initPlayback')

    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = this.#volume;

    this.#audioSourceNode.connect(this.#gainNode);
    this.#gainNode.connect(this.#audioContext.destination);

    this.#loopStartInS = loopStartSample / sampleRate;
    this.#loopEndInS = totalSamples / sampleRate;
    this.#loopDurationInS = this.#loopEndInS - this.#loopStartInS;

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
    // this.initPlayback(playbackTimeInS);
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
      // this.initPlayback();
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
