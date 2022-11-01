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

// export function getAllSamples() {
//   if (!brstm) {
//     return;
//   }
//   const allSamples = brstm.getAllSamples();
//   return transfer(
//     allSamples,
//     allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer)
//   );
// }

// export function getSamples(offset: number, size: number) {
//   if (!brstm) {
//     return;
//   }
//   const allSamples = brstm.getSamples(offset, size).map(convertToFloat32);
//   return transfer(
//     allSamples,
//     allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer)
//   );
// }


function convertToFloat32(pcmSamples: Int16Array): Float32Array {
  // https://stackoverflow.com/a/17888298/917957
  const floats = new Float32Array(pcmSamples.length);
  for (let i = 0; i < pcmSamples.length; i++) {
    const sample = pcmSamples[i];
    floats[i] = sample < 0 ? sample / 0x8000 : sample / 0x7fff;
  }
  return floats;
}