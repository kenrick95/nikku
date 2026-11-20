import { getEndianness, getSliceAsNumber, getSliceAsString } from './utils';

/** Sanity limits for `validateBrstm`, generous on purpose */
export const BRSTM_LIMITS = {
  minSampleRate: 1000,
  maxChannels: 64,
  /** real files use 0x2000 */
  maxBlockSize: 1024 * 1024,
  /** ADPCM is 1.75 samples/byte, the rest is slack for truncated files */
  maxDecodedSamplesPerByte: 4,
};

/**
 * Check the header before allocating anything, so a corrupted file can't
 * ask for gigabytes of memory or make the player loop forever
 * @param {Uint8Array} rawData whole file
 * @returns {string | null} reason if invalid, `null` otherwise
 */
export function validateBrstm(rawData: Uint8Array): string | null {
  const fileSize = rawData.length;
  if (fileSize < 0x40) {
    return 'file is too small';
  }
  if (getSliceAsString(rawData, 0, 4) !== 'RSTM') {
    return 'missing RSTM magic';
  }
  const bom = (rawData[4] << 8) | rawData[5];
  if (bom !== 0xfeff && bom !== 0xfffe) {
    return 'invalid byte order mark';
  }

  const endianness = getEndianness(rawData);
  const read = (offset: number, length: number) =>
    getSliceAsNumber(rawData, offset, length, endianness);

  // RSTM header
  const offsetToHead = read(0x10, 4);
  const headSize = read(0x14, 4);
  const offsetToAdpc = read(0x18, 4);
  const offsetToData = read(0x20, 4);

  if (offsetToHead < 0x20 || headSize < 0x20) {
    return 'invalid HEAD chunk offset or size';
  }
  const headEnd = offsetToHead + headSize;
  if (headEnd > fileSize || getSliceAsString(rawData, offsetToHead, 4) !== 'HEAD') {
    return 'HEAD chunk is outside the file';
  }
  if (
    offsetToData < 0x20 ||
    offsetToData + 0x20 > fileSize ||
    getSliceAsString(rawData, offsetToData, 4) !== 'DATA'
  ) {
    return 'DATA chunk is outside the file';
  }

  // HEAD parts must be inside HEAD
  const offsetToHeadChunk1 = offsetToHead + read(offsetToHead + 0x0c, 4) + 0x08;
  const offsetToHeadChunk2 = offsetToHead + read(offsetToHead + 0x14, 4) + 0x08;
  const offsetToHeadChunk3 = offsetToHead + read(offsetToHead + 0x1c, 4) + 0x08;
  if (
    offsetToHeadChunk1 + 0x34 > headEnd ||
    offsetToHeadChunk2 + 0x04 > headEnd ||
    offsetToHeadChunk3 + 0x04 > headEnd
  ) {
    return 'HEAD chunk parts are outside the HEAD chunk';
  }

  // HEAD part 1: stream info
  const codec = read(offsetToHeadChunk1, 1);
  const numberChannels = read(offsetToHeadChunk1 + 0x02, 1);
  const sampleRate = read(offsetToHeadChunk1 + 0x04, 2);
  const totalSamples = read(offsetToHeadChunk1 + 0x0c, 4);
  const totalBlocks = read(offsetToHeadChunk1 + 0x14, 4);
  const blockSize = read(offsetToHeadChunk1 + 0x18, 4);
  const samplesPerBlock = read(offsetToHeadChunk1 + 0x1c, 4);
  const finalBlockSize = read(offsetToHeadChunk1 + 0x20, 4);
  const totalSamplesInFinalBlock = read(offsetToHeadChunk1 + 0x24, 4);
  const finalBlockSizeWithPadding = read(offsetToHeadChunk1 + 0x28, 4);

  if (codec > 2) {
    return 'unsupported codec';
  }
  if (numberChannels < 1 || numberChannels > BRSTM_LIMITS.maxChannels) {
    return 'invalid number of channels';
  }
  if (sampleRate < BRSTM_LIMITS.minSampleRate) {
    return 'invalid sample rate';
  }
  if (totalSamples < 1) {
    return 'invalid number of samples';
  }
  if (
    totalSamples * numberChannels >
    fileSize * BRSTM_LIMITS.maxDecodedSamplesPerByte
  ) {
    return 'number of samples does not match the file size';
  }
  if (
    blockSize < 1 ||
    blockSize > BRSTM_LIMITS.maxBlockSize ||
    samplesPerBlock < 1 ||
    totalBlocks !== Math.ceil(totalSamples / samplesPerBlock) ||
    totalSamplesInFinalBlock > samplesPerBlock ||
    finalBlockSize > finalBlockSizeWithPadding ||
    finalBlockSizeWithPadding > blockSize + 0x20
  ) {
    return 'inconsistent block layout';
  }

  // HEAD part 2: track descriptions
  const numberTracks = read(offsetToHeadChunk2, 1);
  if (offsetToHeadChunk2 + 0x04 + numberTracks * 8 > headEnd) {
    return 'track descriptions are outside the HEAD chunk';
  }
  for (let t = 0; t < numberTracks; t++) {
    const entry = offsetToHeadChunk2 + 0x04 + t * 8;
    const type = read(entry + 0x01, 1);
    const offsetToTrackDescription = offsetToHead + 0x08 + read(entry + 0x04, 4);
    const offsetToChannelCount =
      offsetToTrackDescription + (type === 1 ? 0x08 : 0);
    if (offsetToChannelCount + 1 > headEnd) {
      return 'track description is outside the HEAD chunk';
    }
  }

  // HEAD part 3 and ADPC, only for DSP-ADPCM
  if (codec === 2) {
    if (offsetToHeadChunk3 + 0x08 + numberChannels * 8 > headEnd) {
      return 'channel info table is outside the HEAD chunk';
    }
    for (let c = 0; c < numberChannels; c++) {
      const offsetToChannelInfo =
        offsetToHead + read(offsetToHeadChunk3 + 0x08 + c * 8, 4) + 0x08 + 8;
      // only the coefs: some valid files have the loop history past HEAD
      if (offsetToChannelInfo + 0x20 > headEnd) {
        return 'ADPCM coefficients are outside the HEAD chunk';
      }
    }
    if (
      offsetToAdpc < 0x20 ||
      offsetToAdpc + 0x08 > fileSize ||
      getSliceAsString(rawData, offsetToAdpc, 4) !== 'ADPC'
    ) {
      return 'ADPC chunk is outside the file';
    }
  }

  return null;
}
