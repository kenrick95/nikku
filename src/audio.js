import imaadpcm from 'https://dev.jspm.io/imaadpcm';

export class AudioPlayer {
  constructor(metadata) {
    this.metadata = metadata;

    this.audioContext = new AudioContext({
      sampleRate: metadata.sampleRate
    });
    this.bufferSource = this.audioContext.createBufferSource();
  }

  async decode(rawData) {
    // block? sample? ???
    // partition per channel???

    const pcmSamples = imaadpcm.decode(rawData, this.metadata.blockSize);
    // {Int16Array} samples 16-bit PCM samples
    console.log('pcmSamples', pcmSamples);
    // const decodedData = await this.audioContext.decodeAudioData(audioData);

    // https://stackoverflow.com/a/17888298/917957
    const floats = new Float32Array(pcmSamples.length);
    pcmSamples.forEach(function(sample, i) {
      floats[i] = sample < 0 ? sample / 0x80 : sample / 0x7f;
    });

    const audioBuffer = this.audioContext.createBuffer(
      1,
      floats.length,
      this.audioContext.sampleRate
    );
    audioBuffer.getChannelData(0).set(floats);

    this.bufferSource.buffer = audioBuffer;
    this.bufferSource.connect(this.audioContext.destination);
    // this.bufferSource.loop = true;
    // this.bufferSource.start(0);

    console.log(this.audioContext, this.bufferSource);
  }
}
