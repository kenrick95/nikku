// File description: https://wiibrew.org/wiki/BRSTM_file
import { getMetadata } from './metadata.js';
import { AudioPlayer } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  const fileElement = document.getElementById('file');

  fileElement.addEventListener('input', () => {
    const file = fileElement.files[0];
    const headerReader = new FileReader();
    headerReader.addEventListener('loadend', (ev) => {
      const buffer = headerReader.result;
      const uint8Array = new Uint8Array(buffer);

      const metadata = getMetadata(uint8Array);

      console.log('metadata', metadata);
      const audioPlayer = new AudioPlayer({
        sampleRate: metadata.sampleRate
      });

      // const audioBuffer = buffer.slice(
      //   metadata.offsetToData,
      //   metadata.offsetToData + metadata.audioDataSize
      // );

      // audioPlayer.decode(audioBuffer)
    });
    headerReader.readAsArrayBuffer(file);
  });
});
