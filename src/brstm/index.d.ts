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
 * @typedef {Object} TrackDescription
 * @property {number} numberChannels
 * @property {number} type
 */
/**
 * @exports
 * @typedef {Object} Metadata
 * @property {number} fileSize
 * @property {number} endianness 0 - little endian, 1 - big endian
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
 * @property {Array<TrackDescription>} trackDescriptions
 */
/**
 * @class
 */
export class Brstm {
    /**
     *
     * @param {ArrayBuffer} arrayBuffer
     */
    constructor(arrayBuffer: ArrayBuffer);
    /**
     * @type {Uint8Array} rawData
     */
    rawData: Uint8Array;
    /**
     * @type {number} 0 - little endian, 1 - big endian
     */
    endianness: number;
    /**
     * @private
     * @type {number} _offsetToHead Offset to HEAD chunk, relative to beginning of file
     */
    private _offsetToHead;
    /**
     * @private
     * @type {number} _offsetToHeadChunk1 Offset to HEAD chunk part 1, relative to beginning of file
     */
    private _offsetToHeadChunk1;
    /**
     * @private
     * @type {number} _offsetToHeadChunk2 Offset to HEAD chunk part 2, relative to beginning of file
     */
    private _offsetToHeadChunk2;
    /**
     * @private
     * @type {number} _offsetToHeadChunk3 Offset to HEAD chunk part 3, relative to beginning of file
     */
    private _offsetToHeadChunk3;
    /**
     * @private
     * @type {number} _offsetToAdpc Offset to ADPC chunk, relative to beginning of file
     */
    private _offsetToAdpc;
    /**
     * @private
     * @type {number} _offsetToData Offset to DATA, relative to beginning of file
     */
    private _offsetToData;
    /**
     * @type {Metadata} metadata
     */
    metadata: Metadata;
    /**
     * @private
     * @type {?Array<Int16Array>} _cachedSamples per-channel samples
     */
    private _cachedSamples;
    /**
     * @type {?Array<Array<{yn1: number, yn2: number}>>}
     */
    _partitionedAdpcChunkData: {
        yn1: number;
        yn2: number;
    }[][];
    /**
     * @type {?Array<ChannelInfo>}
     */
    _cachedChannelInfo: Array<ChannelInfo> | null;
    /**
     * @private
     * @type {Array<Array<Int16Array>>} per-channel (`c) samples at block `b`. Access by _cachedBlockResults[b][c]
     */
    private _cachedBlockResults;
    /**
     * @returns {Array<ChannelInfo>}
     */
    _getChannelInfo(): Array<ChannelInfo>;
    _getMetadata(): Metadata;
    /**
     * Read only one block
     * @param {number} block block index
     * @returns {Array<Uint8Array>} array of non-interlaced raw data; each array represents one channel
     */
    _getPartitionedBlockData(block: number): Array<Uint8Array>;
    /**
     * @return {Array<Array<{yn1: number, yn2: number}>>}
     */
    _getPartitionedAdpcChunkData(): {
        yn1: number;
        yn2: number;
    }[][];
    /**
     *
     * @returns {Array<Int16Array>} per-channel samples
     */
    getAllSamples(): Array<Int16Array>;
    /**
     *
     * @param {number} b blockIndex
     * @returns {Array<Int16Array>} per-channel samples in block `b`
     */
    _getSamplesAtBlock(b: number): Array<Int16Array>;
    /**
     * Same as `getSamples`
     *
     * @deprecated Please use `getSamples`
     *
     * @param {number} offset
     * @param {number} size
     * @returns {Array<Int16Array>} per-channel samples from `offset`-th sample until `(offset + size - 1)`-th sample
     */
    getBuffer(offset: number, size: number): Array<Int16Array>;
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
    getSamples(offset: number, size: number): Array<Int16Array>;
}
export type ChannelInfo = {
    adpcmCoefficients: Array<number>;
    gain: number;
    initialPredictorScale: number;
    historySample1: number;
    historySample2: number;
    loopPredictorScale: number;
    loopHistorySample1: number;
    loopHistorySample2: number;
};
export type TrackDescription = {
    numberChannels: number;
    type: number;
};
export type Metadata = {
    fileSize: number;
    /**
     * 0 - little endian, 1 - big endian
     */
    endianness: number;
    /**
     *   - 0 - 8-bit PCM
     *   - 1 - 16-bit PCM
     *   - 2 - 4-bit ADPCM
     */
    codec: number;
    loopFlag: number;
    numberChannels: number;
    sampleRate: number;
    /**
     * loop start, in terms of sample #
     */
    loopStartSample: number;
    totalSamples: number;
    /**
     * total number of blocks, per channel, including final block
     */
    totalBlocks: number;
    blockSize: number;
    samplesPerBlock: number;
    /**
     * Final block size, without padding, in bytes
     */
    finalBlockSize: number;
    /**
     * Final block size, **with** padding, in bytes
     */
    finalBlockSizeWithPadding: number;
    /**
     * Total samples in final block
     */
    totalSamplesInFinalBlock: number;
    /**
     * Samples per entry in ADPC table
     */
    adpcTableSamplesPerEntry: number;
    /**
     * Bytes per entry in ADPC table
     */
    adpcTableBytesPerEntry: number;
    /**
     * Number of tracks
     */
    numberTracks: number;
    /**
     * Track description type ??
     */
    trackDescriptionType: number;
    trackDescriptions: Array<TrackDescription>;
};
