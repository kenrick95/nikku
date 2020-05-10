const { test, expect } = require('./helper.js');
const { Brstm } = require('../dist/brstm.js');
const fs = require('fs');
const path = require('path');
const testFile = fs.readFileSync(
  path.join(__dirname, './assets/Malfidus_new_loop.brstm')
);

test('Metadata', () => {
  const brstm = new Brstm(testFile.buffer);
  expect(brstm.metadata.loopFlag).toBe(1);
  expect(brstm.metadata.codec).toBe(2);
  expect(brstm.metadata.totalSamples).toBe(856813);
  expect(brstm.metadata.loopStartSample).toBe(186368);
});

test('Get all samples', () => {
  const brstm = new Brstm(testFile.buffer);
  const allSamples = brstm.getAllSamples();
  expect(allSamples.length).toBe(2);
  expect(allSamples[0].length).toBe(856813);

  expect(allSamples[0][5000]).toBe(478);
  expect(allSamples[0][15000]).toBe(-435);
  expect(allSamples[0][25000]).toBe(-627);
  expect(allSamples[0][35000]).toBe(-1951);
  expect(allSamples[1][5000]).toBe(-64);
  expect(allSamples[1][15000]).toBe(-679);
  expect(allSamples[1][25000]).toBe(-707);
  expect(allSamples[1][35000]).toBe(-1183);
});

test('Get partial samples', () => {
  const brstm = new Brstm(testFile.buffer);
  const samples = brstm.getSamples(0, 856813);
  expect(samples.length).toBe(2);
  expect(samples[0].length).toBe(856813);

  expect(samples[0][5000]).toBe(478);
  expect(samples[0][15000]).toBe(-435);
  expect(samples[0][25000]).toBe(-627);
  expect(samples[0][35000]).toBe(-1951);
  expect(samples[1][5000]).toBe(-64);
  expect(samples[1][15000]).toBe(-679);
  expect(samples[1][25000]).toBe(-707);
  expect(samples[1][35000]).toBe(-1183);
});
