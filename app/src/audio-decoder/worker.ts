import { Brstm, Metadata } from 'brstm';
import { transfer } from 'comlink';

let buffer: ArrayBuffer | null = null;
let brstm: Brstm | null = null;
export function init(receivedBuffer: ArrayBuffer) {
  buffer = receivedBuffer;
  brstm = new Brstm(receivedBuffer);
}
export function destroy() {
  buffer = null;
  brstm = null;
}
export function getMetadata(): Metadata | undefined {
  if (!brstm) {
    return;
  }
  return brstm.metadata;
}

export function getAllSamples() {
  if (!brstm) {
    return;
  }
  const allSamples = brstm.getAllSamples();
  return transfer(
    allSamples,
    allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer)
  );
}

export function getSamples(offset: number, size: number) {
  if (!brstm) {
    return;
  }
  const allSamples = brstm.getSamples(offset, size);
  return transfer(
    allSamples,
    allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer)
  );
}
