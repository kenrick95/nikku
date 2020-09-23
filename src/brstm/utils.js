// @ts-check

/**
 *
 * @param {Uint8Array} uint8Array
 * @param {number} start
 * @param {number} length
 * @returns {Array<number>}
 */
export function getSlice(uint8Array, start, length) {
  const result = [];
  for (let i = start; i < start + length; i++) {
    // Apparently unsigned
    result.push(uint8Array[i]);
  }
  return result;
}

/**
 * Endianness
 */
export const ENDIAN = {
  LITTLE: 0,
  BIG: 1,
};

/**
 *
 * Determined from Byte Order Mark (BOM):
 * - 0xFF 0xFE for little endian
 * - 0xFE 0xFF for big endian
 *
 * @param {Uint8Array} uint8Array
 * @returns {number} 0 or 1, 0 denotes little endian; defaults to big endian (1)
 */
export function getEndianness(uint8Array) {
  const byteOrderMark = getSlice(uint8Array, 4, 2);
  if (byteOrderMark[0] === 255 && byteOrderMark[1] === 254) {
    return ENDIAN.LITTLE;
  }

  return ENDIAN.BIG;
}

/**
 *
 * @param {Uint8Array} uint8Array
 * @param {number} start
 * @param {number} length
 * @param {number} endianness
 * @returns {string}
 */
export function getSliceAsString(
  uint8Array,
  start,
  length,
  endianness = ENDIAN.BIG
) {
  const resArr = getSlice(uint8Array, start, length);
  if (endianness === ENDIAN.LITTLE) {
    resArr.reverse();
  }
  return String.fromCharCode(...resArr);
}

/**
 *
 * @param {Uint8Array} uint8Array
 * @param {number} start
 * @param {number} length
 * @param {number} endianness
 * @returns {number}
 */
export function getSliceAsNumber(
  uint8Array,
  start,
  length,
  endianness = ENDIAN.BIG
) {
  const resArr = getSlice(uint8Array, start, length);
  if (endianness === ENDIAN.LITTLE) {
    resArr.reverse();
  }
  return resArr.reduce((acc, curr) => acc * 256 + curr, 0);
}

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number} clamped value to be in between min and max (inclusive)
 */
export function clamp(value, min, max) {
  return value <= min ? min : value >= max ? max : value;
}

/**
 *
 * @param {number} num Uint16
 */
export function getInt16(num) {
  return num >= 0x8000 ? num - 0x10000 : num;
}
