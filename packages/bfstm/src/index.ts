import {
  getSliceAsString,
  getSliceAsNumber,
  getInt16,
  clamp,
  getEndianness,
} from '@nikku/utils';
import type { Endianness } from '@nikku/utils';
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
export class Bfstm {
  rawData: Uint8Array;
  endianness: Endianness;
  versionNumber: number;
  metadata: Metadata;

  #offsetToInfo: number;
  #offsetToStreamInfo: number;
  #offsetToSeek: number;
  #offsetToData: number;

  #cachedSamples: null | Array<Int16Array> = null;
  #partitionedSeekData: null | Array<Array<{ yn1: number; yn2: number }>> =
    null;
  #cachedChannelInfo: null | ChannelInfo[] = null;
  /** per-channel (`c`) samples at block `b`. Access by this.#cachedBlockResults[b][c] */
  #cachedBlockResults: Array<Array<Int16Array>> = [];

  constructor(arrayBuffer: ArrayBuffer) {
    /**
     * @type {Uint8Array} rawData
     */
    this.rawData = new Uint8Array(arrayBuffer);

    if (getSliceAsString(this.rawData, 0, 4) !== 'FSTM') {
      throw new Error('Not a valid BFSTM file');
    }

    this.endianness = getEndianness(this.rawData);
    this.versionNumber = getSliceAsNumber(
      this.rawData,
      0x08,
      4,
      this.endianness
    );
    this.#offsetToInfo = getSliceAsNumber(
      this.rawData,
      0x18,
      4,
      this.endianness
    );
    this.#offsetToStreamInfo =
      this.#offsetToInfo +
      getSliceAsNumber(
        this.rawData,
        this.#offsetToInfo + 0x0c,
        4,
        this.endianness
      ) +
      0x08;
    this.#offsetToSeek = getSliceAsNumber(
      this.rawData,
      0x24,
      4,
      this.endianness
    );
    this.#offsetToData = getSliceAsNumber(
      this.rawData,
      0x30,
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

    // offsetToChannelInfo: points to the reference table for channel info entries
    const offsetToChannelInfo =
      this.#offsetToInfo +
      getSliceAsNumber(
        this.rawData,
        this.#offsetToInfo + 0x1c,
        4,
        this.endianness
      ) +
      0x08;

    const channelInfo: Array<ChannelInfo> = [];

    for (let c = 0; c < numberChannels; c++) {
      // Reference table entry for channel c: each entry is 8 bytes (2 type + 2 pad + 4 offset)
      // The offset is relative to the start of the reference table (offsetToChannelInfo)
      const refEntryOffset = getSliceAsNumber(
        this.rawData,
        offsetToChannelInfo + 0x04 + c * 8 + 0x04,
        4,
        this.endianness
      );
      const channelInfoEntryAddr = offsetToChannelInfo + refEntryOffset;

      // Each channel info entry: 2-byte type + 2-byte pad + 4-byte offset to DSP ADPCM info
      // The ADPCM offset is relative to the start of the channel info entry
      const adpcmOffset = getSliceAsNumber(
        this.rawData,
        channelInfoEntryAddr + 0x04,
        4,
        this.endianness
      );
      const adpcmInfoAddr = channelInfoEntryAddr + adpcmOffset;

      const adpcmCoefficients: Array<number> = [];
      for (let i = 0; i < 16; i++) {
        adpcmCoefficients.push(
          getInt16(
            getSliceAsNumber(
              this.rawData,
              adpcmInfoAddr + i * 2,
              2,
              this.endianness
            )
          )
        );
      }

      channelInfo.push({
        adpcmCoefficients,
        gain: getSliceAsNumber(
          this.rawData,
          adpcmInfoAddr + 0x20,
          2,
          this.endianness
        ),
        initialPredictorScale: getSliceAsNumber(
          this.rawData,
          adpcmInfoAddr + 0x22,
          2,
          this.endianness
        ),
        historySample1: getInt16(
          getSliceAsNumber(
            this.rawData,
            adpcmInfoAddr + 0x24,
            2,
            this.endianness
          )
        ),
        historySample2: getInt16(
          getSliceAsNumber(
            this.rawData,
            adpcmInfoAddr + 0x26,
            2,
            this.endianness
          )
        ),
        loopPredictorScale: getSliceAsNumber(
          this.rawData,
          adpcmInfoAddr + 0x28,
          2,
          this.endianness
        ),
        loopHistorySample1: getInt16(
          getSliceAsNumber(
            this.rawData,
            adpcmInfoAddr + 0x2a,
            2,
            this.endianness
          )
        ),
        loopHistorySample2: getInt16(
          getSliceAsNumber(
            this.rawData,
            adpcmInfoAddr + 0x2c,
            2,
            this.endianness
          )
        ),
      });
    }

    this.#cachedChannelInfo = channelInfo;
    return channelInfo;
  }

  #getMetadata(): Metadata {
    const offsetToStreamInfo = this.#offsetToStreamInfo;

    // Track info flag at INFO + 0x10; if 0, track info is not used
    const trackInfoFlag = getSliceAsNumber(
      this.rawData,
      this.#offsetToInfo + 0x10,
      2,
      this.endianness
    );

    let numberTracks = 0;
    let trackDescriptionType = 0;
    const trackDescriptions: Array<TrackDescription> = [];

    if (trackInfoFlag !== 0) {
      const offsetToTrackInfo =
        this.#offsetToInfo +
        getSliceAsNumber(
          this.rawData,
          this.#offsetToInfo + 0x14,
          4,
          this.endianness
        ) +
        0x08;

      // Reference table: 4-byte count, then entries of 8 bytes each
      numberTracks = getSliceAsNumber(
        this.rawData,
        offsetToTrackInfo,
        4,
        this.endianness
      );
      trackDescriptionType = 1;

      for (let t = 0; t < numberTracks; t++) {
        // Each reference table entry is 8 bytes: 2-byte type + 2-byte pad + 4-byte offset
        // Offset is relative to start of reference table entry
        const refEntryOffset = getSliceAsNumber(
          this.rawData,
          offsetToTrackInfo + 0x04 + t * 8 + 0x04,
          4,
          this.endianness
        );
        const trackStructAddr =
          offsetToTrackInfo + 0x04 + t * 8 + refEntryOffset;

        // Track struct: volume(1) + pan(1) + span(1) + flags(1) + globalChanIdxTableFlag(2) + pad(2) + globalChanIdxOffset(4)
        const globalChanIdxOffset = getSliceAsNumber(
          this.rawData,
          trackStructAddr + 0x08,
          4,
          this.endianness
        );
        const chanIdxTableAddr = trackStructAddr + globalChanIdxOffset;

        // Global channel index table: 4-byte count + count bytes of channel indices
        const numberChannelsInTrack = getSliceAsNumber(
          this.rawData,
          chanIdxTableAddr,
          4,
          this.endianness
        );

        trackDescriptions.push({
          numberChannels: numberChannelsInTrack,
          type: 1,
        });
      }
    }

    const metadata: Metadata = {
      fileSize: getSliceAsNumber(this.rawData, 0x0c, 4, this.endianness),
      endianness: this.endianness,
      codec: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo,
        1,
        this.endianness
      ) as CodecType,
      loopFlag: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x01,
        1,
        this.endianness
      ),
      numberChannels: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x02,
        1,
        this.endianness
      ),
      numberRegions: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x03,
        1,
        this.endianness
      ),
      sampleRate: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x04,
        4,
        this.endianness
      ),
      loopStartSample: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x08,
        4,
        this.endianness
      ),
      totalSamples: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x0c,
        4,
        this.endianness
      ),
      totalBlocks: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x10,
        4,
        this.endianness
      ),
      blockSize: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x14,
        4,
        this.endianness
      ),
      samplesPerBlock: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x18,
        4,
        this.endianness
      ),
      finalBlockSize: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x1c,
        4,
        this.endianness
      ),
      totalSamplesInFinalBlock: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x20,
        4,
        this.endianness
      ),
      finalBlockSizeWithPadding: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x24,
        4,
        this.endianness
      ),
      adpcTableBytesPerEntry: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x28,
        4,
        this.endianness
      ),
      adpcTableSamplesPerEntry: getSliceAsNumber(
        this.rawData,
        offsetToStreamInfo + 0x2c,
        4,
        this.endianness
      ),
      numberTracks,
      trackDescriptionType,
      trackDescriptions,
    };

    if (metadata.loopStartSample >= metadata.totalSamples) {
      metadata.loopFlag = 0;
      metadata.loopStartSample = 0;
      console.warn('The loop start sample in this file is invalid.');
    }

    if (metadata.numberTracks === 0) {
      // No explicit track info: synthesize one track covering all channels
      metadata.numberTracks = 1;
      metadata.trackDescriptionType = 1;
      metadata.trackDescriptions = [
        { numberChannels: metadata.numberChannels, type: 1 },
      ];
    }

    return metadata;
  }

  /**
   * @returns {Array<Array<{yn1: number, yn2: number}>>}
   */
  #getPartitionedSeekData(): Array<Array<{ yn1: number; yn2: number }>> {
    if (this.#partitionedSeekData) {
      return this.#partitionedSeekData;
    }

    const { totalBlocks, numberChannels } = this.metadata;

    // SEEK section: 4-byte magic + 4-byte size = 0x08 bytes header
    // Layout: HistoryInfo[totalBlocks][numberChannels], 4 bytes each (Int16 yn1 + Int16 yn2)
    const seekDataStart = this.#offsetToSeek + 0x08;

    const result: Array<Array<{ yn1: number; yn2: number }>> = [];
    for (let c = 0; c < numberChannels; c++) {
      result.push([]);
    }

    for (let b = 0; b < totalBlocks; b++) {
      for (let c = 0; c < numberChannels; c++) {
        const entryOffset = seekDataStart + (b * numberChannels + c) * 4;
        const yn1 = getInt16(
          getSliceAsNumber(this.rawData, entryOffset, 2, this.endianness)
        );
        const yn2 = getInt16(
          getSliceAsNumber(this.rawData, entryOffset + 2, 2, this.endianness)
        );
        result[c].push({ yn1, yn2 });
      }
    }

    this.#partitionedSeekData = result;
    return result;
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

    const b = block;
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
    const seekData = this.#getPartitionedSeekData();

    const result = [];
    const totalSamplesInBlock =
      b === totalBlocks - 1 ? totalSamplesInFinalBlock : samplesPerBlock;

    for (let c = 0; c < numberChannels; c++) {
      result.push(new Int16Array(totalSamplesInBlock));
    }

    for (let c = 0; c < numberChannels; c++) {
      const { adpcmCoefficients } = channelInfo[c];
      const blockData = allChannelsBlockData[c];

      const sampleResult: Array<number> = [];
      if (codec === 2) {
        // 4-bit DSP ADPCM
        const ps = blockData[0];
        const { yn1, yn2 } = seekData[c][b];

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
          seekData[c][b + 1].yn1 = sampleResult[totalSamplesInBlock - 1];
          seekData[c][b + 1].yn2 = sampleResult[totalSamplesInBlock - 2];
        }
      } else if (codec === 1) {
        // 16-bit PCM
        for (
          let sampleIndex = 0;
          sampleIndex < totalSamplesInBlock;
          sampleIndex++
        ) {
          sampleResult.push(
            getInt16(
              getSliceAsNumber(blockData, sampleIndex * 2, 2, this.endianness)
            )
          );
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
      } else if (codec === 3) {
        throw new Error('IMA ADPCM codec is not supported');
      } else {
        throw new Error('Invalid codec');
      }

      result[c].set(sampleResult);
    }

    this.#cachedBlockResults[b] = result;
    return result;
  }

  /**
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
   * Get buffer of Int16 samples
   *
   * Make sure to not ask for anything outside the file!
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

    const transformedResult: Array<Int16Array> = [];
    for (let c = 0; c < numberChannels; c++) {
      transformedResult.push(new Int16Array(sampleEnd - sampleStart));
    }

    for (let b = blockIndexStart; b <= blockIndexEnd; b++) {
      const resultBlockIndex = b - blockIndexStart;
      if (b === blockIndexStart && b === blockIndexEnd) {
        for (let c = 0; c < numberChannels; c++) {
          transformedResult[c].set(
            result[resultBlockIndex][c].slice(
              sampleStart - blockIndexStart * samplesPerBlock,
              sampleStart - blockIndexStart * samplesPerBlock + size
            ),
            0
          );
        }
      } else if (b === blockIndexStart) {
        for (let c = 0; c < numberChannels; c++) {
          const slice = result[resultBlockIndex][c].slice(
            sampleStart - blockIndexStart * samplesPerBlock
          );
          transformedResult[c].set(slice, 0);
        }
      } else if (b === blockIndexEnd) {
        for (let c = 0; c < numberChannels; c++) {
          const slice = result[resultBlockIndex][c].slice(
            0,
            sampleEnd -
              result[resultBlockIndex][c].length -
              blockIndexStart * samplesPerBlock
          );
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
            result[resultBlockIndex][c],
            b * samplesPerBlock - sampleStart
          );
        }
      }
    }
    return transformedResult;
  }
}
