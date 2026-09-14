import type { Metadata as BfstmMetadata } from 'bfstm';
import type { Metadata as BrstmMetadata } from 'brstm';
import AudioSourceCode from './worklet/audio-source.js?raw';

type Metadata = BrstmMetadata | BfstmMetadata;

export type AudioPlayerOptions = {
  onPlay: () => void;
  onPause: () => void;
  onEnded?: () => void | Promise<void>;
  onPosition?: () => void;
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

  #currentTimestamp: number = 0;
  #timestampContextTime = 0;

  #shouldLoop: boolean = false;
  #hasBufferReachedEnd: boolean = true;
  #isPlaying: boolean = false;
  #generation = 0;
  #seekVersion = 0;

  /** 0..1 */
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
      await this.#audioContext.suspend();
      if (this.#audioContext.audioWorklet) {
        const blob = new Blob([AudioSourceCode], { type: 'text/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        try {
          await this.#audioContext.audioWorklet.addModule(blobUrl);
        } finally {
          URL.revokeObjectURL(blobUrl);
        }
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
    this.#gainNode = null;

    this.#currentTimestamp = 0;
    this.#timestampContextTime = this.#audioContext?.currentTime ?? 0;

    this.#seekVersion = 0;
    this.#shouldLoop = true;
    this.#hasBufferReachedEnd = false;
    this.#isPlaying = false;

    this.#volume = 1;
  }

  async destroy() {
    this.#generation++;
    this.options.onPause();
    this.#audioSourceNode?.disconnect();
    this.#audioSourceNode?.port.close();
    this.#gainNode?.disconnect();
    if (this.#audioContext && this.#audioContext.state !== 'closed') {
      await this.#audioContext.close();
    }
    await this.init();
  }

  async start() {
    if (!this.metadata || !this.#audioContext) {
      return;
    }
    const generation = this.#generation;
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
    if (generation !== this.#generation) {
      return;
    }
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
        if (generation !== this.#generation) {
          return;
        }
        console.time('getSamples');
        const samples = await this.options.decodeSamples(
          segment.offset * sampleRate,
          segment.size * sampleRate
        );
        console.timeEnd('getSamples');
        if (generation !== this.#generation) {
          return;
        }
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
    const sourceNode = this.#audioSourceNode;
    if (this.#audioSourceNode.port) {
      this.#audioSourceNode.port.addEventListener(
        'message',
        (ev: MessageEvent) => {
          // A closed port can still have a queued message from the previous file.
          if (sourceNode !== this.#audioSourceNode) return;
          switch (ev.data.type) {
            case 'BUFFER_LOOPED': {
              console.log('[AudioPlayer]', ev.data.type);
              break;
            }
            case 'BUFFER_ENDED': {
              if (ev.data.payload.seekVersion !== this.#seekVersion) break;
              console.log('[AudioPlayer]', ev.data.type);
              this.#currentTimestamp = totalSamples / sampleRate;
              this.#timestampContextTime = this.#audioContext?.currentTime ?? 0;
              this.#hasBufferReachedEnd = true;
              void this.pause().then(() => this.options.onEnded?.());
              break;
            }

            case 'TIMESTAMP_REPLY': {
              // console.log('[AudioPlayer]', ev.data.type);
              if (ev.data.payload.seekVersion !== this.#seekVersion) break;
              this.#currentTimestamp = ev.data.payload.timestamp as number;
              this.#timestampContextTime = ev.data.payload.contextTime as number;
              this.options.onPosition?.();
              break;
            }
          }
        }
      );
      this.#audioSourceNode.port.start();
    }
    this.#gainNode = this.#audioContext.createGain();
    this.#gainNode.gain.value = this.#volume;

    this.#audioSourceNode.connect(this.#gainNode);
    this.#gainNode.connect(this.#audioContext.destination);

    this.#hasBufferReachedEnd = false;
  }

  /**
   * @param {number} playbackTimeInS
   */
  async seek(playbackTimeInS: number, resume = true) {
    if (!this.#audioContext || !this.metadata || !Number.isFinite(playbackTimeInS)) {
      return;
    }
    const duration = this.metadata.totalSamples / this.metadata.sampleRate;
    playbackTimeInS = Math.max(0, Math.min(duration, playbackTimeInS));
    this.#seekVersion++;
    this.#currentTimestamp = playbackTimeInS;
    this.#timestampContextTime = this.#audioContext.currentTime;
    this.#hasBufferReachedEnd = playbackTimeInS >= duration;
    if (this.#audioSourceNode) {
      this.#audioSourceNode.port.postMessage({
        type: 'SEEK',
        payload: {
          playbackTimeInS,
          seekVersion: this.#seekVersion,
        },
      });
    }
    this.options.onPosition?.();
    if (resume && !this.#isPlaying) {
      await this.play();
    }
  }

  async play() {
    if (this.#isPlaying || !this.#audioContext) {
      return;
    }
    const context = this.#audioContext;
    if (this.#hasBufferReachedEnd) await this.seek(0, false);
    await context.resume();
    if (context !== this.#audioContext) return;
    this.#isPlaying = true;
    this.options.onPlay();
  }
  async pause() {
    if (!this.#isPlaying || !this.#audioContext) {
      return;
    }
    const context = this.#audioContext;
    await context.suspend();
    if (context !== this.#audioContext) return;
    this.#currentTimestamp = this.getCurrrentPlaybackTime();
    this.#timestampContextTime = context.currentTime;
    this.#isPlaying = false;
    this.options.onPause();
    this.options.onPosition?.();
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
   * Interpolate the worklet's sample position using the audio clock, never a UI timer.
   * @returns {number} current time in seconds, accounted for looping
   */
  getCurrrentPlaybackTime(): number {
    if (!this.#audioSourceNode) {
      return 0;
    }
    if (!this.metadata || !this.#audioContext) return this.#currentTimestamp;
    const duration = this.metadata.totalSamples / this.metadata.sampleRate;
    const elapsed = this.#isPlaying
      ? Math.max(0, this.#audioContext.currentTime - this.#timestampContextTime)
      : 0;
    let position = this.#currentTimestamp + elapsed;
    const loopStart = this.metadata.loopStartSample / this.metadata.sampleRate;
    if (this.#shouldLoop && !this.#hasBufferReachedEnd && position >= duration && duration > loopStart) {
      position = loopStart + (position - duration) % (duration - loopStart);
    }
    return Math.max(0, Math.min(duration, position));
  }
}
