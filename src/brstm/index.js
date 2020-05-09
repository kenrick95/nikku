// @ts-check

import {
  getSliceAsString,
  getSliceAsNumber,
  getInt16,
  clamp,
} from './utils.js';

/**
 * @typedef {Object} ChannelInfo
 * @property {Array<number>} adpcmCoefficients
 * @property {number} gain
 * @property {number} initialPredictorScale
 * @property {number} historySample1
 * @property {number} historySample2
 * @property {number} loopPredictorScale
 * @property {number} loopHistorySample1
 * @property {number} loopHistorySample2
 */

/**
 * @exports 
 * @typedef {Object} Metadata
 * @property {number} fileSize
 * @property {number} codec
 *   - 0 - 8-bit PCM
 *   - 1 - 16-bit PCM
 *   - 2 - 4-bit ADPCM
 * @property {number} loopFlag
 * @property {number} numberChannels
 * @property {number} sampleRate
 * @property {number} loopStartSample loop start, in terms of sample #
 * @property {number} totalSamples
 * @property {number} totalBlocks total number of blocks, per channel, including final block
 * @property {number} blockSize
 * @property {number} samplesPerBlock
 * @property {number} finalBlockSize Final block size, without padding, in bytes
 * @property {number} finalBlockSizeWithPadding Final block size, **with** padding, in bytes
 * @property {number} totalSamplesInFinalBlock Total samples in final block
 * @property {number} adpcTableSamplesPerEntry Samples per entry in ADPC table
 * @property {number} adpcTableBytesPerEntry Bytes per entry in ADPC table
 * @property {number} numberTracks Number of tracks
 * @property {number} trackDescriptionType Track description type ??
 */

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
     * @type {Uint8Array} rawData
     */
    this.rawData = new Uint8Array(arrayBuffer);

    if (getSliceAsString(this.rawData, 0, 4) !== 'RSTM') {
      throw new Error('Not a valid BRSTM file');
    }
    // number of seconds: totalSamples / sampleRate

    /**
     * @private
     * @type {number} _offsetToHead Offset to HEAD chunk, relative to beginning of file
     */
    this._offsetToHead = getSliceAsNumber(this.rawData, 0x10, 4);
    /**
     * @private
     * @type {number} _offsetToHeadChunk1 Offset to HEAD chunk part 1, relative to beginning of file
     */
    this._offsetToHeadChunk1 =
      this._offsetToHead +
      getSliceAsNumber(this.rawData, this._offsetToHead + 0x0c, 4) +
      0x08;
    /**
     * @private
     * @type {number} _offsetToHeadChunk2 Offset to HEAD chunk part 2, relative to beginning of file
     */
    this._offsetToHeadChunk2 =
      this._offsetToHead +
      getSliceAsNumber(this.rawData, this._offsetToHead + 0x14, 4) +
      0x08;
    /**
     * @private
     * @type {number} _offsetToHeadChunk3 Offset to HEAD chunk part 3, relative to beginning of file
     */
    this._offsetToHeadChunk3 =
      this._offsetToHead +
      getSliceAsNumber(this.rawData, this._offsetToHead + 0x1c, 4) +
      0x08;
    /**
     * @private
     * @type {number} _offsetToAdpc Offset to ADPC chunk, relative to beginning of file
     */
    this._offsetToAdpc = getSliceAsNumber(this.rawData, 0x18, 4);
    /**
     * @private
     * @type {number} _offsetToData Offset to DATA, relative to beginning of file
     */
    this._offsetToData = getSliceAsNumber(this.rawData, 0x20, 4);

    /**
     * @type {Metadata} metadata
     */
    this.metadata = this._getMetadata();

    /**
     * @private
     * @type {Array<Int16Array>} _cachedSamples per-channel samples
     */
    this._cachedSamples = null;

    this._cachedBlock = [];
    this._currentCachedBlock = -1;
    this._returnBuffer = true;
    this._currentBlockData = [];
    this._partitionedAdpcChunkData = [];
    this._cachedChannelInfo = [];
    this._resultBuffer = [];
    for (let c = 0; c < this.metadata.numberChannels; c++) {
      this._currentBlockData.push(new Uint8Array(this.metadata.blockSize));
      this._resultBuffer.push(new Int16Array(this.metadata.samplesPerBlock));
    }
  }

  /**
   * @returns {Array<ChannelInfo>}
   */
  _getChannelInfo() {
    const { numberChannels } = this.metadata;
    const channelInfo = [];

    for (let c = 0; c < numberChannels; c++) {
      const offsetToChannelInfo =
        this._offsetToHead +
        getSliceAsNumber(
          this.rawData,
          this._offsetToHeadChunk3 + 0x08 + c * 8,
          4
        ) +
        0x08 +
        8;
      /**
       * @type {Array<number>}
       */
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
        ),
      });
    }

    return channelInfo;
  }

  _getMetadata() {
    const numberChannels = getSliceAsNumber(
      this.rawData,
      this._offsetToHeadChunk1 + 0x0002,
      1
    );
    /**
     * @type {Metadata}
     */
    const metadata = {
      fileSize: getSliceAsNumber(this.rawData, 8, 4),
      codec: getSliceAsNumber(this.rawData, this._offsetToHeadChunk1, 1),
      loopFlag: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0001,
        1
      ),
      numberChannels,
      sampleRate: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0004,
        2
      ),
      loopStartSample: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0008,
        4
      ),
      totalSamples: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x000c,
        4
      ),
      totalBlocks: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0014,
        4
      ),
      blockSize: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0018,
        4
      ),
      samplesPerBlock: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x001c,
        4
      ),
      finalBlockSize: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0020,
        4
      ),
      finalBlockSizeWithPadding: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0028,
        4
      ),
      totalSamplesInFinalBlock: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0024,
        4
      ),
      adpcTableSamplesPerEntry: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x002c,
        4
      ),
      adpcTableBytesPerEntry: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk1 + 0x0030,
        4
      ),
      numberTracks: getSliceAsNumber(this.rawData, this._offsetToHeadChunk2, 1),
      trackDescriptionType: getSliceAsNumber(
        this.rawData,
        this._offsetToHeadChunk2 + 0x01,
        1
      ),
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
      finalBlockSizeWithPadding,
    } = this.metadata;

    const dataDataSize = getSliceAsNumber(
      this.rawData,
      this._offsetToData + 0x04,
      4
    );

    // `rawData` here is data chunk's raw data
    const rawData = this.rawData.slice(
      this._offsetToData + 0x20,
      this._offsetToData + 0x20 + dataDataSize
    );
    let result = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(new Uint8Array(rawData.length / numberChannels));
    }
    for (let b = 0; b < totalBlocks; b++) {
      for (let c = 0; c < numberChannels; c++) {
        const rawDataOffset =
          // Final block on non-zero channel: need to consider the previous channels' finalBlockSizeWithPadding!
          c !== 0 && b + 1 === totalBlocks
            ? b * numberChannels * blockSize + c * finalBlockSizeWithPadding
            : (b * numberChannels + c) * blockSize;
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

  /**
   * Read only one block
   * @returns {Array<Uint8Array>} array of non-interlaced raw data; each array represents one channel
   */
  _getPartitionedBlockData(block) {
    const {
      blockSize,
      totalBlocks,
      numberChannels,
      finalBlockSize,
      finalBlockSizeWithPadding,
    } = this.metadata;

    let b = block;
    for (let c = 0; c < numberChannels; c++) {
      const rawDataOffset =
        // Final block on non-zero channel: need to consider the previous channels' finalBlockSizeWithPadding!
        c !== 0 && b + 1 === totalBlocks
          ? b * numberChannels * blockSize + c * finalBlockSizeWithPadding
          : (b * numberChannels + c) * blockSize;
      const rawDataEnd =
        b + 1 === totalBlocks
          ? rawDataOffset + finalBlockSize
          : rawDataOffset + blockSize;

      for (let i = 0; i < rawDataEnd - rawDataOffset; i++) {
        this._currentBlockData[c][i] = this.rawData[
          this._offsetToData + 0x20 + rawDataOffset + i
        ];
      }
    }
    return this._currentBlockData;
  }

  _getPartitionedAdpcChunkData() {
    const { totalBlocks, numberChannels } = this.metadata;
    const adpcDataSize = getSliceAsNumber(
      this.rawData,
      this._offsetToAdpc + 0x04,
      4
    );

    // `rawData` here is adpc chunk's raw data
    const rawData = this.rawData.slice(
      this._offsetToAdpc + 0x08,
      this._offsetToAdpc + 0x08 + adpcDataSize
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
          yn2,
        };
      }
    }
    return result;
  }

  /**
   *
   * @returns {Array<Int16Array>} per-channel samples
   */
  getAllSamples() {
    if (this._cachedSamples) {
      return this._cachedSamples;
    }

    /**
     * @type {Array<Array<{yn1: number, yn2: number}>>} adpcChunkData array of numberChannels x totalBlocks, each containing yn1 and yn2, representing the history sample 1 and 2 of that channel & block
     */
    const adpcChunkData = this._getPartitionedAdpcChunkData();
    /**
     * @type {Array<Uint8Array>} dataChunkData array of non-interlaced raw data; each array represents one channel
     */
    const dataChunkData = this._getPartitionedDataChunkData();

    const {
      numberChannels,
      totalSamples,
      totalBlocks,
      blockSize,
      finalBlockSize,
      totalSamplesInFinalBlock,
      samplesPerBlock,
      codec,
    } = this.metadata;
    const channelInfo = this._getChannelInfo();

    const result = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(new Int16Array(totalSamples));
    }

    for (let c = 0; c < numberChannels; c++) {
      const { adpcmCoefficients } = channelInfo[c];

      // Length should be = (totalBlocks - 1) * blockSize + finalBlockSize
      const channelDataChunkData = dataChunkData[c];

      // TODO: This loop seemed to be replacable with `this.getBuffer(b * blockSize, totalSamplesInBlock)`
      for (let b = 0; b < totalBlocks; b++) {
        const blockData =
          b === totalBlocks - 1
            ? channelDataChunkData.slice(
                b * blockSize,
                b * blockSize + finalBlockSize
              )
            : channelDataChunkData.slice(b * blockSize, (b + 1) * blockSize);
        const totalSamplesInBlock =
          b === totalBlocks - 1 ? totalSamplesInFinalBlock : samplesPerBlock;

        /**
         * @type {Array<number>}
         */
        const sampleResult = [];
        if (codec === 2) {
          // 4-bit ADPCM
          const ps = blockData[0];
          const { yn1, yn2 } = adpcChunkData[c][b];

          // #region Magic adapted from brawllib's ADPCMState.cs
          let cps = ps,
            cyn1 = yn1,
            cyn2 = yn2,
            dataIndex = 0;

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

          // #endregion
          // console.log('>>', c, b, yn1, yn2, ps, blockData, sampleResult);
        } else if (codec === 1) {
          // 16-bit PCM
          for (
            let sampleIndex = 0;
            sampleIndex < totalSamplesInBlock;
            sampleIndex++
          ) {
            const result = getInt16(
              getSliceAsNumber(blockData, sampleIndex * 2, 2)
            );
            sampleResult.push(result);
          }
        } else if (codec === 0) {
          // 8-bit PCM
          for (
            let sampleIndex = 0;
            sampleIndex < totalSamplesInBlock;
            sampleIndex++
          ) {
            sampleResult.push(getInt16(blockData[sampleIndex]));
          }
        } else {
          throw new Error('Invalid codec');
        }

        result[c].set(sampleResult, b * samplesPerBlock);
      }
    }

    this._cachedSamples = result;

    return result;
  }

  /**
   * Same as `getSamples`
   *
   * @deprecated Please use `getSamples`
   *
   * @param {number} offset
   * @param {number} size
   * @returns {Array<Int16Array>} per-channel samples from `offset`-th sample until `(offset + size - 1)`-th sample
   */
  getBuffer(offset, size) {
    return this.getSamples(offset, size);
  }

  /**
   * Get buffer of Int16 samples
   *
   *
   * Make sure to not ask for anything outside the file!
   *
   * Example:
   * - Total samples: 10000
   * - brstm.getSamples(8000, 4000); is invalid
   *
   * @param {number} offset
   * @param {number} size
   * @returns {Array<Int16Array>} per-channel samples from `offset`-th sample until `(offset + size - 1)`-th sample
   */
  getSamples(offset, size) {
    const {
      numberChannels,
      totalBlocks,
      totalSamplesInFinalBlock,
      samplesPerBlock,
      codec,
    } = this.metadata;

    let b = (offset / samplesPerBlock) | 0;

    if (this._currentCachedBlock !== b) {
      // Decode new block

      if (this._partitionedAdpcChunkData.length === 0) {
        this._partitionedAdpcChunkData = this._getPartitionedAdpcChunkData();
      }
      /**
       * ADPC chunk data
       * @type {Array<Array<{yn1: number, yn2: number}>>} adpcChunkData array of numberChannels x totalBlocks, each containing yn1 and yn2, representing the history sample 1 and 2 of that channel & block
       */
      const adpcChunkData = this._partitionedAdpcChunkData;

      /**
       * Read current block's data
       * @type {Array<Uint8Array>} dataChunkData array of non-interlaced raw data; each array represents one channel
       */
      const blockData = this._getPartitionedBlockData(b);

      // Channel info
      if (!this._cachedChannelInfo) {
        this._cachedChannelInfo = this._getChannelInfo();
      }
      const channelInfo = this._cachedChannelInfo;

      // Cached decoded block data (will be filled now)
      if (!this._cachedBlock) {
        for (let c = 0; c < numberChannels; c++) {
          this._cachedBlock.push(new Int16Array(samplesPerBlock));
        }
      }

      for (let c = 0; c < numberChannels; c++) {
        const { adpcmCoefficients } = channelInfo[c];

        const totalSamplesInBlock =
          b === totalBlocks - 1 ? totalSamplesInFinalBlock : samplesPerBlock;
        if (codec === 2) {
          // 4-bit ADPCM
          const ps = blockData[c][0];
          const { yn1, yn2 } = adpcChunkData[c][b];

          // #region Magic adapted from brawllib's ADPCMState.cs
          let cps = ps,
            cyn1 = yn1,
            cyn2 = yn2,
            dataIndex = 0;

          for (let sampleIndex = 0; sampleIndex < totalSamplesInBlock; ) {
            let outSample = 0;
            if (sampleIndex % 14 === 0) {
              cps = blockData[c][dataIndex++];
            }
            if ((sampleIndex++ & 1) === 0) {
              outSample = blockData[c][dataIndex] >> 4;
            } else {
              outSample = blockData[c][dataIndex++] & 0x0f;
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

            this._cachedBlock[c][sampleIndex] = cyn1;
          }

          // #endregion
          // console.log('>>', c, b, yn1, yn2, ps, blockData, sampleResult);
        } else if (codec === 1) {
          // 16-bit PCM
          for (
            let sampleIndex = 0;
            sampleIndex < totalSamplesInBlock;
            sampleIndex++
          ) {
            const result = getInt16(
              getSliceAsNumber(blockData[c], sampleIndex * 2, 2)
            );
            this._cachedBlock[c][sampleIndex] = result;
          }
        } else if (codec === 0) {
          // 8-bit PCM
          for (
            let sampleIndex = 0;
            sampleIndex < totalSamplesInBlock;
            sampleIndex++
          ) {
            this._cachedBlock[c][sampleIndex] = getInt16(
              blockData[c][sampleIndex]
            );
          }
        } else {
          throw new Error('Invalid codec');
        }
        // Retype the block that is currently stored in _cachedBlock
        this._currentCachedBlock = b;
      }
    }

    if (this._returnBuffer) {
      // Make and return the requested buffer
      let blockEndReached = false;
      let blockEndReachedAt = 0;
      for (let c = 0; c < numberChannels; c++) {
        // Offset in current block
        let dataIndex =
          offset - samplesPerBlock * ((offset / samplesPerBlock) | 0);
        for (let p = 0; p < size; p++) {
          if (dataIndex + p >= samplesPerBlock) {
            blockEndReached = true;
            blockEndReachedAt = p;
            break;
          }
          this._resultBuffer[c][p] = this._cachedBlock[c][dataIndex + p];
        }
      }
      if (blockEndReached) {
        // Don't make a new result buffer
        this._returnBuffer = false;
        this.getBuffer.bind(this)(offset + blockEndReachedAt, 0);
        this._returnBuffer = true;
        // Continue filling the result buffer
        for (let c = 0; c < numberChannels; c++) {
          let dataIndex = 0;
          for (let p = blockEndReachedAt; p < size; p++) {
            this._resultBuffer[c][p] = this._cachedBlock[c][dataIndex++];
          }
        }
      }
      return this._resultBuffer;
    }
  }
}
