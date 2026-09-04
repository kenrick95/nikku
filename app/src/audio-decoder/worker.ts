import { Bfstm } from 'bfstm';
import type { Metadata as BfstmMetadata } from 'bfstm';
import { Brstm } from 'brstm';
import type { Metadata as BrstmMetadata } from 'brstm';
import { transfer } from 'comlink';

let instance: Brstm | Bfstm | null = null;
export function init(receivedBuffer: ArrayBuffer) {
  instance = null;
  if (receivedBuffer.byteLength < 4) {
    throw new Error('Unsupported file: expected a BRSTM or BFSTM file');
  }
  const magic = String.fromCharCode(...new Uint8Array(receivedBuffer, 0, 4));
  if (magic === 'RSTM') {
    instance = new Brstm(receivedBuffer);
  } else if (magic === 'FSTM') {
    instance = new Bfstm(receivedBuffer);
  } else {
    throw new Error('Unsupported file: expected a BRSTM or BFSTM file');
  }
}
export function destroy() {
  instance = null;
}
export function getMetadata(): BrstmMetadata | BfstmMetadata | undefined {
  if (!instance) {
    return;
  }
  return instance.metadata;
}

export function getAllSamples() {
  if (!instance) {
    return;
  }
  const allSamples = instance.getAllSamples();
  return transfer(
    allSamples,
    allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer)
  );
}

export function getSamples(offset: number, size: number) {
  if (!instance) {
    return;
  }
  const allSamples = instance.getSamples(offset, size).map(convertToFloat32);
  return transfer(
    allSamples,
    allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer)
  );
}

function convertToFloat32(pcmSamples: Int16Array): Float32Array {
  // https://stackoverflow.com/a/17888298/917957
  const floats = new Float32Array(pcmSamples.length);
  for (let i = 0; i < pcmSamples.length; i++) {
    const sample = pcmSamples[i];
    floats[i] = sample < 0 ? sample / 0x8000 : sample / 0x7fff;
  }
  return floats;
}
