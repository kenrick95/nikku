const assert = require('assert').strict;

function test(name, block) {
  try {
    block();
    console.log('\x1b[32m[OK]\x1b[0m', name);
  } catch (error) {
    console.error('\x1b[31m[FAIL]\x1b[0m', name, error);
    process.exitCode = 1;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      assert.strictEqual(actual, expected);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected);
    },
    toThrow(expected) {
      assert.throws(actual, expected);
    },
  };
}

module.exports = { expect, test };
