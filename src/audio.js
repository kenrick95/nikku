export class AudioPlayer {
  constructor({ sampleRate }) {
    this.audioContext = new AudioContext({
      sampleRate
    });
    this.audioSource = this.audioContext.createBufferSource();
  }

  async decode(audioData) {
    const decodedData = await this.audioContext.decodeAudioData(audioData);

    this.audioSource.buffer = decodedData;
    this.audioSource.connect(this.audioContext.destination);
    // this.audioSource.loop = true;

    console.log(this.audioContext, this.audioSource);
  }
}
