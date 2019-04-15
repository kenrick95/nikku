import { getSliceAsString, getSliceAsNumber } from './utils.js';
/**
 * @field {Uint8Array} rawData
 */
export class Brstm {
  /**
   *
   * @param {ArrayBuffer} arrayBuffer
   * @param {number} offsetToHead Offset to HEAD chunk, relative to beginning of file
   * @param {number} offsetToHeadChunk1 Offset to HEAD chunk part 1, relative to beginning of file
   * @param {number} offsetToHeadChunk2 Offset to HEAD chunk part 2, relative to beginning of file
   * @param {number} offsetToHeadChunk3 Offset to HEAD chunk part 3, relative to beginning of file
   * @param {number} offsetToAdpc Offset to ADPC chunk, relative to beginning of file
   * @param {number} offsetToData Offset to DATA, relative to beginning of file
   */
  constructor(arrayBuffer) {
    this.rawData = new Uint8Array(arrayBuffer);

    if (getSliceAsString(this.rawData, 0, 4) !== 'RSTM') {
      throw new Error('Not a valid BRSTM file');
    }
    // number of seconds: totalSamples / sampleRate

    this.offsetToHead = getSliceAsNumber(this.rawData, 0x10, 4);
    this.offsetToHeadChunk1 =
      this.offsetToHead +
      getSliceAsNumber(this.rawData, this.offsetToHead + 0x0c, 4) +
      0x08;
    this.offsetToHeadChunk2 =
      this.offsetToHead +
      getSliceAsNumber(this.rawData, this.offsetToHead + 0x14, 4) +
      0x08;
    this.offsetToHeadChunk3 =
      this.offsetToHead +
      getSliceAsNumber(this.rawData, this.offsetToHead + 0x1c, 4) +
      0x08;
    this.offsetToAdpc = getSliceAsNumber(this.rawData, 0x18, 4);
    this.offsetToData = getSliceAsNumber(this.rawData, 0x20, 4);

    const numberChannels = getSliceAsNumber(
      this.rawData,
      this.offsetToHeadChunk1 + 0x0002,
      1
    );
    const channelInfo = [];

    for (let c = 0; c < numberChannels; c++) {
      const offsetToChannelInfo =
        this.offsetToHead +
        getSliceAsNumber(
          this.rawData,
          this.offsetToHeadChunk3 + 0x08 + c * 8,
          4
        ) +
        0x08 +
        8;
      const adpcmCoefficients = [];
      for (let i = 0; i < 16; i++) {
        const num = getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 2 * i,
          2
        );
        // Covert number to int16
        adpcmCoefficients.push(num >= 0x8000 ? num - 0x10000 : num);
      }

      channelInfo.push({
        adpcmCoefficients,
        gain: getSliceAsNumber(this.rawData, offsetToChannelInfo + 0x28, 2),

        initialPredictorScale: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x2a,
          2
        ),

        historySample1: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x2c,
          2
        ),

        historySample2: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x2e,
          2
        ),

        loopPredictorScale: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x30,
          2
        ),

        loopHistorySample1: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x32,
          2
        ),

        loopHistorySample2: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x34,
          2
        )
      });
    }

    const metadata = {
      fileSize: getSliceAsNumber(this.rawData, 8, 4),

      /**
       * Codec:
       * 0 - 8-bit PCM
       * 1 - 16-bit PCM
       * 2 - 4-bit ADPCM
       */
      codec: getSliceAsNumber(this.rawData, this.offsetToHeadChunk1, 1),
      loopFlag: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0001,
        1
      ),
      numberChannels,
      sampleRate: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0004,
        2
      ),
      /**
       * @field {number} loop start, in terms of sample #
       */
      loopStartSample: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0008,
        4
      ),
      totalSamples: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x000c,
        4
      ),
      /**
       * @field {number} total number of blocks, per channel, including final block
       */
      totalBlocks: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0014,
        4
      ),
      blockSize: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0018,
        4
      ),
      samplesPerBlock: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x001c,
        4
      ),
      /**
       * @field {number} Final block size, without padding, in bytes
       */
      finalBlockSize: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0020,
        4
      ),
      /**
       * @field {number} Final block size, **with** padding, in bytes
       */
      finalBlockSizeWithPadding: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0028,
        4
      ),
      /**
       * @field {number} Total samples in final block
       */
      totalSamplesInFinalBlock: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0024,
        4
      ),
      /**
       * @field {number} Samples per entry in ADPC table
       */
      adpcTableSamplesPerEntry: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x002c,
        4
      ),
      /**
       * @field {number} Bytes per entry in ADPC table
       */
      adpcTableBytesPerEntry: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk1 + 0x0030,
        4
      ),

      /**
       * @field {number} Number of tracks
       */
      numberTracks: getSliceAsNumber(this.rawData, this.offsetToHeadChunk2, 1),

      /**
       * @field {number} Track description type ??
       */
      trackDescriptionType: getSliceAsNumber(
        this.rawData,
        this.offsetToHeadChunk2 + 0x01,
        1
      ),

      channelInfo,

      audioDataSize: getSliceAsNumber(this.rawData, this.offsetToData + 0x04, 4)
    };

    this.metadata = metadata;

    // Extract ADPC chunk data
  }
}
