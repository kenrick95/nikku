export type Endianness = 0 | 1;

export type TrackDescription = {
  numberChannels: number;
  type: number;
  channelIndices?: number[];
};

/**
 * - 0 - 8-bit PCM
 * - 1 - 16-bit PCM
 * - 2 - Nintendo DSP ADPCM
 * - 3 - IMA ADPCM (unsupported)
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
  loopStartSample: number;
  totalSamples: number;
  totalBlocks: number;
  blockSize: number;
  samplesPerBlock: number;
  finalBlockSize: number;
  finalBlockSizeWithPadding: number;
  totalSamplesInFinalBlock: number;
  adpcTableSamplesPerEntry: number;
  adpcTableBytesPerEntry: number;
  numberTracks: number;
  trackDescriptionType: number;
  trackDescriptions: TrackDescription[];
};
