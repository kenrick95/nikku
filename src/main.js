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

      // number of seconds: totalSamples / sampleRate

      console.log('metadata', metadata);
      const audioPlayer = new AudioPlayer(metadata);

      const rawData = uint8Array.slice(
        metadata.offsetToData + 0x20,
        metadata.offsetToData + 0x20 + metadata.audioDataSize
      );
      console.log('rawData', rawData);

      audioPlayer.decode(rawData);
    });
    headerReader.readAsArrayBuffer(file);
  });
});
