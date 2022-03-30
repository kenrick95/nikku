import type { Metadata } from 'brstm';
import AudioSource from './worklet/audio-source?url';

export type AudioPlayerOptions = {
  onPlay: () => void;
  onPause: () => void;
  decodeSamples: (offset: number, size: number) => Promise<Float32Array[]>;
};

/**
 * One BRSTM file can have >1 track.
 * Each track has its own channel count
 */
export type AudioPlayerTrackStates = Array<boolean>;

export class AudioPlayer {
  options: AudioPlayerOptions;

  metadata: Metadata | null = null;
  #audioContext: AudioContext | null = null;
  #trackStates: AudioPlayerTrackStates = [];
  #audioSourceNode: null | AudioWorkletNode = null;
  #gainNode: null | GainNode = null;
  #loopStartInS: null | number = null;
  #loopEndInS: null | number = null;
  #loopDurationInS: null | number = null;
  #startTimestamp: number = 0;
  #pauseTimestamp: number = 0;
  #shouldLoop: boolean = false;
  #initNeeded: boolean = true;
  #isPlaying: boolean = false;
  #volume: number = 0;

  constructor(options: AudioPlayerOptions) {
    this.options = options;
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

    this.#loopStartInS = null;
    this.#loopEndInS = null;
    this.#loopDurationInS = null;

    this.#startTimestamp = 0;
    this.#pauseTimestamp = 0;

    this.#shouldLoop = true;
    this.#initNeeded = true;
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

  async start() {
    if (!this.metadata || !this.#audioContext) {
      return;
    }
    const { totalSamples, sampleRate } = this.metadata;
    const amountTimeInS = totalSamples / sampleRate;

    const initialSamplesSizeInSeconds = Math.min(amountTimeInS, 3);
    const initialSamplesSize = initialSamplesSizeInSeconds * sampleRate;
    console.time('getSamples');
    const initialSamples = await this.options.decodeSamples(
      0,
      initialSamplesSize
    );
    console.timeEnd('getSamples');
    this.#load(initialSamples, 0);

    // Decode in small segments, because postMessage-ing with a big data may cause jank
    // (which can be noticeable in the audio playback)
    const segmentsInSeconds: Array<{ offset: number; size: number }> = [];
    for (let ch = initialSamplesSizeInSeconds; ch < amountTimeInS; ch += 10) {
      if (ch + 10 < amountTimeInS) {
        segmentsInSeconds.push({ offset: ch, size: 10 });
      } else {
        // Final segment
        segmentsInSeconds.push({ offset: ch, size: amountTimeInS - ch });
      }
    }

    (async () => {
      for (const segment of segmentsInSeconds) {
        console.time('getSamples');
        const samples = await this.options.decodeSamples(
          segment.offset * sampleRate,
          segment.size * sampleRate
        );
        console.timeEnd('getSamples');
        this.#load(samples, segment.offset * sampleRate);
      }
    })();
  }

  /**
   *
   * @param {Array<Float32Array>} newSamples per-channel PCM samples
   * @param {number} offset
   */
  #load(newSamples: Float32Array[], offset: number | undefined = 0): void {
    if (!this.metadata || !this.#audioContext) {
      return;
    }

    if (offset === 0) {
      this.initPlayback(newSamples);
      this.#isPlaying = true;
      this.options.onPlay();
    } else {
      if (this.#audioSourceNode) {
        this.#audioSourceNode.port.postMessage(
          {
            type: 'ADD_SAMPLES',
            payload: {
              samples: newSamples,
              offset,
            },
          },
          newSamples.map((c) => c.buffer)
        );
      }
    }
  }

  initPlayback(initialSamples: Float32Array[]) {
    if (!this.metadata || !this.#audioContext || this.#volume == null) {
      return;
    }
    const { loopStartSample, totalSamples, sampleRate, trackDescriptions } =
      this.metadata;

    this.#audioSourceNode = new AudioWorkletNode(
      this.#audioContext,
      'audio-source-processor',
      {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
        processorOptions: {
          initialSamples,
          loopStartSample,
          totalSamples,
          sampleRate,
          shouldLoop: this.#shouldLoop,
          trackDescriptions,
          trackStates: this.#trackStates,
        },
      }
    );
    if (this.#audioSourceNode.port) {
      this.#audioSourceNode.port.addEventListener(
        'message',
        (ev: MessageEvent) => {
          console.log('[AudioPlayer]', ev.data.type);

          switch (ev.data.type) {
            case 'BUFFER_LOOPED': {
              // TODO: Update timer?
              break;
            }
            case 'BUFFER_ENDED': {
              // TODO: Notify end
              break;
            }
          }
        }
      );
    }
    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = this.#volume;

    this.#audioSourceNode.connect(this.#gainNode);
    this.#gainNode.connect(this.#audioContext.destination);

    this.#loopStartInS = loopStartSample / sampleRate;
    this.#loopEndInS = totalSamples / sampleRate;
    this.#loopDurationInS = this.#loopEndInS - this.#loopStartInS;

    this.#startTimestamp = Date.now();

    this.#initNeeded = false;
  }

  /**
   * @param {number} playbackTimeInS
   */
  async seek(playbackTimeInS: number) {
    if (!this.#audioContext) {
      return;
    }
    if (this.#audioSourceNode) {
      this.#audioSourceNode.port.postMessage({
        type: 'SEEK',
        payload: {
          playbackTimeInS,
        },
      });
    }
    this.#startTimestamp = Date.now() - playbackTimeInS * 1000;
    if (!this.#isPlaying) {
      this.#isPlaying = true;
      this.options.onPlay();
      // Cannot use this.play() as it will adjust _startTimestamp based on previous _pauseTimestamp
      await this.#audioContext.resume();
    }
  }

  async play() {
    if (this.#isPlaying || !this.#audioContext) {
      return;
    }
    this.#isPlaying = true;
    this.options.onPlay();
    await this.#audioContext.resume();

    if (!this.#initNeeded) {
      this.#startTimestamp =
        this.#startTimestamp + Date.now() - (this.#pauseTimestamp ?? 0);
    }
  }
  async pause() {
    if (!this.#isPlaying || !this.#audioContext) {
      return;
    }
    this.#isPlaying = false;
    this.options.onPause();
    this.#pauseTimestamp = Date.now();
    await this.#audioContext.suspend();
  }

  /**
   *
   * @param {Array<boolean>} newStates
   */
  async setTrackStates(newStates: Array<boolean>) {
    this.#trackStates = newStates;
    if (this.#audioSourceNode) {
      this.#audioSourceNode.port.postMessage({
        type: 'UPDATE_TRACK_STATES',
        payload: {
          trackStates: this.#trackStates,
        },
      });
    }
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
    if (this.#audioSourceNode) {
      this.#audioSourceNode.port.postMessage({
        type: 'UPDATE_SHOULD_LOOP',
        payload: {
          shouldLoop: this.#shouldLoop,
        },
      });
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
