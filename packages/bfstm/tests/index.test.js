const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Bfstm } = require('../dist/bfstm.js');

function createWriter(size, littleEndian) {
  const buffer = new ArrayBuffer(size);
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  return {
    buffer,
    bytes,
    string(offset, value) {
      for (let i = 0; i < value.length; i++) {
        bytes[offset + i] = value.charCodeAt(i);
      }
    },
    u8(offset, value) {
      view.setUint8(offset, value);
    },
    u16(offset, value) {
      view.setUint16(offset, value, littleEndian);
    },
    s16(offset, value) {
      view.setInt16(offset, value, littleEndian);
    },
    u32(offset, value) {
      view.setUint32(offset, value, littleEndian);
    },
    s32(offset, value) {
      view.setInt32(offset, value, littleEndian);
    },
  };
}

function writeReference(writer, offset, type, relativeOffset) {
  writer.u16(offset, type);
  writer.u16(offset + 2, 0);
  writer.s32(offset + 4, relativeOffset);
}

function writeHeader(writer, sections, version = 0x00040000) {
  writer.string(0, 'FSTM');
  writer.bytes.set(writer.bytes[4] === 0 ? [0xfe, 0xff] : [0xff, 0xfe], 4);
  writer.u16(6, 0x40);
  writer.u32(8, version);
  writer.u32(0x0c, writer.buffer.byteLength);
  writer.u16(0x10, sections.length);
  writer.u16(0x12, 0);
  sections.forEach((section, index) => {
    const offset = 0x14 + index * 0x0c;
    writer.u16(offset, section.type);
    writer.u16(offset + 2, 0);
    writer.u32(offset + 4, section.offset);
    writer.u32(offset + 8, section.size);
  });
}

function writeStreamInfo(writer, offset, options) {
  writer.u8(offset, options.codec);
  writer.u8(offset + 1, options.loopFlag || 0);
  writer.u8(offset + 2, options.channels);
  writer.u8(offset + 3, 0);
  writer.u32(offset + 4, options.sampleRate);
  writer.u32(offset + 8, options.loopStart || 0);
  writer.u32(offset + 0x0c, options.totalSamples);
  writer.u32(offset + 0x10, options.totalBlocks);
  writer.u32(offset + 0x14, options.blockSize);
  writer.u32(offset + 0x18, options.samplesPerBlock);
  writer.u32(offset + 0x1c, options.finalBlockSize);
  writer.u32(offset + 0x20, options.finalBlockSamples);
  writer.u32(offset + 0x24, options.finalBlockPaddedSize);
  writer.u32(offset + 0x28, options.seekEntrySize);
  writer.u32(offset + 0x2c, options.seekEntrySamples);
  writeReference(writer, offset + 0x30, 0x1f00, options.audioOffset);
}

function makePcm16Bfstm() {
  const infoOffset = 0x40;
  const infoSize = 0xb0;
  const dataOffset = 0xf0;
  const dataSize = 0x50;
  const writer = createWriter(dataOffset + dataSize, false);
  writeHeader(writer, [
    { type: 0x4002, offset: dataOffset, size: dataSize },
    { type: 0x4000, offset: infoOffset, size: infoSize },
  ]);

  writer.string(infoOffset, 'INFO');
  writer.u32(infoOffset + 4, infoSize);
  const referenceBase = infoOffset + 8;
  writeReference(writer, referenceBase, 0x4100, 0x18);
  writeReference(writer, referenceBase + 8, 0x0101, 0x50);
  writeReference(writer, referenceBase + 0x10, 0, -1);
  writeStreamInfo(writer, infoOffset + 0x20, {
    codec: 1,
    loopFlag: 1,
    channels: 2,
    sampleRate: 32000,
    loopStart: 2,
    totalSamples: 6,
    totalBlocks: 2,
    blockSize: 8,
    samplesPerBlock: 4,
    finalBlockSize: 4,
    finalBlockSamples: 2,
    finalBlockPaddedSize: 8,
    seekEntrySize: 4,
    seekEntrySamples: 4,
    audioOffset: 0x28,
  });

  const trackTable = infoOffset + 0x58;
  writer.u32(trackTable, 2);
  writeReference(writer, trackTable + 4, 0x4101, 0x20);
  writeReference(writer, trackTable + 0x0c, 0x4101, 0x38);
  const track0 = trackTable + 0x20;
  writer.bytes.set([127, 64, 0, 0], track0);
  writeReference(writer, track0 + 4, 0x0100, 0x0c);
  writer.u32(track0 + 0x0c, 1);
  writer.u8(track0 + 0x10, 1);
  const track1 = trackTable + 0x38;
  writer.bytes.set([127, 64, 0, 0], track1);
  writeReference(writer, track1 + 4, 0x0100, 0x0c);
  writer.u32(track1 + 0x0c, 1);
  writer.u8(track1 + 0x10, 0);

  writer.string(dataOffset, 'DATA');
  writer.u32(dataOffset + 4, dataSize);
  const audioOffset = dataOffset + 0x30;
  const channels = [
    [100, -200, 300, -400, 500, -600],
    [1000, -2000, 3000, -4000, 5000, -6000],
  ];
  for (let channel = 0; channel < 2; channel++) {
    for (let sample = 0; sample < 4; sample++) {
      writer.s16(audioOffset + channel * 8 + sample * 2, channels[channel][sample]);
    }
    for (let sample = 0; sample < 2; sample++) {
      writer.s16(
        audioOffset + 16 + channel * 8 + sample * 2,
        channels[channel][sample + 4]
      );
    }
  }
  return writer.buffer;
}

function makeLittleEndianAdpcmBfstm() {
  const infoOffset = 0x40;
  const infoSize = 0xc0;
  const seekOffset = 0x100;
  const seekSize = 0x20;
  const dataOffset = 0x120;
  const dataSize = 0x48;
  const writer = createWriter(dataOffset + dataSize, true);
  writer.bytes[4] = 1;
  writeHeader(writer, [
    { type: 0x4000, offset: infoOffset, size: infoSize },
    { type: 0x4002, offset: dataOffset, size: dataSize },
    { type: 0x4001, offset: seekOffset, size: seekSize },
  ]);

  writer.string(infoOffset, 'INFO');
  writer.u32(infoOffset + 4, infoSize);
  const referenceBase = infoOffset + 8;
  writeReference(writer, referenceBase, 0x4100, 0x18);
  writeReference(writer, referenceBase + 8, 0, -1);
  writeReference(writer, referenceBase + 0x10, 0x0101, 0x58);
  writeStreamInfo(writer, infoOffset + 0x20, {
    codec: 2,
    channels: 1,
    sampleRate: 48000,
    totalSamples: 18,
    totalBlocks: 2,
    blockSize: 8,
    samplesPerBlock: 14,
    finalBlockSize: 3,
    finalBlockSamples: 4,
    finalBlockPaddedSize: 0x20,
    seekEntrySize: 4,
    seekEntrySamples: 14,
    audioOffset: 0x18,
  });

  const channelTable = infoOffset + 0x60;
  writer.u32(channelTable, 1);
  writeReference(writer, channelTable + 4, 0x4102, 0x10);
  const channelInfo = channelTable + 0x10;
  writeReference(writer, channelInfo, 0x0300, 8);
  const adpcmInfo = channelInfo + 8;
  writer.s16(adpcmInfo + 4, 2048);
  writer.u16(adpcmInfo + 0x20, 0);
  writer.s16(adpcmInfo + 0x22, 0);
  writer.s16(adpcmInfo + 0x24, 0);
  writer.u16(adpcmInfo + 0x26, 0);
  writer.s16(adpcmInfo + 0x28, 0);
  writer.s16(adpcmInfo + 0x2a, 0);

  writer.string(seekOffset, 'SEEK');
  writer.u32(seekOffset + 4, seekSize);
  writer.s16(seekOffset + 8, 0);
  writer.s16(seekOffset + 0x0a, 0);
  writer.s16(seekOffset + 0x0c, 1234);
  writer.s16(seekOffset + 0x0e, 500);

  writer.string(dataOffset, 'DATA');
  writer.u32(dataOffset + 4, dataSize);
  writer.bytes.set(
    [0x00, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde],
    dataOffset + 0x20
  );
  writer.bytes.set([0x10, 0x00, 0x00], dataOffset + 0x28);
  return writer.buffer;
}

test('reads section references, track references, and PCM16 blocks', () => {
  const bfstm = new Bfstm(makePcm16Bfstm());
  assert.equal(bfstm.metadata.endianness, 1);
  assert.equal(bfstm.metadata.codec, 1);
  assert.equal(bfstm.metadata.sampleRate, 32000);
  assert.equal(bfstm.metadata.loopStartSample, 2);
  assert.deepEqual(bfstm.metadata.trackDescriptions, [
    { type: 1, numberChannels: 1, channelIndices: [1] },
    { type: 1, numberChannels: 1, channelIndices: [0] },
  ]);
  assert.deepEqual(
    bfstm.getAllSamples().map((samples) => Array.from(samples)),
    [
      [100, -200, 300, -400, 500, -600],
      [1000, -2000, 3000, -4000, 5000, -6000],
    ]
  );
  assert.deepEqual(
    bfstm.getSamples(3, 2).map((samples) => Array.from(samples)),
    [
      [-400, 500],
      [-4000, 5000],
    ]
  );
});

test('decodes little-endian DSP ADPCM using SEEK history', () => {
  const bfstm = new Bfstm(makeLittleEndianAdpcmBfstm());
  assert.equal(bfstm.metadata.endianness, 0);
  assert.deepEqual(bfstm.metadata.trackDescriptions, [
    { type: 1, numberChannels: 1, channelIndices: [0] },
  ]);
  assert.deepEqual(Array.from(bfstm.getAllSamples()[0]), [
    1, 2, 3, 4, 5, 6, 7, -8, -7, -6, -5, -4, -3, -2,
    1234, 1234, 1234, 1234,
  ]);
  assert.deepEqual(Array.from(bfstm.getSamples(12, 5)[0]), [
    -3, -2, 1234, 1234, 1234,
  ]);
});

test('rejects invalid input', () => {
  assert.throws(() => new Bfstm(new ArrayBuffer(4)), /header is out of range/);
  const invalid = new ArrayBuffer(0x40);
  new Uint8Array(invalid).set([0x4e, 0x4f, 0x50, 0x45]);
  assert.throws(() => new Bfstm(invalid), /valid BFSTM/);
});
