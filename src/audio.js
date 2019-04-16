export class AudioPlayer {
  constructor(metadata) {
    this.metadata = metadata;

    this.audioContext = new AudioContext({
      sampleRate: metadata.sampleRate
    });
    this.bufferSource = this.audioContext.createBufferSource();
  }


  /**
   *
   * @returns {Float32Array} audio buffer's channel data
   * @param {Uint8Array} adpcmSamples
   */
  convertToPcm(adpcmSamples) {
    console.log('adpcmSamples', adpcmSamples);
    // TODO: From reading BrawlLib's source code, looks like "decoding" should not use this "decode" function, but a custom implementation, because many of the coefficients are encoded in the metadata
    const pcmSamples = new Int16Array(this.metadata.totalSamples);
    // {Int16Array} samples 16-bit PCM samples
    console.log('pcmSamples', pcmSamples);

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
   * @param {Uint8Array} rawData
   */
  async decode(rawData) {
    const partitionedData = this.partition(rawData);

    const { numberChannels } = this.metadata;

    const floatsArray = partitionedData.map((channelRawData) => {
      return this.convertToPcm(channelRawData);
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
    // this.bufferSource.loop = true;
    // this.bufferSource.start(0);
    // OMG I HAVE A SOUND PLAYING!!! BUT IT'S FULL OF STATIC NOISES!!!

    console.log(this.audioContext, this.bufferSource);
  }
}
