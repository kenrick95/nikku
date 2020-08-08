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
     * @type {?Array<Int16Array>} _cachedSamples per-channel samples
     */
    this._cachedSamples = null;

    /**
     * @type {?Array<Array<{yn1: number, yn2: number}>>}
     */
    this._partitionedAdpcChunkData = null;

    /**
     * @type {?Array<ChannelInfo>}
     */
    this._cachedChannelInfo = null;

    /**
     * @private
     * @type {Array<Array<Int16Array>>} per-channel (`c) samples at block `b`. Access by _cachedBlockResults[b][c]
     */
    this._cachedBlockResults = [];
  }

  /**
   * @returns {Array<ChannelInfo>}
   */
  _getChannelInfo() {
    if (this._cachedChannelInfo) {
      return this._cachedChannelInfo;
    }
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
    this._cachedChannelInfo = channelInfo;
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
   * Read only one block
   * @param {number} block block index
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

    const result = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(
        new Uint8Array(block === totalBlocks - 1 ? finalBlockSize : blockSize)
      );
    }

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

      const slice = this.rawData.slice(
        this._offsetToData + 0x20 + rawDataOffset,
        this._offsetToData + 0x20 + rawDataEnd
      );
      result[c].set(slice);
    }
    return result;
  }

  /**
   * @return {Array<Array<{yn1: number, yn2: number}>>}
   */
  _getPartitionedAdpcChunkData() {
    if (this._partitionedAdpcChunkData) {
      return this._partitionedAdpcChunkData;
    }
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

    let offset = 0;
    let yn1 = 0;
    let yn2 = 0;
    for (let c = 0; c < numberChannels; c++) {
      yn1 = getInt16(getSliceAsNumber(rawData, offset, 2));
      offset += 2;
      yn2 = getInt16(getSliceAsNumber(rawData, offset, 2));
      offset += 2;
    }

    /**
     * `transposedResult[b][c]`
     *
     * @type {Array<Array<{yn1: number, yn2: number}>>}
     */
    const transposedResult = [];
    for (let b = 0; b < totalBlocks; b++) {
      transposedResult.push([]);
      for (let c = 0; c < numberChannels; c++) {
        if (b > 0) {
          yn1 = getInt16(getSliceAsNumber(rawData, offset, 2));
          offset += 2;
          yn2 = getInt16(getSliceAsNumber(rawData, offset, 2));
          offset += 2;
        }
        transposedResult[b].push({
          yn1,
          yn2,
        });
      }
    }

    /**
     * `result[c][b]`
     *
     * @type {Array<Array<{yn1: number, yn2: number}>>}
     */
    let result = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(
        transposedResult.map((r) => {
          return r[c];
        })
      );
    }

    this._partitionedAdpcChunkData = result;
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

    const {
      numberChannels,
      totalSamples,
      totalBlocks,
      samplesPerBlock,
    } = this.metadata;
    const result = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(new Int16Array(totalSamples));
    }
    for (let b = 0; b < totalBlocks; b++) {
      const sampleResult = this._getSamplesAtBlock(b);
      for (let c = 0; c < numberChannels; c++) {
        result[c].set(sampleResult[c], b * samplesPerBlock);
      }
    }

    this._cachedSamples = result;

    return result;
  }

  /**
   *
   * @param {number} b blockIndex
   * @returns {Array<Int16Array>} per-channel samples in block `b`
   */
  _getSamplesAtBlock(b) {
    if (this._cachedBlockResults[b]) {
      return this._cachedBlockResults[b];
    }

    const {
      numberChannels,
      totalBlocks,
      totalSamplesInFinalBlock,
      samplesPerBlock,
      codec,
    } = this.metadata;
    const channelInfo = this._getChannelInfo();
    const allChannelsBlockData = this._getPartitionedBlockData(b);
    const adpcChunkData = this._getPartitionedAdpcChunkData();

    const result = [];
    const totalSamplesInBlock =
      b === totalBlocks - 1 ? totalSamplesInFinalBlock : samplesPerBlock;

    for (let c = 0; c < numberChannels; c++) {
      result.push(new Int16Array(totalSamplesInBlock));
    }

    for (let c = 0; c < numberChannels; c++) {
      const { adpcmCoefficients } = channelInfo[c];
      const blockData = allChannelsBlockData[c];

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
        
        // Overwrite history samples for the next block with decoded samples
        if (b < totalBlocks - 1) {
          adpcChunkData[c][b+1].yn1 = sampleResult[totalSamplesInBlock - 1];
          adpcChunkData[c][b+1].yn2 = sampleResult[totalSamplesInBlock - 2];
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

      result[c].set(sampleResult);
    }

    this._cachedBlockResults[b] = result;

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
      totalSamples,
      samplesPerBlock,
    } = this.metadata;

    const sampleStart = Math.max(0, offset);
    const sampleEnd = Math.min(totalSamples, offset + size);
    const blockIndexStart = Math.max(
      0,
      Math.floor(sampleStart / samplesPerBlock)
    );
    const blockIndexEnd = Math.min(
      totalBlocks - 1,
      Math.floor(sampleEnd / samplesPerBlock)
    );
    const result = [];
    for (let b = blockIndexStart; b <= blockIndexEnd; b++) {
      result.push(this._getSamplesAtBlock(b));
    }
    /**
     * @type {Array<Int16Array>}
     */
    const transformedResult = [];
    for (let c = 0; c < numberChannels; c++) {
      transformedResult.push(new Int16Array(sampleEnd - sampleStart));
    }

    for (let b = blockIndexStart; b <= blockIndexEnd; b++) {
      const resulBlockIndex = b - blockIndexStart;
      if (b === blockIndexStart && b === blockIndexEnd) {
        // Slice `result[b][c]` so it starts at `offset` AND ends at `offset + size - 1`
        for (let c = 0; c < numberChannels; c++) {
          transformedResult[c].set(
            result[resulBlockIndex][c].slice(
              sampleStart - blockIndexStart * samplesPerBlock,
              sampleStart - blockIndexStart * samplesPerBlock + size
            ),
            0
          );
        }
      } else if (b === blockIndexStart) {
        // Slice `result[b][c]` so it starts at `offset`
        for (let c = 0; c < numberChannels; c++) {
          const slice = result[resulBlockIndex][c].slice(
            sampleStart - blockIndexStart * samplesPerBlock
          );
          transformedResult[c].set(slice, 0);
        }
      } else if (b === blockIndexEnd) {
        // Slice `result[b][c]` so it ends at the requested place (`offset + size - 1`)
        for (let c = 0; c < numberChannels; c++) {
          const slice = result[resulBlockIndex][c].slice(
            0,
            sampleEnd -
              result[resulBlockIndex][c].length -
              blockIndexStart * samplesPerBlock
          );
          // At the final block, the slice sometimes ends up too large
          // This is to prevent transformedResult from being overflowed
          if (slice.length + (b * samplesPerBlock - sampleStart) > transformedResult[c].length) {
            transformedResult[c].set(
                slice.slice(0, (4096 - (b * samplesPerBlock - sampleStart))),
                b * samplesPerBlock - sampleStart
            );
          } else {
            transformedResult[c].set(slice, b * samplesPerBlock - sampleStart);
          }
        }
      } else {
        for (let c = 0; c < numberChannels; c++) {
          transformedResult[c].set(
            result[resulBlockIndex][c],
            b * samplesPerBlock - sampleStart
          );
        }
      }
    }
    return transformedResult;
  }
}
