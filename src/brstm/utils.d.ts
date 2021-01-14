/**
 *
 * @param {Uint8Array} uint8Array
 * @param {number} start
 * @param {number} length
 * @returns {Array<number>}
 */
export function getSlice(uint8Array: Uint8Array, start: number, length: number): Array<number>;
/**
 *
 * Determined from Byte Order Mark (BOM):
 * - 0xFF 0xFE for little endian
 * - 0xFE 0xFF for big endian
 *
 * @param {Uint8Array} uint8Array
 * @returns {number} 0 or 1, 0 denotes little endian; defaults to big endian (1)
 */
export function getEndianness(uint8Array: Uint8Array): number;
/**
 *
 * @param {Uint8Array} uint8Array
 * @param {number} start
 * @param {number} length
 * @param {number} endianness
 * @returns {string}
 */
export function getSliceAsString(uint8Array: Uint8Array, start: number, length: number, endianness?: number): string;
/**
 *
 * @param {Uint8Array} uint8Array
 * @param {number} start
 * @param {number} length
 * @param {number} endianness
 * @returns {number}
 */
export function getSliceAsNumber(uint8Array: Uint8Array, start: number, length: number, endianness?: number): number;
/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number} clamped value to be in between min and max (inclusive)
 */
export function clamp(value: number, min: number, max: number): number;
/**
 *
 * @param {number} num Uint16
 */
export function getInt16(num: number): number;
export namespace ENDIAN {
    const LITTLE: number;
    const BIG: number;
}
