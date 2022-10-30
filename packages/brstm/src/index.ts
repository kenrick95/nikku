import {
  getSliceAsString,
  getSliceAsNumber,
  getInt16,
  clamp,
  getEndianness,
} from './utils';
import type { Endianness } from './utils';
import type {
  ChannelInfo,
  CodecType,
  Metadata,
  TrackDescription,
} from './types';

export * from './types';

declare var console: any;

/**
 * @class
 */
export class Brstm {
  rawData: Uint8Array;
  endianness: Endianness;
  /** Offset to HEAD chunk, relative to beginning of file */
  #offsetToHead: number;
  /** Offset to HEAD chunk part 1, relative to beginning of file */
  #offsetToHeadChunk1: number;
  /** Offset to HEAD chunk part 2, relative to beginning of file */
  #offsetToHeadChunk2: number;
  /** Offset to HEAD chunk part 3, relative to beginning of file */
  #offsetToHeadChunk3: number;
  /** Offset to ADPC chunk, relative to beginning of file */
  #offsetToAdpc: number;
  /** Offset to DATA, relative to beginning of file */
  #offsetToData: number;
  metadata: Metadata;
  /** per-channel samples */
  #cachedSamples: null | Array<Int16Array> = null;
  #partitionedAdpcChunkData: null | Array<Array<{ yn1: number; yn2: number }>> =
    null;
  #cachedChannelInfo: null | ChannelInfo[] = null;
  /** per-channel (`c`) samples at block `b`. Access by this.#cachedBlockResults[b][c] */
  #cachedBlockResults: Array<Array<Int16Array>> = [];

  constructor(arrayBuffer: ArrayBuffer) {
    /**
     * @type {Uint8Array} rawData
     */
    this.rawData = new Uint8Array(arrayBuffer);

    if (getSliceAsString(this.rawData, 0, 4) !== 'RSTM') {
      throw new Error('Not a valid BRSTM file');
    }

    this.endianness = getEndianness(this.rawData);

    this.#offsetToHead = getSliceAsNumber(
      this.rawData,
      0x10,
      4,
      this.endianness
    );
    this.#offsetToHeadChunk1 =
      this.#offsetToHead +
      getSliceAsNumber(
        this.rawData,
        this.#offsetToHead + 0x0c,
        4,
        this.endianness
      ) +
      0x08;
    this.#offsetToHeadChunk2 =
      this.#offsetToHead +
      getSliceAsNumber(
        this.rawData,
        this.#offsetToHead + 0x14,
        4,
        this.endianness
      ) +
      0x08;
    this.#offsetToHeadChunk3 =
      this.#offsetToHead +
      getSliceAsNumber(
        this.rawData,
        this.#offsetToHead + 0x1c,
        4,
        this.endianness
      ) +
      0x08;
    this.#offsetToAdpc = getSliceAsNumber(
      this.rawData,
      0x18,
      4,
      this.endianness
    );
    this.#offsetToData = getSliceAsNumber(
      this.rawData,
      0x20,
      4,
      this.endianness
    );

    this.metadata = this.#getMetadata();
  }

  #getChannelInfo(): Array<ChannelInfo> {
    if (this.#cachedChannelInfo) {
      return this.#cachedChannelInfo;
    }
    const { numberChannels } = this.metadata;
    const channelInfo = [];

    for (let c = 0; c < numberChannels; c++) {
      const offsetToChannelInfo =
        this.#offsetToHead +
        getSliceAsNumber(
          this.rawData,
          this.#offsetToHeadChunk3 + 0x08 + c * 8,
          4,
          this.endianness
        ) +
        0x08 +
        8;
      /**
       * @type {Array<number>}
       */
      const adpcmCoefficients: Array<number> = [];
      for (let i = 0; i < 16; i++) {
        const num = getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 2 * i,
          2,
          this.endianness
        );
        // Covert number to int16
        adpcmCoefficients.push(getInt16(num));
      }

      channelInfo.push({
        adpcmCoefficients,
        gain: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x28,
          2,
          this.endianness
        ),

        initialPredictorScale: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x2a,
          2,
          this.endianness
        ),

        historySample1: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x2c,
          2,
          this.endianness
        ),

        historySample2: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x2e,
          2,
          this.endianness
        ),

        loopPredictorScale: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x30,
          2,
          this.endianness
        ),

        loopHistorySample1: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x32,
          2,
          this.endianness
        ),

        loopHistorySample2: getSliceAsNumber(
          this.rawData,
          offsetToChannelInfo + 0x34,
          2,
          this.endianness
        ),
      });
    }
    this.#cachedChannelInfo = channelInfo;
    return channelInfo;
  }

  #getMetadata() {
    const numberChannels = getSliceAsNumber(
      this.rawData,
      this.#offsetToHeadChunk1 + 0x0002,
      1,
      this.endianness
    );
    const numberTracks = getSliceAsNumber(
      this.rawData,
      this.#offsetToHeadChunk2,
      1,
      this.endianness
    );
    const trackDescriptionType = getSliceAsNumber(
      this.rawData,
      this.#offsetToHeadChunk2 + 0x01,
      1,
      this.endianness
    );
    const trackDescriptions: Array<TrackDescription> = [];

    for (let t = 0; t < numberTracks; t++) {
      const offsetToTrackDescriptionEntry =
        this.#offsetToHead +
        0x08 +
        getSliceAsNumber(
          this.rawData,
          this.#offsetToHeadChunk2 + 0x04 + t * 8 + 0x04,
          4,
          this.endianness
        );

      const trackDescriptionType = getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk2 + 0x04 + t * 8 + 0x01,
        1,
        this.endianness
      );

      let numberChannelsInTrack = 0;
      if (trackDescriptionType === 0) {
        numberChannelsInTrack = getSliceAsNumber(
          this.rawData,
          offsetToTrackDescriptionEntry,
          1,
          this.endianness
        );
      } else if (trackDescriptionType === 1) {
        numberChannelsInTrack = getSliceAsNumber(
          this.rawData,
          offsetToTrackDescriptionEntry + 0x0008,
          1,
          this.endianness
        );
      }
      trackDescriptions.push({
        numberChannels: numberChannelsInTrack,
        type: trackDescriptionType,
      });
    }

    /**
     * @type {Metadata}
     */
    const metadata: Metadata = {
      fileSize: getSliceAsNumber(this.rawData, 8, 4, this.endianness),
      endianness: this.endianness,
      codec: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1,
        1,
        this.endianness
      ) as CodecType,
      loopFlag: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0001,
        1,
        this.endianness
      ),
      numberChannels,
      sampleRate: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0004,
        2,
        this.endianness
      ),
      loopStartSample: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0008,
        4,
        this.endianness
      ),
      totalSamples: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x000c,
        4,
        this.endianness
      ),
      totalBlocks: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0014,
        4,
        this.endianness
      ),
      blockSize: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0018,
        4,
        this.endianness
      ),
      samplesPerBlock: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x001c,
        4,
        this.endianness
      ),
      finalBlockSize: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0020,
        4,
        this.endianness
      ),
      finalBlockSizeWithPadding: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0028,
        4,
        this.endianness
      ),
      totalSamplesInFinalBlock: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0024,
        4,
        this.endianness
      ),
      adpcTableSamplesPerEntry: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x002c,
        4,
        this.endianness
      ),
      adpcTableBytesPerEntry: getSliceAsNumber(
        this.rawData,
        this.#offsetToHeadChunk1 + 0x0030,
        4,
        this.endianness
      ),
      numberTracks,
      trackDescriptionType,
      trackDescriptions,
    };

    // Check if loop point is valid
    if (metadata.loopStartSample >= metadata.totalSamples) {
      metadata.loopFlag = 0;
      metadata.loopStartSample = 0;
      console.warn('The loop start sample in this file is invalid.');
    }

    return metadata;
  }

  /**
   * Read only one block
   * @param {number} block block index
   * @returns {Array<Uint8Array>} array of non-interlaced raw data; each array represents one channel
   */
  #getPartitionedBlockData(block: number): Array<Uint8Array> {
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
        this.#offsetToData + 0x20 + rawDataOffset,
        this.#offsetToData + 0x20 + rawDataEnd
      );
      result[c].set(slice);
    }
    return result;
  }

  /**
   * @return {Array<Array<{yn1: number, yn2: number}>>}
   */
  #getPartitionedAdpcChunkData(): Array<Array<{ yn1: number; yn2: number }>> {
    if (this.#partitionedAdpcChunkData) {
      return this.#partitionedAdpcChunkData;
    }
    const { totalBlocks, numberChannels } = this.metadata;
    const adpcDataSize = getSliceAsNumber(
      this.rawData,
      this.#offsetToAdpc + 0x04,
      4,
      this.endianness
    );

    // `rawData` here is adpc chunk's raw data
    const rawData = this.rawData.slice(
      this.#offsetToAdpc + 0x08,
      this.#offsetToAdpc + 0x08 + adpcDataSize
    );

    let offset = 0;
    let yn1 = 0;
    let yn2 = 0;
    for (let c = 0; c < numberChannels; c++) {
      yn1 = getInt16(getSliceAsNumber(rawData, offset, 2, this.endianness));
      offset += 2;
      yn2 = getInt16(getSliceAsNumber(rawData, offset, 2, this.endianness));
      offset += 2;
    }

    /**
     * `transposedResult[b][c]`
     *
     * @type {Array<Array<{yn1: number, yn2: number}>>}
     */
    const transposedResult: Array<Array<{ yn1: number; yn2: number }>> = [];
    for (let b = 0; b < totalBlocks; b++) {
      transposedResult.push([]);
      for (let c = 0; c < numberChannels; c++) {
        if (b > 0) {
          yn1 = getInt16(getSliceAsNumber(rawData, offset, 2, this.endianness));
          offset += 2;
          yn2 = getInt16(getSliceAsNumber(rawData, offset, 2, this.endianness));
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
    let result: Array<Array<{ yn1: number; yn2: number }>> = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(
        transposedResult.map((r) => {
          return r[c];
        })
      );
    }

    this.#partitionedAdpcChunkData = result;
    return result;
  }

  /**
   *
   * @returns {Array<Int16Array>} per-channel samples
   */
  getAllSamples(): Array<Int16Array> {
    if (this.#cachedSamples) {
      return this.#cachedSamples;
    }

    const { numberChannels, totalSamples, totalBlocks, samplesPerBlock } =
      this.metadata;
    const result = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push(new Int16Array(totalSamples));
    }
    for (let b = 0; b < totalBlocks; b++) {
      const sampleResult = this.#getSamplesAtBlock(b);
      for (let c = 0; c < numberChannels; c++) {
        result[c].set(sampleResult[c], b * samplesPerBlock);
      }
    }

    this.#cachedSamples = result;

    return result;
  }

  /**
   *
   * @param {number} b blockIndex
   * @returns {Array<Int16Array>} per-channel samples in block `b`
   */
  #getSamplesAtBlock(b: number): Array<Int16Array> {
    if (this.#cachedBlockResults[b]) {
      return this.#cachedBlockResults[b];
    }

    const {
      numberChannels,
      totalBlocks,
      totalSamplesInFinalBlock,
      samplesPerBlock,
      codec,
    } = this.metadata;
    const channelInfo = this.#getChannelInfo();
    const allChannelsBlockData = this.#getPartitionedBlockData(b);
    const adpcChunkData = this.#getPartitionedAdpcChunkData();

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
      const sampleResult: Array<number> = [];
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
          adpcChunkData[c][b + 1].yn1 = sampleResult[totalSamplesInBlock - 1];
          adpcChunkData[c][b + 1].yn2 = sampleResult[totalSamplesInBlock - 2];
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
            getSliceAsNumber(blockData, sampleIndex * 2, 2, this.endianness)
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
          sampleResult.push(getInt16(blockData[sampleIndex]) * 256);
        }
      } else {
        throw new Error('Invalid codec');
      }

      result[c].set(sampleResult);
    }

    this.#cachedBlockResults[b] = result;

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
  getBuffer(offset: number, size: number): Array<Int16Array> {
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
  getSamples(offset: number, size: number): Array<Int16Array> {
    const { numberChannels, totalBlocks, totalSamples, samplesPerBlock } =
      this.metadata;

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
      result.push(this.#getSamplesAtBlock(b));
    }
    /**
     * @type {Array<Int16Array>}
     */
    const transformedResult: Array<Int16Array> = [];
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
          if (
            slice.length + (b * samplesPerBlock - sampleStart) >
            transformedResult[c].length
          ) {
            transformedResult[c].set(
              slice.slice(0, size - (b * samplesPerBlock - sampleStart)),
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
