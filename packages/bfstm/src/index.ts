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
  #offsetToSeek: number;
  #offsetToData: number;

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

  #getMetadata() {
    const offsetToStreamInfo =
      this.#offsetToInfo +
      getSliceAsNumber(
        this.rawData,
        this.#offsetToInfo + 0x0c,
        4,
        this.endianness
      ) +
      0x08;
    const offsetToTrackInfo =
      this.#offsetToInfo +
      getSliceAsNumber(
        this.rawData,
        this.#offsetToInfo + 0x14,
        4,
        this.endianness
      ) +
      0x08;
    const offsetToChannelInfo =
      this.#offsetToInfo +
      getSliceAsNumber(
        this.rawData,
        this.#offsetToInfo + 0x1c,
        4,
        this.endianness
      ) +
      0x08;

    /**
     * @type {Metadata}
     */
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
    };

    return metadata;
  }
}
