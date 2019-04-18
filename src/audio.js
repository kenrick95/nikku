export class AudioPlayer {
  constructor(metadata) {
    this.metadata = metadata;

    this.audioContext = new AudioContext({
      sampleRate: metadata.sampleRate
    });
    this.bufferSource = this.audioContext.createBufferSource();

    this.samples = [];
  }


  /**
   *
   * @returns {Float32Array} audio buffer's channel data
   * @param {Int16Array} pcmSamples
   */
  convertToAudioBufferData(pcmSamples) {
    // https://stackoverflow.com/a/17888298/917957
    const floats = new Float32Array(pcmSamples.length);
    pcmSamples.forEach(function(sample, i) {
      // normalize [-32768..32767] (Int16) to [-1..1] (Float32)
      floats[i] = sample < 0 ? sample / 0x8000 : sample / 0x7fff; 
    });
    console.log('floats', floats);
    return floats;
  }

  /**
   *
   * @param {Array<Int16Array>} samples per-channel PCM samples
   */
  async load(samples) {
    const { numberChannels } = this.metadata;

    const floatsArray = samples.map((sample) => {
      return this.convertToAudioBufferData(sample);
    });

    const audioBuffer = this.audioContext.createBuffer(
      numberChannels,
      numberChannels * floatsArray[0].length,
      this.audioContext.sampleRate
    );
    for (let c = 0; c < numberChannels; c++) {
      audioBuffer.getChannelData(c).set(floatsArray[c]);
    }

    this.bufferSource.buffer = audioBuffer;
    this.bufferSource.connect(this.audioContext.destination);
    this.bufferSource.start(0);
  }

  async play() {
    await this.audioContext.resume();
  }
  async pause() {
    await this.audioContext.suspend();
  }
}
