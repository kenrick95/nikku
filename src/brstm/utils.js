export function getSlice(uint8Array, start, length) {
  const result = [];
  for (let i = start; i < start + length; i++) {
    // Apparently unsigned
    result.push(uint8Array[i]);
  }
  return result;
}
export function getSliceAsString(uint8Array, start, length) {
  const resArr = getSlice(uint8Array, start, length);
  return String.fromCharCode(...resArr);
}
export function getSliceAsNumber(uint8Array, start, length) {
  const resArr = getSlice(uint8Array, start, length);
  return resArr.reduce((acc, curr) => acc * 256 + curr, 0);
}

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
