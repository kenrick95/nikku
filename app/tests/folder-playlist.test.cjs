const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

// Exercise actual component handlers with the audio device and Lit renderer stubbed.
const template = (strings, ...values) => ({ strings, values });
class Timer { start() {} stop() {} }
function loadSource(path, dependencies, globals = {}) {
  const source = readFileSync(new URL(path, 'file://' + __filename), 'utf8');
  const { outputText } = ts.transpileModule(source.replaceAll('import.meta.url', '"file:///app/src/elements/nikku-main.ts"'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, experimentalDecorators: true },
  });
  const exports = {};
  runInNewContext(outputText, { exports, require: (name) => {
    assert.ok(name in dependencies, 'Unexpected dependency: ' + name);
    return dependencies[name];
  }, URL, console: { ...console, error() {} }, ...globals });
  return exports;
}
function handlers(result, name) {
  if (Array.isArray(result)) return result.flatMap((item) => handlers(item, name));
  if (!result?.strings) return [];
  return result.values.flatMap((value, i) => [
    ...(result.strings[i].endsWith('@' + name + '=') ? [value] : []),
    ...handlers(value, name),
  ]);
}
function setup() {
  const calls = [];
  class AudioPlayer {
    async destroy() { calls.push('destroy'); }
    async init() { calls.push('init'); }
    setLoop(value) { calls.push(['loop', value]); }
    async setVolume(value) { calls.push(['volume', value]); }
    async start() { calls.push('start'); }
    async play() { calls.push('play'); }
  }
  class Worker {
    async init() { calls.push('decode'); }
    async getMetadata() { return { totalSamples: 100, sampleRate: 10, numberTracks: 1 }; }
  }
  const { NikkuMain } = loadSource('../src/elements/nikku-main.ts', {
    lit: { html: template, css: template, LitElement: class {} },
    'lit/decorators.js': { customElement: () => (value) => value, state: () => () => {} },
    'lit/directives/class-map.js': { classMap: (value) => value },
    '../audio-player/audio-player': { AudioPlayer },
    '../timer': { Timer },
    comlink: { transfer: (value) => value },
  }, { ComlinkWorker: Worker });
  return { app: new NikkuMain(), calls };
}
const file = (path) => ({ name: path.split('/').at(-1), webkitRelativePath: path, arrayBuffer: async () => new ArrayBuffer(8) });
function chooseFolder(app, files) {
  const input = { files, value: 'folder' };
  handlers(app.render(), 'change')[1].call(app, { target: input });
  return input;
}
test('filters and sorts nested files, preserves cancellation, and handles no matches', () => {
  const { app } = setup();
  const files = [file('Music/track10.BFSTM'), file('Music/track2.brstm'), file('Music/sub/song.bfstm'), file('Music/readme.txt')];
  assert.equal(chooseFolder(app, files).value, '');
  assert.deepEqual(Array.from(app.folderFiles, (item) => item.webkitRelativePath), [
    'Music/sub/song.bfstm', 'Music/track2.brstm', 'Music/track10.BFSTM',
  ]);
  chooseFolder(app, []);
  assert.equal(app.folderFiles.length, 3);
  chooseFolder(app, [file('Other/readme.txt')]);
  assert.equal(app.folderFiles.length, 0);
  assert.equal(app.selectedFile, null);
});
test('double-click plays files, serializes loads, and destroys before changing decoder', async () => {
  const { app, calls } = setup();
  const files = [file('Music/a.brstm'), file('Music/b.bfstm')];
  chooseFolder(app, files);
  app.loop = 'off';
  app.muted = true;
  const [first, second] = handlers(app.render(), 'dblclick');
  await Promise.all([first(), second()]);
  assert.equal(app.currentFile, files[0]);
  assert.equal(calls.filter((call) => call === 'decode').length, 1);
  assert.ok(calls.some((call) => call[0] === 'loop' && call[1] === false));
  assert.ok(calls.some((call) => call[0] === 'volume' && call[1] === 0));
  calls.length = 0;
  await second();
  assert.deepEqual(calls.slice(0, 2), ['destroy', 'decode']);
  assert.equal(app.currentFile, files[1]);
  assert.equal(app.trackTitle, 'b.bfstm');
});
test('read failure releases loading state and allows another file to play', async () => {
  const { app } = setup();
  const broken = file('Music/broken.brstm');
  broken.arrayBuffer = async () => { throw new Error('Cannot read file'); };
  chooseFolder(app, [broken, file('Music/valid.bfstm')]);
  const [first, second] = handlers(app.render(), 'dblclick');
  await first();
  assert.match(app.errorMessage, /Cannot read file/);
  assert.equal(app.loading, false);
  assert.equal(app.disabled, true);
  await second();
  assert.equal(app.errorMessage, '');
  assert.equal(app.disabled, false);
});
test('destroy closes audio and discards a pending decode after switching files', async () => {
  let closed = 0;
  let resolveDecode;
  let decodeCount = 0;
  const { AudioPlayer } = loadSource('../src/audio-player/audio-player.ts', {
    '../timer': { Timer }, './worklet/audio-source.js?raw': { default: '' },
  }, { AudioContext: class {
    state = 'running';
    async close() { closed++; this.state = 'closed'; }
  } });
  const player = new AudioPlayer({ onPlay() {}, onPause() {}, decodeSamples: () => {
    decodeCount++;
    return new Promise((resolve) => { resolveDecode = resolve; });
  } });
  const metadata = { totalSamples: 200, sampleRate: 10, numberTracks: 1 };
  await player.init(metadata);
  const starting = player.start();
  await player.destroy();
  await player.init(metadata);
  resolveDecode([]);
  await starting;
  assert.equal(closed, 1);
  assert.equal(decodeCount, 1);
});

test('play resumes a suspended context after initial samples are loaded', async () => {
  let resumed = 0;
  let played = 0;
  const { AudioPlayer } = loadSource('../src/audio-player/audio-player.ts', {
    '../timer': { Timer }, './worklet/audio-source.js?raw': { default: '' },
  }, {
    AudioContext: class {
      state = 'suspended';
      createGain() { return { gain: {}, connect() {} }; }
      async resume() { resumed++; }
    },
    AudioWorkletNode: class {
      port = { addEventListener() {}, start() {} };
      connect() {}
    },
  });
  const player = new AudioPlayer({
    onPlay() { played++; }, onPause() {}, decodeSamples: async () => [],
  });
  await player.init({ totalSamples: 10, sampleRate: 10, numberTracks: 1 });
  await player.start();
  await player.play();
  assert.equal(resumed, 1);
  assert.equal(played, 1);
});

// The controls use native buttons/ranges; verify their events and exposed state.
function control(name, className) {
  const events = [];
  const dependencies = {
    lit: { html: template, css: template, LitElement: class {
      dispatchEvent(event) { events.push(event); }
    } },
    'lit/decorators.js': { customElement: () => (value) => value, property: () => () => {} },
    'lit/directives/class-map.js': { classMap: (value) => value },
    'lit/directives/unsafe-html.js': { unsafeHTML: (value) => value },
  };
  for (const icon of ['loop', 'play', 'pause', 'volume', 'volume-icon-muted']) {
    const path = icon === 'volume-icon-muted' ? icon : icon + '-icon';
    dependencies['../../assets/' + path + '.svg?raw'] = { default: '<svg></svg>' };
  }
  const exports = loadSource('../src/elements/controls-' + name + '.ts', dependencies, {
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  });
  return { element: new exports[className](), events };
}
function boundValue(result, attribute) {
  return result.values[result.strings.findIndex((part) => part.endsWith(attribute + '='))];
}
test('play/pause and loop expose their names, toggle state and honor disabled', () => {
  for (const [name, className, eventType] of [
    ['play-pause', 'ControlsPlayPause', 'playPauseClick'], ['loop', 'ControlsLoop', 'loopClick'],
  ]) {
    const { element, events } = control(name, className);
    if (name === 'play-pause') assert.equal(boundValue(element.render(), 'aria-label'), 'Play');
    else assert.equal(boundValue(element.render(), 'aria-pressed'), true);
    handlers(element.render(), 'click')[0].call(element);
    assert.equal(events[0].type, eventType);
    if (name === 'play-pause') assert.equal(boundValue(element.render(), 'aria-label'), 'Pause');
    else assert.equal(boundValue(element.render(), 'aria-pressed'), false);
    element.disabled = true;
    assert.equal(boundValue(element.render(), '?disabled'), true);
    handlers(element.render(), 'click')[0].call(element);
    assert.equal(events.length, 1);
  }
});
test('volume range changes unmute, preserve percentage semantics and respect disabled', () => {
  const { element, events } = control('volume', 'ControlsVolume');
  handlers(element.render(), 'click')[0].call(element);
  assert.equal(boundValue(element.render(), 'aria-pressed'), true);
  assert.equal(boundValue(element.render(), 'aria-valuetext'), '100%, muted');
  handlers(element.render(), 'input')[0].call(element, { target: { value: '35' } });
  assert.equal(element.volume, 0.35);
  assert.equal(element.muted, false);
  assert.equal(events[1].type, 'volumeChange');
  assert.equal(events[1].detail.volume, 0.35);
  element.disabled = true;
  handlers(element.render(), 'input')[0].call(element, { target: { value: '80' } });
  handlers(element.render(), 'click')[0].call(element);
  assert.equal(events.length, 2);
});
test('seek range exposes readable time and emits seconds, but cannot seek while disabled', () => {
  const { element, events } = control('progress', 'ControlsProgress');
  assert.equal(boundValue(element.render(), '?disabled'), true);
  element.max = 125;
  element.value = 62;
  assert.equal(boundValue(element.render(), 'aria-valuetext'), '1 minute 2 seconds of 2 minutes 5 seconds');
  handlers(element.render(), 'input')[0].call(element, { target: { value: '63' } });
  assert.equal(events[0].detail.value, 63);
  element.disabled = true;
  handlers(element.render(), 'input')[0].call(element, { target: { value: '70' } });
  assert.equal(events.length, 1);
});
