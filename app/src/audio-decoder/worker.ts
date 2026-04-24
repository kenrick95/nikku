import { Bfstm, Metadata } from 'bfstm';
// import { transfer } from 'comlink';

let instance: Bfstm | null = null;
export function init(receivedBuffer: ArrayBuffer) {
  instance = new Bfstm(receivedBuffer);
}
export function destroy() {
  instance = null;
}
export function getMetadata(): Metadata | undefined {
  if (!instance) {
    return;
  }
  return instance.metadata;
}

export function getAllSamples(): Array<Int16Array> | undefined {
  if (!instance) {
    return;
  }
  return instance.getAllSamples();
}

export function getSamples(
  offset: number,
  size: number
): Array<Float32Array> | undefined {
  if (!instance) {
    return;
  }
  return instance.getSamples(offset, size).map(convertToFloat32);
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