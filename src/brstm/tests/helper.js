//@ts-check

const assert = require('assert').strict;

function test(testName, block) {
  try {
    block();
    console.log(`[OK] ${testName}`)
  } catch (e) {
    console.error(`[FAIL] ${testName}: ${e.message}`, e);
  }
}

function expect(actualValue) {
  return {
    toBe: (expectedValue) => {
      assert.equal(actualValue, expectedValue);
    },
  };
}

module.exports = {
  test,
  expect,
};
