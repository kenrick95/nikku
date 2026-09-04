import type { CodecType, Endianness, Metadata, TrackDescription } from './types';

export * from './types';

type ChannelInfo = {
  adpcmCoefficients: Int16Array;
  initialPredictorScale: number;
  historySample1: number;
  historySample2: number;
  loopPredictorScale: number;
  loopHistorySample1: number;
  loopHistorySample2: number;
};

type AdpcmHistory = { yn1: number; yn2: number };

const INFO_BLOCK = 0x4000;
const SEEK_BLOCK = 0x4001;
const DATA_BLOCK = 0x4002;

/** Decoder for Nintendo BFSTM streamed-audio files. */
export class Bfstm {
  rawData: Uint8Array;
  endianness: Endianness;
  versionNumber: number;
  metadata: Metadata;

  #view: DataView;
  #littleEndian: boolean;
  #offsetToInfo = -1;
  #offsetToSeek = -1;
  #offsetToData = -1;
  #dataBlockEnd = -1;
  #audioDataOffset = -1;
  #streamInfoOffset = -1;
  #trackTableOffset = -1;
  #channelTableOffset = -1;
  #cachedSamples: Array<Int16Array> | null = null;
  #cachedChannelInfo: ChannelInfo[] | null = null;
  #cachedSeekData: Array<Array<AdpcmHistory>> | null = null;
  #cachedBlockResults: Array<Array<Int16Array> | undefined> = [];

  constructor(arrayBuffer: ArrayBuffer) {
    this.rawData = new Uint8Array(arrayBuffer);
    this.#view = new DataView(arrayBuffer);

    this.#assertRange(0, 0x14, 'BFSTM header');
    if (this.#getString(0, 4) !== 'FSTM') {
      throw new Error('Not a valid BFSTM file');
    }

    const bom = this.#view.getUint16(4, false);
    if (bom === 0xfeff) {
      this.endianness = 1;
      this.#littleEndian = false;
    } else if (bom === 0xfffe) {
      this.endianness = 0;
      this.#littleEndian = true;
    } else {
      throw new Error('Invalid BFSTM byte-order mark');
    }

    const headerSize = this.#uint16(0x06);
    this.versionNumber = this.#uint32(0x08);
    const fileSize = this.#uint32(0x0c);
    const sectionCount = this.#uint16(0x10);
    const sectionTableEnd = 0x14 + sectionCount * 0x0c;
    this.#assertRange(0, sectionTableEnd, 'BFSTM section table');
    if (headerSize < sectionTableEnd) {
      throw new Error('Invalid BFSTM header size');
    }
    if (fileSize > this.rawData.byteLength) {
      throw new Error('BFSTM file is shorter than its declared size');
    }

    for (let i = 0; i < sectionCount; i++) {
      const entryOffset = 0x14 + i * 0x0c;
      const type = this.#uint16(entryOffset);
      const offset = this.#int32(entryOffset + 0x04);
      const size = this.#uint32(entryOffset + 0x08);
      if (offset < 0) {
        continue;
      }
      this.#assertRange(offset, size, `BFSTM section 0x${type.toString(16)}`);

      if (type === INFO_BLOCK) {
        this.#offsetToInfo = offset;
      } else if (type === SEEK_BLOCK) {
        this.#offsetToSeek = offset;
      } else if (type === DATA_BLOCK) {
        this.#offsetToData = offset;
        this.#dataBlockEnd = offset + size;
      }
    }

    if (this.#offsetToInfo < 0 || this.#offsetToData < 0) {
      throw new Error('BFSTM is missing its INFO or DATA section');
    }
    this.#expectString(this.#offsetToInfo, 'INFO');
    this.#expectString(this.#offsetToData, 'DATA');
    if (this.#offsetToSeek >= 0) {
      this.#expectString(this.#offsetToSeek, 'SEEK');
    }

    const infoReferenceBase = this.#offsetToInfo + 0x08;
    this.#streamInfoOffset = this.#resolveReference(
      infoReferenceBase,
      infoReferenceBase,
      'stream info'
    );
    this.#trackTableOffset = this.#resolveOptionalReference(
      infoReferenceBase + 0x08,
      infoReferenceBase,
      'track table'
    );
    this.#channelTableOffset = this.#resolveOptionalReference(
      infoReferenceBase + 0x10,
      infoReferenceBase,
      'channel table'
    );

    this.metadata = this.#getMetadata(fileSize);
  }

  #getMetadata(fileSize: number): Metadata {
    const offset = this.#streamInfoOffset;
    this.#assertRange(offset, 0x38, 'BFSTM stream info');

    const codec = this.#uint8(offset) as CodecType;
    if (codec < 0 || codec > 3) {
      throw new Error(`Invalid BFSTM codec: ${codec}`);
    }
    if (codec === 3) {
      throw new Error('IMA ADPCM BFSTM files are not supported');
    }

    const numberChannels = this.#uint8(offset + 0x02);
    const totalSamples = this.#uint32(offset + 0x0c);
    const totalBlocks = this.#uint32(offset + 0x10);
    const samplesPerBlock = this.#uint32(offset + 0x18);
    const totalSamplesInFinalBlock = this.#uint32(offset + 0x20);
    if (
      numberChannels === 0 ||
      totalSamples === 0 ||
      totalBlocks === 0 ||
      samplesPerBlock === 0 ||
      totalSamplesInFinalBlock === 0
    ) {
      throw new Error('Invalid BFSTM stream geometry');
    }

    const audioReferenceOffset = this.#int32(offset + 0x34);
    if (audioReferenceOffset < 0) {
      throw new Error('BFSTM has no audio-data reference');
    }
    this.#audioDataOffset = this.#offsetToData + 0x08 + audioReferenceOffset;
    if (
      this.#audioDataOffset < this.#offsetToData + 0x08 ||
      this.#audioDataOffset > this.#dataBlockEnd
    ) {
      throw new Error('BFSTM audio-data reference is out of range');
    }

    const trackDescriptions = this.#getTrackDescriptions(numberChannels);
    const metadata: Metadata = {
      fileSize,
      endianness: this.endianness,
      codec,
      loopFlag: this.#uint8(offset + 0x01),
      numberChannels,
      numberRegions: this.#uint8(offset + 0x03),
      sampleRate: this.#uint32(offset + 0x04),
      loopStartSample: this.#uint32(offset + 0x08),
      totalSamples,
      totalBlocks,
      blockSize: this.#uint32(offset + 0x14),
      samplesPerBlock,
      finalBlockSize: this.#uint32(offset + 0x1c),
      totalSamplesInFinalBlock,
      finalBlockSizeWithPadding: this.#uint32(offset + 0x24),
      adpcTableBytesPerEntry: this.#uint32(offset + 0x28),
      adpcTableSamplesPerEntry: this.#uint32(offset + 0x2c),
      numberTracks: trackDescriptions.length,
      trackDescriptionType: 1,
      trackDescriptions,
    };

    if (metadata.sampleRate === 0) {
      throw new Error('Invalid BFSTM sample rate');
    }
    if (metadata.loopStartSample >= metadata.totalSamples) {
      metadata.loopFlag = 0;
      metadata.loopStartSample = 0;
    }
    return metadata;
  }

  #getTrackDescriptions(numberChannels: number): TrackDescription[] {
    if (this.#trackTableOffset < 0) {
      return this.#getDefaultTrackDescriptions(numberChannels);
    }

    const tableOffset = this.#trackTableOffset;
    this.#assertRange(tableOffset, 4, 'BFSTM track table');
    const trackCount = this.#uint32(tableOffset);
    if (trackCount === 0) {
      return this.#getDefaultTrackDescriptions(numberChannels);
    }
    this.#assertRange(tableOffset + 4, trackCount * 8, 'BFSTM track references');
    const tracks: TrackDescription[] = [];

    for (let track = 0; track < trackCount; track++) {
      const referenceOffset = tableOffset + 4 + track * 8;
      const trackInfoOffset = this.#resolveReference(
        referenceOffset,
        tableOffset,
        `track ${track}`
      );
      this.#assertRange(trackInfoOffset, 0x0c, `BFSTM track ${track}`);
      const channelIndexOffset = this.#resolveReference(
        trackInfoOffset + 4,
        trackInfoOffset,
        `track ${track} channel indexes`
      );
      this.#assertRange(channelIndexOffset, 4, `BFSTM track ${track} channels`);
      const channelCount = this.#uint32(channelIndexOffset);
      this.#assertRange(
        channelIndexOffset + 4,
        channelCount,
        `BFSTM track ${track} channel indexes`
      );
      if (channelCount === 0) {
        throw new Error(`BFSTM track ${track} has no channels`);
      }

      const channelIndices: number[] = [];
      for (let channel = 0; channel < channelCount; channel++) {
        const channelIndex = this.#uint8(channelIndexOffset + 4 + channel);
        if (channelIndex >= numberChannels) {
          throw new Error(`BFSTM track ${track} has an invalid channel index`);
        }
        channelIndices.push(channelIndex);
      }
      tracks.push({ numberChannels: channelCount, type: 1, channelIndices });
    }
    return tracks;
  }

  #getDefaultTrackDescriptions(numberChannels: number): TrackDescription[] {
    const tracks: TrackDescription[] = [];
    for (let channel = 0; channel < numberChannels; channel += 2) {
      const channelIndices = [channel];
      if (channel + 1 < numberChannels) {
        channelIndices.push(channel + 1);
      }
      tracks.push({
        numberChannels: channelIndices.length,
        type: 1,
        channelIndices,
      });
    }
    return tracks;
  }

  #getChannelInfo(): ChannelInfo[] {
    if (this.#cachedChannelInfo) {
      return this.#cachedChannelInfo;
    }
    if (this.#channelTableOffset < 0) {
      throw new Error('DSP ADPCM BFSTM is missing channel information');
    }

    const tableOffset = this.#channelTableOffset;
    this.#assertRange(tableOffset, 4, 'BFSTM channel table');
    const channelCount = this.#uint32(tableOffset);
    if (channelCount !== this.metadata.numberChannels) {
      throw new Error('BFSTM channel counts do not match');
    }
    this.#assertRange(tableOffset + 4, channelCount * 8, 'BFSTM channel references');

    const result: ChannelInfo[] = [];
    for (let channel = 0; channel < channelCount; channel++) {
      const channelInfoOffset = this.#resolveReference(
        tableOffset + 4 + channel * 8,
        tableOffset,
        `channel ${channel}`
      );
      const adpcmInfoOffset = this.#resolveReference(
        channelInfoOffset,
        channelInfoOffset,
        `channel ${channel} DSP ADPCM info`
      );
      this.#assertRange(adpcmInfoOffset, 0x2c, `channel ${channel} DSP ADPCM info`);

      const adpcmCoefficients = new Int16Array(16);
      for (let coefficient = 0; coefficient < 16; coefficient++) {
        adpcmCoefficients[coefficient] = this.#int16(
          adpcmInfoOffset + coefficient * 2
        );
      }
      result.push({
        adpcmCoefficients,
        initialPredictorScale: this.#uint16(adpcmInfoOffset + 0x20),
        historySample1: this.#int16(adpcmInfoOffset + 0x22),
        historySample2: this.#int16(adpcmInfoOffset + 0x24),
        loopPredictorScale: this.#uint16(adpcmInfoOffset + 0x26),
        loopHistorySample1: this.#int16(adpcmInfoOffset + 0x28),
        loopHistorySample2: this.#int16(adpcmInfoOffset + 0x2a),
      });
    }

    this.#cachedChannelInfo = result;
    return result;
  }

  #getSeekData(): Array<Array<AdpcmHistory>> {
    if (this.#cachedSeekData) {
      return this.#cachedSeekData;
    }
    const result = Array.from(
      { length: this.metadata.numberChannels },
      () => [] as AdpcmHistory[]
    );
    if (this.#offsetToSeek < 0) {
      this.#cachedSeekData = result;
      return result;
    }

    const samplesPerEntry = this.metadata.adpcTableSamplesPerEntry;
    const bytesPerEntry = this.metadata.adpcTableBytesPerEntry;
    if (samplesPerEntry === 0 || bytesPerEntry < 4) {
      throw new Error('Invalid BFSTM seek-table geometry');
    }
    const entryCount = Math.ceil(this.metadata.totalSamples / samplesPerEntry);
    const seekDataOffset = this.#offsetToSeek + 0x08;
    this.#assertRange(
      seekDataOffset,
      entryCount * bytesPerEntry * this.metadata.numberChannels,
      'BFSTM seek table'
    );

    for (let entry = 0; entry < entryCount; entry++) {
      for (let channel = 0; channel < this.metadata.numberChannels; channel++) {
        const offset =
          seekDataOffset +
          (entry * this.metadata.numberChannels + channel) * bytesPerEntry;
        result[channel].push({
          yn1: this.#int16(offset),
          yn2: this.#int16(offset + 2),
        });
      }
    }
    this.#cachedSeekData = result;
    return result;
  }

  #getPartitionedBlockData(block: number): Uint8Array[] {
    const {
      blockSize,
      totalBlocks,
      numberChannels,
      finalBlockSize,
      finalBlockSizeWithPadding,
    } = this.metadata;
    if (block < 0 || block >= totalBlocks) {
      throw new RangeError(`BFSTM block ${block} is out of range`);
    }

    const isFinalBlock = block === totalBlocks - 1;
    const blockStart =
      this.#audioDataOffset + block * numberChannels * blockSize;
    const channelStride = isFinalBlock ? finalBlockSizeWithPadding : blockSize;
    const validSize = isFinalBlock ? finalBlockSize : blockSize;
    const result: Uint8Array[] = [];

    for (let channel = 0; channel < numberChannels; channel++) {
      const start = blockStart + channel * channelStride;
      this.#assertRange(start, validSize, `BFSTM audio block ${block}, channel ${channel}`);
      if (start + validSize > this.#dataBlockEnd) {
        throw new Error('BFSTM audio data exceeds its DATA section');
      }
      result.push(this.rawData.subarray(start, start + validSize));
    }
    return result;
  }

  #getAdpcmHistory(block: number, channel: number): AdpcmHistory {
    const channelInfo = this.#getChannelInfo()[channel];
    if (block === 0) {
      return {
        yn1: channelInfo.historySample1,
        yn2: channelInfo.historySample2,
      };
    }

    const samplesPerEntry = this.metadata.adpcTableSamplesPerEntry;
    const blockSample = block * this.metadata.samplesPerBlock;
    if (samplesPerEntry > 0 && blockSample % samplesPerEntry === 0) {
      const history = this.#getSeekData()[channel][blockSample / samplesPerEntry];
      if (history) {
        return history;
      }
    }

    const previousSamples = this.#getSamplesAtBlock(block - 1)[channel];
    return {
      yn1: previousSamples[previousSamples.length - 1] ?? 0,
      yn2: previousSamples[previousSamples.length - 2] ?? 0,
    };
  }

  #getSamplesAtBlock(block: number): Array<Int16Array> {
    const cached = this.#cachedBlockResults[block];
    if (cached) {
      return cached;
    }

    const {
      codec,
      numberChannels,
      totalBlocks,
      totalSamplesInFinalBlock,
      samplesPerBlock,
    } = this.metadata;
    const samplesInBlock =
      block === totalBlocks - 1 ? totalSamplesInFinalBlock : samplesPerBlock;
    const blockData = this.#getPartitionedBlockData(block);
    const result: Int16Array[] = [];

    for (let channel = 0; channel < numberChannels; channel++) {
      const samples = new Int16Array(samplesInBlock);
      if (codec === 2) {
        this.#decodeDspAdpcm(
          blockData[channel],
          samples,
          this.#getChannelInfo()[channel].adpcmCoefficients,
          this.#getAdpcmHistory(block, channel)
        );
      } else if (codec === 1) {
        const data = blockData[channel];
        if (data.byteLength < samplesInBlock * 2) {
          throw new Error('BFSTM PCM16 block is too short');
        }
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        for (let sample = 0; sample < samplesInBlock; sample++) {
          samples[sample] = view.getInt16(sample * 2, this.#littleEndian);
        }
      } else {
        const data = blockData[channel];
        if (data.byteLength < samplesInBlock) {
          throw new Error('BFSTM PCM8 block is too short');
        }
        for (let sample = 0; sample < samplesInBlock; sample++) {
          const value = data[sample];
          samples[sample] = (value < 0x80 ? value : value - 0x100) << 8;
        }
      }
      result.push(samples);
    }

    this.#cachedBlockResults[block] = result;
    return result;
  }

  #decodeDspAdpcm(
    data: Uint8Array,
    output: Int16Array,
    coefficients: Int16Array,
    history: AdpcmHistory
  ): void {
    let dataOffset = 0;
    let predictorScale = 0;
    let yn1 = history.yn1;
    let yn2 = history.yn2;

    for (let sample = 0; sample < output.length; sample++) {
      if (sample % 14 === 0) {
        if (dataOffset >= data.length) {
          throw new Error('BFSTM DSP ADPCM block is too short');
        }
        predictorScale = data[dataOffset++];
      }
      if (dataOffset >= data.length) {
        throw new Error('BFSTM DSP ADPCM block is too short');
      }

      const packed = data[dataOffset];
      let nibble = sample % 2 === 0 ? packed >> 4 : packed & 0x0f;
      if (sample % 2 === 1) {
        dataOffset++;
      }
      if (nibble >= 8) {
        nibble -= 16;
      }

      const scale = 1 << (predictorScale & 0x0f);
      const coefficientIndex = (predictorScale >> 4) * 2;
      if (coefficientIndex > 14) {
        throw new Error('Invalid BFSTM DSP ADPCM predictor');
      }
      const decoded = Math.floor(
        (1024 +
          scale * nibble * 2048 +
          coefficients[coefficientIndex] * yn1 +
          coefficients[coefficientIndex + 1] * yn2) /
          2048
      );
      const clamped = Math.max(-32768, Math.min(32767, decoded));
      output[sample] = clamped;
      yn2 = yn1;
      yn1 = clamped;
    }
  }

  getAllSamples(): Array<Int16Array> {
    if (this.#cachedSamples) {
      return this.#cachedSamples;
    }
    this.#cachedSamples = this.getSamples(0, this.metadata.totalSamples);
    return this.#cachedSamples;
  }

  getSamples(offset: number, size: number): Array<Int16Array> {
    const { numberChannels, totalSamples, samplesPerBlock } = this.metadata;
    const requestedOffset = Number.isFinite(offset) ? Math.trunc(offset) : 0;
    const requestedSize = Number.isFinite(size) ? Math.trunc(size) : 0;
    const sampleStart = Math.max(0, Math.min(totalSamples, requestedOffset));
    const sampleEnd = Math.max(
      sampleStart,
      Math.min(totalSamples, requestedOffset + Math.max(0, requestedSize))
    );
    const result = Array.from(
      { length: numberChannels },
      () => new Int16Array(sampleEnd - sampleStart)
    );
    if (sampleStart === sampleEnd) {
      return result;
    }

    const firstBlock = Math.floor(sampleStart / samplesPerBlock);
    const lastBlock = Math.floor((sampleEnd - 1) / samplesPerBlock);
    for (let block = firstBlock; block <= lastBlock; block++) {
      const decoded = this.#getSamplesAtBlock(block);
      const blockSampleStart = block * samplesPerBlock;
      const sourceStart = Math.max(0, sampleStart - blockSampleStart);
      const sourceEnd = Math.min(decoded[0].length, sampleEnd - blockSampleStart);
      const destinationStart = Math.max(0, blockSampleStart - sampleStart);
      for (let channel = 0; channel < numberChannels; channel++) {
        result[channel].set(
          decoded[channel].subarray(sourceStart, sourceEnd),
          destinationStart
        );
      }
    }
    return result;
  }

  #resolveReference(offset: number, base: number, name: string): number {
    const result = this.#resolveOptionalReference(offset, base, name);
    if (result < 0) {
      throw new Error(`BFSTM has no ${name} reference`);
    }
    return result;
  }

  #resolveOptionalReference(offset: number, base: number, name: string): number {
    this.#assertRange(offset, 8, `BFSTM ${name} reference`);
    const type = this.#uint16(offset);
    const relativeOffset = this.#int32(offset + 4);
    if (type === 0 || relativeOffset < 0) {
      return -1;
    }
    const absoluteOffset = base + relativeOffset;
    this.#assertRange(absoluteOffset, 1, `BFSTM ${name}`);
    return absoluteOffset;
  }

  #expectString(offset: number, expected: string): void {
    this.#assertRange(offset, expected.length, expected);
    if (this.#getString(offset, expected.length) !== expected) {
      throw new Error(`Invalid BFSTM ${expected} section`);
    }
  }

  #getString(offset: number, length: number): string {
    return String.fromCharCode(...this.rawData.subarray(offset, offset + length));
  }

  #uint8(offset: number): number {
    this.#assertRange(offset, 1, 'BFSTM field');
    return this.#view.getUint8(offset);
  }

  #uint16(offset: number): number {
    this.#assertRange(offset, 2, 'BFSTM field');
    return this.#view.getUint16(offset, this.#littleEndian);
  }

  #int16(offset: number): number {
    this.#assertRange(offset, 2, 'BFSTM field');
    return this.#view.getInt16(offset, this.#littleEndian);
  }

  #uint32(offset: number): number {
    this.#assertRange(offset, 4, 'BFSTM field');
    return this.#view.getUint32(offset, this.#littleEndian);
  }

  #int32(offset: number): number {
    this.#assertRange(offset, 4, 'BFSTM field');
    return this.#view.getInt32(offset, this.#littleEndian);
  }

  #assertRange(offset: number, length: number, name: string): void {
    if (
      !Number.isSafeInteger(offset) ||
      !Number.isSafeInteger(length) ||
      offset < 0 ||
      length < 0 ||
      offset + length > this.rawData.byteLength
    ) {
      throw new Error(`${name} is out of range`);
    }
  }
}
