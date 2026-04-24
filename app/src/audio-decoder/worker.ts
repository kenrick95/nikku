import { Brstm, Metadata as BrstmMetadata } from 'brstm';
import { Bfstm, Metadata as BfstmMetadata } from 'bfstm';
import { transfer } from 'comlink';

let instance: Brstm | Bfstm | null = null;
export function init(receivedBuffer: ArrayBuffer) {
  try {
    instance = new Brstm(receivedBuffer);
  } catch (e) {
    try {
      instance = new Bfstm(receivedBuffer);
    } catch (e) {
      console.error('Failed to decode the audio data as Brstm and Bfstm.', e);
    }
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
    allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer),
  );
}

export function getSamples(offset: number, size: number) {
  if (!instance) {
    return;
  }
  const allSamples = instance.getSamples(offset, size).map(convertToFloat32);
  return transfer(
    allSamples,
    allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer),
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
