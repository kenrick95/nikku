// File description: https://wiibrew.org/wiki/BRSTM_file
import { Brstm } from './brstm.js';
import { AudioPlayer } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  const fileElement = document.getElementById('file');

  fileElement.addEventListener('input', () => {
    const file = fileElement.files[0];
    const headerReader = new FileReader();
    headerReader.addEventListener('loadend', (ev) => {
      const buffer = headerReader.result;
      const brstm = new Brstm(buffer);


      console.log('brstm', brstm);

      const samples = brstm.getAllSamples();

      console.log('samples', samples);
      const audioPlayer = new AudioPlayer(brstm.metadata);

      audioPlayer.play(samples);
    });
    headerReader.readAsArrayBuffer(file);
  });
});
