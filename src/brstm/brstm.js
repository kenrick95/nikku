import {
  getSliceAsString,
  getSliceAsNumber,
  getInt16,
  clamp
} from './utils.js';
/**
 * @class
 */
export class Brstm {
  /**
   *
   * @param {ArrayBuffer} arrayBuffer
   */
  constructor(arrayBuffer) {
    /**
     * @member {Uint8Array} rawData
     */
    this.rawData = new Uint8Array(arrayBuffer);

    if (getSliceAsString(this.rawData, 0, 4) !== 'RSTM') {
      throw new Error('Not a valid BRSTM file');
    }
    // number of seconds: totalSamples / sampleRate

    /**
     * @member {number} offsetToHead Offset to HEAD chunk, relative to beginning of file
     */
    this.offsetToHead = getSliceAsNumber(this.rawData, 0x10, 4);
    /**
     * @member {number} offsetToHeadChunk1 Offset to HEAD chunk part 1, relative to beginning of file
     */
    this.offsetToHeadChunk1 =
      this.offsetToHead +
      getSliceAsNumber(this.rawData, this.offsetToHead + 0x0c, 4) +
      0x08;
    /**
     * @member {number} offsetToHeadChunk2 Offset to HEAD chunk part 2, relative to beginning of file
     */
    this.offsetToHeadChunk2 =
      this.offsetToHead +
      getSliceAsNumber(this.rawData, this.offsetToHead + 0x14, 4) +
      0x08;
    /**
     * @member {number} offsetToHeadChunk3 Offset to HEAD chunk part 3, relative to beginning of file
     */
    this.offsetToHeadChunk3 =
      this.offsetToHead +
      getSliceAsNumber(this.rawData, this.offsetToHead + 0x1c, 4) +
      0x08;
    /**
     * @member {number} offsetToAdpc Offset to ADPC chunk, relative to beginning of file
     */
    this.offsetToAdpc = getSliceAsNumber(this.rawData, 0x18, 4);
    /**
     * @member {number} offsetToData Offset to DATA, relative to beginning of file
     */
    this.offsetToData = getSliceAsNumber(this.rawData, 0x20, 4);

    /**
     * @member {Object} metadata
     */
    this.metadata = this._getMetadata();

    /**
     * @member {Array<Array<{yn1: number, yn2: number}>>} adpcChunkData array of numberChannels x totalBlocks, each containing yn1 and yn2, representing the history sample 1 and 2 of that channel & block
     */
    this.adpcChunkData = this._getPartitionedAdpcChunkData();
    /**
     * @member {Array<Uint8Array>} dataChunkData array of non-interlaced raw data; each array represents one channel
     */
    this.dataChunkData = this._getPartitionedDataChunkData();
  }

  _getMetadata() {
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
        adpcmCoefficients.push(getInt16(num));
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

      adpcDataSize: getSliceAsNumber(this.rawData, this.offsetToAdpc + 0x04, 4),
      dataDataSize: getSliceAsNumber(this.rawData, this.offsetToData + 0x04, 4)
    };

    return metadata;
  }

  /**
   *
   * @returns {Array<Uint8Array>} array of non-interlaced raw data; each array represents one channel
   */
  _getPartitionedDataChunkData() {
    const {
      blockSize,
      totalBlocks,
      numberChannels,
      finalBlockSize,
      dataDataSize
    } = this.metadata;

    // `rawData` here is data chunk's raw data
    const rawData = this.rawData.slice(
      this.offsetToData + 0x20,
      this.offsetToData + 0x20 + dataDataSize
    );
    let result = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(new Uint8Array(rawData.length / numberChannels));
    }
    for (let b = 0; b < totalBlocks; b++) {
      for (let c = 0; c < numberChannels; c++) {
        const rawDataOffset = (b * numberChannels + c) * blockSize;
        const rawDataEnd =
          b + 1 === totalBlocks
            ? rawDataOffset + finalBlockSize
            : rawDataOffset + blockSize;
        const resultOffset = b * blockSize;
        const slice = rawData.slice(rawDataOffset, rawDataEnd);
        result[c].set(slice, resultOffset);
      }
    }
    return result;
  }

  _getPartitionedAdpcChunkData() {
    const { totalBlocks, numberChannels, adpcDataSize } = this.metadata;

    // `rawData` here is adpc chunk's raw data
    const rawData = this.rawData.slice(
      this.offsetToAdpc + 0x08,
      this.offsetToAdpc + 0x08 + adpcDataSize
    );
    let result = [];
    let offset = 0;
    let yn1 = 0;
    let yn2 = 0;
    for (let c = 0; c < numberChannels; c++) {
      result.push([]);
      for (let b = 0; b < totalBlocks; b++) {
        result[c].push([]);
      }
      yn1 = getInt16(getSliceAsNumber(rawData, offset, 2));
      offset += 2;
      yn2 = getInt16(getSliceAsNumber(rawData, offset, 2));
      offset += 2;
    }
    for (let b = 0; b < totalBlocks; b++) {
      for (let c = 0; c < numberChannels; c++) {
        if (b > 0) {
          yn1 = getInt16(getSliceAsNumber(rawData, offset, 2));
          offset += 2;
          yn2 = getInt16(getSliceAsNumber(rawData, offset, 2));
          offset += 2;
        }

        result[c][b] = {
          yn1,
          yn2
        };
      }
    }
    return result;
  }

  /**
   * @returns {Array<Int16Array>} per-channel samples
   */
  getAllSamples() {
    const {
      numberChannels,
      totalSamples,
      totalBlocks,
      channelInfo,
      blockSize,
      finalBlockSize,
      totalSamplesInFinalBlock,
      samplesPerBlock
    } = this.metadata;

    const result = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(new Int16Array(totalSamples));
    }

    for (let c = 0; c < numberChannels; c++) {
      const {
        adpcmCoefficients
        // initialPredictorScale,
        // historySample1,
        // historySample2,
        // loopPredictorScale,
        // loopHistorySample1,
        // loopHistorySample2
      } = channelInfo[c];

      // Length should be = (totalBlocks - 1) * blockSize + finalBlockSize
      const channelDataChunkData = this.dataChunkData[c];

      for (let b = 0; b < totalBlocks; b++) {
        const { yn1, yn2 } = this.adpcChunkData[c][b];
        const blockData =
          b === totalBlocks - 1
            ? channelDataChunkData.slice(
                b * blockSize,
                b * blockSize + finalBlockSize
              )
            : channelDataChunkData.slice(b * blockSize, (b + 1) * blockSize);
        const ps = blockData[0];

        // More or less based on brawllib's ADPCMState.cs

        const sampleResult = [];

        let cps = ps,
          cyn1 = yn1,
          cyn2 = yn2,
          dataIndex = 0;
        const totalSamplesInBlock =
          b === totalBlocks - 1 ? totalSamplesInFinalBlock : samplesPerBlock;

        for (let sampleIndex = 0; sampleIndex < totalSamplesInBlock; ) {
          let outSample = 0;
          if (sampleIndex % 14 === 0) {
            cps = blockData[dataIndex++];
          }
          if ((sampleIndex++ & 1) === 0) {
            outSample = blockData[dataIndex] >> 4;
          } else {
            outSample = blockData[dataIndex++] & 0x0f;
          }
          if (outSample >= 8) {
            outSample -= 16;
          }
          const scale = 1 << (cps & 0x0f);
          const cIndex = (cps >> 4) << 1;

          outSample =
            (0x400 +
              ((scale * outSample) << 11) +
              adpcmCoefficients[clamp(cIndex, 0, 15)] * cyn1 +
              adpcmCoefficients[clamp(cIndex + 1, 0, 15)] * cyn2) >>
            11;

          cyn2 = cyn1;
          cyn1 = clamp(outSample, -32768, 32767);

          sampleResult.push(cyn1);
        }

        result[c].set(sampleResult, b * samplesPerBlock);
        // console.log('>>', c, b, yn1, yn2, ps, blockData, sampleResult);
      }
    }

    return result;
  }
}
