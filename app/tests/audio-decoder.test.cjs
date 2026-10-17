const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');

function worker() {
  const calls = [];
  const decoder = (format) => class {
    constructor(buffer) {
      calls.push({ format, buffer });
      this.metadata = { format };
    }
  };
  const dependencies = {
    bfstm: { Bfstm: decoder('BFSTM/BCSTM') },
    brstm: { Brstm: decoder('BRSTM') },
    comlink: { transfer: (value) => value },
  };
  const source = readFileSync(new URL('../src/audio-decoder/worker.ts', 'file://' + __filename), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  runInNewContext(outputText, { exports, require: (name) => {
    assert.ok(name in dependencies, 'Unexpected dependency: ' + name);
    return dependencies[name];
  } });
  return { ...exports, calls };
}

for (const [magic, format] of [['RSTM', 'BRSTM'], ['FSTM', 'BFSTM/BCSTM'], ['CSTM', 'BFSTM/BCSTM']]) {
  test(`routes ${magic} to its decoder without changing the header`, () => {
    const decoder = worker();
    const buffer = Uint8Array.from(magic, (character) => character.charCodeAt(0)).buffer;
    decoder.init(buffer);
    assert.equal(decoder.getMetadata().format, format);
    assert.equal(decoder.calls[0].buffer, buffer);
    assert.equal(String.fromCharCode(...new Uint8Array(buffer)), magic);
    decoder.destroy();
    assert.equal(decoder.getMetadata(), undefined);
  });
}

test('rejects short or unsupported headers and clears the previous decoder', () => {
  const decoder = worker();
  const valid = Uint8Array.from([0x43, 0x53, 0x54, 0x4d]).buffer;
  for (const invalid of [new ArrayBuffer(3), new ArrayBuffer(4)]) {
    decoder.init(valid);
    assert.throws(() => decoder.init(invalid), /expected a BRSTM, BFSTM, or BCSTM file/);
    assert.equal(decoder.getMetadata(), undefined);
  }
});
