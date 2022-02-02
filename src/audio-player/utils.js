/**
 * Interpotale [-32768..32767] (Int16) to [-1..1] (Float32)
 * @returns {Float32Array} audio buffer's channel data
 * @param {Int16Array} pcmSamples
 */
export function convertToAudioBufferData(pcmSamples) {
  // https://stackoverflow.com/a/17888298/917957
  const floats = new Float32Array(pcmSamples.length);
  for (let i = 0; i < pcmSamples.length; i++) {
    const sample = pcmSamples[i];
    floats[i] = sample < 0 ? sample / 0x8000 : sample / 0x7fff;
  }
  return floats;
}
