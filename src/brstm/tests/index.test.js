const { test, expect } = require('./helper.js');
const { Brstm } = require('../dist/brstm.js');
const fs = require('fs');
const path = require('path');
const testFiles = [
  fs.readFileSync(path.join(__dirname, './assets/Malfidus_new_loop.brstm')),
  fs.readFileSync(path.join(__dirname, './assets/little_endian.brstm')),
];

test('Metadata', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  expect(brstm.metadata.endianness).toBe(1);
  expect(brstm.metadata.loopFlag).toBe(1);
  expect(brstm.metadata.codec).toBe(2);
  expect(brstm.metadata.totalSamples).toBe(856813);
  expect(brstm.metadata.loopStartSample).toBe(186368);
});

test('Get all samples', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const allSamples = brstm.getAllSamples();
  expect(allSamples.length).toBe(2);
  expect(allSamples[0].length).toBe(856813);

  expect(allSamples[0][5000]).toBe(478);
  expect(allSamples[0][15000]).toBe(-435);
  expect(allSamples[0][25000]).toBe(-627);
  expect(allSamples[0][35000]).toBe(-1951);
  expect(allSamples[0][856000]).toBe(-581);
  expect(allSamples[1][5000]).toBe(-64);
  expect(allSamples[1][15000]).toBe(-679);
  expect(allSamples[1][25000]).toBe(-707);
  expect(allSamples[1][35000]).toBe(-1183);
  expect(allSamples[1][856000]).toBe(-219);
});

test('Get partial samples', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const samples = brstm.getSamples(0, 856813);
  expect(samples.length).toBe(2);
  expect(samples[0].length).toBe(856813);

  expect(samples[0][5000]).toBe(478);
  expect(samples[0][15000]).toBe(-435);
  expect(samples[0][25000]).toBe(-627);
  expect(samples[0][35000]).toBe(-1951);
  expect(samples[0][856000]).toBe(-581);
  expect(samples[1][5000]).toBe(-64);
  expect(samples[1][15000]).toBe(-679);
  expect(samples[1][25000]).toBe(-707);
  expect(samples[1][35000]).toBe(-1183);
  expect(samples[1][856000]).toBe(-219);
});

test('Get partial samples (2)', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const samples = brstm.getSamples(0, 15001);
  expect(samples.length).toBe(2);
  expect(samples[0].length).toBe(15001);

  expect(samples[0][5000]).toBe(478);
  expect(samples[0][15000]).toBe(-435);
  expect(samples[1][5000]).toBe(-64);
  expect(samples[1][15000]).toBe(-679);
});

test('Get partial samples (3)', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const offset = 856000;
  const samples = brstm.getSamples(offset, 1);
  expect(samples.length).toBe(2);
  expect(samples[0].length).toBe(1);

  expect(samples[0][856000 - offset]).toBe(-581);
  expect(samples[1][856000 - offset]).toBe(-219);
});

test('Get partial samples (4)', () => {
  const brstm = new Brstm(testFiles[0].buffer);
  const offset = 25000;
  const samples = brstm.getSamples(offset, 10001);
  expect(samples.length).toBe(2);
  expect(samples[0].length).toBe(10001);

  expect(samples[0][25000 - offset]).toBe(-627);
  expect(samples[0][35000 - offset]).toBe(-1951);
  expect(samples[1][25000 - offset]).toBe(-707);
  expect(samples[1][35000 - offset]).toBe(-1183);
});

test('Little endian file', () => {
  const brstm = new Brstm(testFiles[1].buffer);
  expect(brstm.metadata.endianness).toBe(0);
  expect(brstm.metadata.codec).toBe(2);
  expect(brstm.metadata.totalSamples).toBe(2926120);
  expect(brstm.metadata.loopStartSample).toBe(46120);
});
