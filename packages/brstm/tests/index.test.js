const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Brstm } = require('../dist/brstm.js');
const fs = require('fs');
const path = require('path');
const testFiles = [
  fs.readFileSync(path.join(__dirname, './assets/Malfidus_new_loop.brstm')),
  fs.readFileSync(path.join(__dirname, './assets/little_endian.brstm')),
];

test('Metadata', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  assert.equal(brstm.metadata.endianness, 1);
  assert.equal(brstm.metadata.loopFlag, 1);
  assert.equal(brstm.metadata.codec, 2);
  assert.equal(brstm.metadata.totalSamples, 856813);
  assert.equal(brstm.metadata.loopStartSample, 186368);
  assert.deepEqual(brstm.metadata.trackDescriptions, [
    { type: 0, numberChannels: 2 },
  ]);
});

test('Get all samples', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const allSamples = brstm.getAllSamples();
  assert.equal(allSamples.length, 2);
  assert.equal(allSamples[0].length, 856813);

  assert.equal(allSamples[0][5000], 478);
  assert.equal(allSamples[0][15000], -435);
  assert.equal(allSamples[0][25000], -627);
  assert.equal(allSamples[0][35000], -1951);
  assert.equal(allSamples[0][856000], -581);
  assert.equal(allSamples[1][5000], -64);
  assert.equal(allSamples[1][15000], -679);
  assert.equal(allSamples[1][25000], -707);
  assert.equal(allSamples[1][35000], -1183);
  assert.equal(allSamples[1][856000], -219);
});

test('Get partial samples', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const samples = brstm.getSamples(0, 856813);
  assert.equal(samples.length, 2);
  assert.equal(samples[0].length, 856813);

  assert.equal(samples[0][5000], 478);
  assert.equal(samples[0][15000], -435);
  assert.equal(samples[0][25000], -627);
  assert.equal(samples[0][35000], -1951);
  assert.equal(samples[0][856000], -581);
  assert.equal(samples[1][5000], -64);
  assert.equal(samples[1][15000], -679);
  assert.equal(samples[1][25000], -707);
  assert.equal(samples[1][35000], -1183);
  assert.equal(samples[1][856000], -219);
});

test('Get partial samples (2)', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const samples = brstm.getSamples(0, 15001);
  assert.equal(samples.length, 2);
  assert.equal(samples[0].length, 15001);

  assert.equal(samples[0][5000], 478);
  assert.equal(samples[0][15000], -435);
  assert.equal(samples[1][5000], -64);
  assert.equal(samples[1][15000], -679);
});

test('Get partial samples (3)', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const offset = 856000;
  const samples = brstm.getSamples(offset, 1);
  assert.equal(samples.length, 2);
  assert.equal(samples[0].length, 1);

  assert.equal(samples[0][856000 - offset], -581);
  assert.equal(samples[1][856000 - offset], -219);
});

test('Get partial samples (4)', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const offset = 25000;
  const samples = brstm.getSamples(offset, 10001);
  assert.equal(samples.length, 2);
  assert.equal(samples[0].length, 10001);

  assert.equal(samples[0][25000 - offset], -627);
  assert.equal(samples[0][35000 - offset], -1951);
  assert.equal(samples[1][25000 - offset], -707);
  assert.equal(samples[1][35000 - offset], -1183);
});

test('Little endian file', () => {
  const brstm = new Brstm(testFiles[1].buffer);
  assert.equal(brstm.metadata.endianness, 0);
  assert.equal(brstm.metadata.codec, 2);
  assert.equal(brstm.metadata.totalSamples, 2926120);
  assert.equal(brstm.metadata.loopStartSample, 46120);
  assert.deepEqual(brstm.metadata.trackDescriptions, [
    { type: 0, numberChannels: 1 },
  ]);
});

test('Mono file whose track declares 2 channels', () => {
  // Same mono file, but its track description says 2 channels, like many
  // community-made BRSTM files. The player must not look for a second channel.
  const data = new Uint8Array(testFiles[1]);
  const view = new DataView(data.buffer);
  const littleEndian = true;
  const offsetToHead = view.getUint32(0x10, littleEndian);
  const offsetToHeadChunk2 =
    offsetToHead + view.getUint32(offsetToHead + 0x14, littleEndian) + 0x08;
  const entry = offsetToHeadChunk2 + 0x04;
  const type = view.getUint8(entry + 0x01);
  const offsetToTrackDescription =
    offsetToHead + 0x08 + view.getUint32(entry + 0x04, littleEndian);
  view.setUint8(offsetToTrackDescription + (type === 1 ? 0x08 : 0), 2);

  const brstm = new Brstm(data.buffer);
  assert.equal(brstm.metadata.numberChannels, 1);
  assert.deepEqual(brstm.metadata.trackDescriptions, [
    { type: 0, numberChannels: 1 },
  ]);
  assert.equal(brstm.getSamples(0, 100).length, 1);
});
