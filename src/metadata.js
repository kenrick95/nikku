/*
  Notes
  
  Information from opening music.brstm on BrawlBox
  
  music.brstm currently contains
  
  Encoding: ADPCM
  Channels: 2
  isLooped: true
  sampleRate: 44100
  loopStartSample: 573440
  numSamples: 3749414
  numBlocks: 262
  blockSize: 8192
  bitsPerSample: 4
  
  versionMajor: 1
  versionMinor: 0
  */

/**
 * Get metadata of BRSTM file
 * @param {Uint8Array} uint8Array (instance of Uint8Array)
 */
export function getMetadata(uint8Array) {
  // Header
  if (getSliceAsString(uint8Array, 0, 4) === 'RSTM') {
    // Should be a valid BRSTM file
  }
  const offsetToHead = getSliceAsNumber(uint8Array, 0x10, 4);
  const offsetToData = getSliceAsNumber(uint8Array, 0x20, 4);
  const offsetToHeadChunk1 = 32;

  // getSlice(uint8Array, 4, 0, 2) === [-2, -1] --> little endian (usually, let's assume this)
  // getSlice(uint8Array, 4, 0, 2) === [-1, -1] --> big endian
  // getSliceAsNumber(uint8Array, 8, 4) --> file size; equivalent to uint8Array.byteLength

  return {
    fileSize: getSliceAsNumber(uint8Array, 8, 4),

    /**
     * Codec:
     * 0 - 8-bit PCM
     * 1 - 16-bit PCM
     * 2 - 4-bit ADPCM
     */
    codec: getSliceAsNumber(uint8Array, offsetToHead + offsetToHeadChunk1, 1),
    loopFlag: getSliceAsNumber(
      uint8Array,
      offsetToHead + offsetToHeadChunk1 + 0x0001,
      1
    ),
    numberChannels: getSliceAsNumber(
      uint8Array,
      offsetToHead + offsetToHeadChunk1 + 0x0002,
      1
    ),
    sampleRate: getSliceAsNumber(
      uint8Array,
      offsetToHead + offsetToHeadChunk1 + 0x0004,
      2
    ),
    loopStartSample: getSliceAsNumber(
      uint8Array,
      offsetToHead + offsetToHeadChunk1 + 0x0008,
      4
    ),
    totalSample: getSliceAsNumber(
      uint8Array,
      offsetToHead + offsetToHeadChunk1 + 0x000c,
      4
    ),
    totalBlocks: getSliceAsNumber(
      uint8Array,
      offsetToHead + offsetToHeadChunk1 + 0x0014,
      4
    ),
    blockSize: getSliceAsNumber(
      uint8Array,
      offsetToHead + offsetToHeadChunk1 + 0x0018,
      4
    ),
    samplesPerBlock: getSliceAsNumber(
      uint8Array,
      offsetToHead + offsetToHeadChunk1 + 0x001c,
      4
    ),

    offsetToData,
    audioDataSize: getSliceAsNumber(uint8Array, offsetToData + 0x04, 4)
  };
}

function getSlice(uint8Array, start, length) {
  const result = [];
  for (let i = start; i < start + length; i++) {
    // Apparently unsigned
    result.push(uint8Array[i]);
  }
  return result;
}
function getSliceAsString(uint8Array, start, length) {
  const resArr = getSlice(uint8Array, start, length);
  return String.fromCharCode(...resArr);
}
function getSliceAsNumber(uint8Array, start, length) {
  const resArr = getSlice(uint8Array, start, length);
  return resArr.reduce((acc, curr) => acc * 256 + curr, 0);
}
