const assert = require('assert').strict;

const color = {
  /**
   * @param {string} message
   */
  green: (message) => {
    return '\x1b[32m' + message + '\x1b[0m';
  },
  /**
   * @param {string} message
   */
  red: (message) => {
    return '\x1b[31m' + message + '\x1b[0m';
  },
};

/**
 *
 * @param {string} testName
 * @param {() => void} block
 */
function test(testName, block) {
  try {
    block();
    console.log(color.green(`[OK]`), `${testName}`);
  } catch (e) {
    console.error(color.red(`[FAIL]`), `${testName}:\r\n`, e, '\r\n\r\n');
    require('process').exitCode = 1;
  }
}

/**
 * @template T
 * @param {T} actualValue
 * @returns {{
 *  toBe: (expectedValue: T) =>  void,
 *  toEqual: (expectedValue: T) =>  void,
 * }}
 */
function expect(actualValue) {
  return {
    toBe: (expectedValue) => {
      assert.strictEqual(actualValue, expectedValue);
    },
    toEqual: (expectedValue) => {
      assert.deepStrictEqual(actualValue, expectedValue);
    },
  };
}

module.exports = {
  test,
  expect,
};
