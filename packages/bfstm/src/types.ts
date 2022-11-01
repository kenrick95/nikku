import type { Endianness } from '@nikku/utils';
export type ChannelInfo = {
  adpcmCoefficients: number[];
  gain: number;
  initialPredictorScale: number;
  historySample1: number;
  historySample2: number;
  loopPredictorScale: number;
  loopHistorySample1: number;
  loopHistorySample2: number;
};
export type TrackDescription = {
  numberChannels: number;
  type: number;
};
/**
 * - 0 = PCM8
 * - 1 = PCM16
 * - 2 = DSP ADPCM
 * - 3 = IMA ADPCM.
 */
export type CodecType = 0 | 1 | 2 | 3;
export type Metadata = {
  fileSize: number;
  endianness: Endianness;
  codec: CodecType;
  loopFlag: number;
  numberChannels: number;
  numberRegions: number;
  sampleRate: number;
  /** loop start, in terms of sample # */
  loopStartSample: number;
  totalSamples: number;
  /** total number of blocks, per channel, including final block */
  totalBlocks: number;
  blockSize: number;
  samplesPerBlock: number;
  /** Final block size, without padding, in bytes */
  finalBlockSize: number;
  /** Final block size, **with** padding, in bytes */
  finalBlockSizeWithPadding: number;
  /** Total samples in final block */
  totalSamplesInFinalBlock: number;

  /** Samples per entry in ADPC table */
  adpcTableSamplesPerEntry: number;
  /** Bytes per entry in ADPC table */
  adpcTableBytesPerEntry: number;
  /** Number of tracks */
  numberTracks: number;
  trackDescriptionType: number;
  trackDescriptions: TrackDescription[];
};
