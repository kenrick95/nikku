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

function sessionSetup() {
  const calls = [];
  const handlers = new Map();
  const positions = [];
  const session = {
    metadata: null,
    playbackState: 'none',
    setActionHandler(action, handler) {
      if (action === 'stop') throw new Error('Unsupported action');
      handlers.set(action, handler);
    },
    setPositionState(state) { positions.push(state); },
  };
  const { PlayerMediaSession } = load('../src/media-session.ts', {
    MediaMetadata: class { constructor(data) { Object.assign(this, data); } },
  });
  const bridge = new PlayerMediaSession({
    play: async () => calls.push('play'), pause: async () => calls.push('pause'),
    stop: async () => calls.push('stop'), seek: async (position) => calls.push(position),
    previous: async () => calls.push('previous'), next: async () => calls.push('next'),
    getPosition: () => 37, onError: (error) => calls.push(error.message),
  }, session);
  const state = { title: 'song.brstm', duration: 100, position: 20, playing: true, canNext: true, canPrevious: false };
  return { bridge, session, handlers, positions, calls, state };
}
const flush = () => new Promise(setImmediate);

test('metadata, playback state, seeking and navigation reach the player without animation frames', async () => {
  const { bridge, session, handlers, calls, state } = sessionSetup();
  bridge.update(state);
  assert.equal(session.metadata.title, 'song.brstm');
  assert.equal(session.metadata.artist, 'Nikku');
  assert.equal(session.metadata.album, 'BRSTM / BFSTM player');
  assert.equal(session.playbackState, 'playing');
  assert.equal(handlers.get('previoustrack'), null);
  handlers.get('pause')({});
  handlers.get('seekforward')({ seekOffset: 5 });
  handlers.get('seekbackward')({});
  handlers.get('seekto')({ seekTime: 1000 });
  handlers.get('nexttrack')({});
  await flush();
  assert.deepEqual(calls, ['pause', 42, 27, 100, 'next']);
  bridge.update({ ...state, title: 'next.bfstm', playing: false, canNext: false, canPrevious: true });
  assert.equal(session.playbackState, 'paused');
  assert.equal(session.metadata.title, 'next.bfstm');
  assert.equal(handlers.get('nexttrack'), null);
  assert.equal(typeof handlers.get('previoustrack'), 'function');
});

test('clearing a session removes old metadata, position and action handlers', async () => {
  const { bridge, session, handlers, positions, calls, state } = sessionSetup();
  bridge.update(state);
  const oldPlay = handlers.get('play');
  bridge.update(null);
  assert.equal(session.metadata, null);
  assert.equal(session.playbackState, 'none');
  assert.equal(positions.at(-1), undefined);
  for (const handler of handlers.values()) assert.equal(handler, null);
  oldPlay({});
  await flush();
  assert.deepEqual(calls, []);
});

test('missing APIs, unsupported actions and invalid positions do not break playback', () => {
  const { PlayerMediaSession, prepareAudioSession } = load('../src/media-session.ts');
  const { bridge, positions, state } = sessionSetup();
  new PlayerMediaSession({}).update(state);
  prepareAudioSession();
  bridge.update({ ...state, position: -3 });
  assert.equal(positions.at(-1).position, 0);
  bridge.update({ ...state, position: NaN });
  bridge.update({ ...state, duration: 0 });
  assert.equal(positions.length, 1);
});

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
