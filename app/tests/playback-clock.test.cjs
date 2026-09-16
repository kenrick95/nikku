const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

function load(path, globals = {}) {
  const source = readFileSync(new URL(path, 'file://' + __filename), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  runInNewContext(outputText, { exports, console, ...globals });
  return exports;
}

function worklet({ totalSamples = 1000, loopStartSample = 0, shouldLoop = false } = {}) {
  let Processor;
  const messages = [];
  const runtime = {
    currentTime: 0, console: { log() {} },
    AudioWorkletProcessor: class {
      constructor() { this.port = { postMessage: (message) => messages.push(message) }; }
    },
    registerProcessor: (_name, implementation) => { Processor = implementation; },
  };
  runInNewContext(readFileSync(new URL('../src/audio-player/worklet/audio-source.js', 'file://' + __filename), 'utf8'), runtime);
  const processor = new Processor({ processorOptions: {
    initialSamples: [new Float32Array(totalSamples), new Float32Array(totalSamples)],
    totalSamples, loopStartSample, shouldLoop, sampleRate: 100,
    trackStates: [true], trackDescriptions: [{ numberChannels: 2 }],
  } });
  function advance(frames) {
    processor.process([], [[new Float32Array(frames), new Float32Array(frames)]], {});
    runtime.currentTime += frames / 100;
  }
  return { processor, messages, advance };
}

test('worklet publishes bounded-rate sample timestamps without a main-thread timer', () => {
  const { messages, advance } = worklet();
  for (let i = 0; i < 100; i++) advance(1);
  assert.equal(messages.length, 4);
  assert.equal(messages.at(-1).payload.timestamp, 1);
  assert.ok(Math.abs(messages.at(-1).payload.contextTime - 1) < 0.00001);
});

test('seeks and loop boundaries publish immediate authoritative positions', () => {
  const { processor, messages, advance } = worklet({ totalSamples: 100, loopStartSample: 25, shouldLoop: true });
  processor.port.onmessage({ data: { type: 'SEEK', payload: { playbackTimeInS: 0.95, seekVersion: 3 } } });
  assert.equal(messages.at(-1).payload.timestamp, 0.95);
  assert.equal(messages.at(-1).payload.seekVersion, 3);
  advance(10);
  assert.equal(messages.at(-1).payload.timestamp, 0.3);
  assert.equal(messages.some(message => message.type === 'BUFFER_ENDED'), false);
});

test('loop-off is honored and completion is reported once, including a seek to the end', () => {
  const { processor, messages, advance } = worklet({ totalSamples: 20 });
  advance(25);
  advance(25);
  assert.equal(messages.filter(message => message.type === 'BUFFER_ENDED').length, 1);
  assert.equal(processor._bufferHead, 20);
  processor.port.onmessage({ data: { type: 'SEEK', payload: { playbackTimeInS: 0.2, seekVersion: 1 } } });
  advance(1);
  assert.equal(messages.filter(message => message.type === 'BUFFER_ENDED').length, 2);
  assert.equal(messages.at(-1).payload.seekVersion, 1);
});

test('UI timer start is idempotent when playback requests repeat', () => {
  let requested = 0;
  let cancelled = 0;
  const { Timer } = load('../src/timer.ts', {
    requestAnimationFrame: () => ++requested,
    cancelAnimationFrame: () => cancelled++,
  });
  const timer = new Timer({});
  timer.start();
  timer.start();
  assert.equal(requested, 1);
  timer.stop();
  timer.start();
  assert.equal(requested, 2);
  assert.equal(cancelled, 1);
});
