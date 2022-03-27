import { Brstm } from 'brstm';
import { transfer } from 'comlink';

export function decode(buffer: ArrayBuffer) {
  const brstm = new Brstm(buffer);
  const allSamples = brstm.getAllSamples();
  return {
    metadata: brstm.metadata,
    allSamples: transfer(
      allSamples,
      allSamples.map((allSamplesPerChannel) => allSamplesPerChannel.buffer)
    ),
  };
}
