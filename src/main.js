// File description: https://wiibrew.org/wiki/BRSTM_file
import { Brstm } from './brstm.js';
import { AudioPlayer } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  const fileElement = document.getElementById('file');
  let audioPlayer = null;

  fileElement.addEventListener('input', () => {
    const file = fileElement.files[0];
    const headerReader = new FileReader();
    headerReader.addEventListener('loadend', (ev) => {
      const buffer = headerReader.result;
      const brstm = new Brstm(buffer);

      console.log('brstm', brstm);

      renderMetadata(brstm.metadata);

      const samples = brstm.getAllSamples();

      // console.log('samples', samples);
      audioPlayer = new AudioPlayer(brstm.metadata);

      audioPlayer.load(samples);

      document.getElementById('controls-play').removeAttribute('disabled');
      document.getElementById('controls-pause').removeAttribute('disabled');
      document.getElementById('controls-loop').removeAttribute('disabled');

      audioPlayer.setLoop(document.getElementById('controls-loop').checked);
    });
    headerReader.readAsArrayBuffer(file);
  });

  function renderMetadata(metadata) {
    const metadataContainerElement = document.getElementById(
      'metadata-container'
    );
    metadataContainerElement.style.display = 'block';
    const metadataBodyElement = document.getElementById('metadata-body');
    const metadataRowTemplateElement = document.getElementById('metadata-row');
    metadataBodyElement.innerHTML = '';
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value !== 'string' && typeof value !== 'number') {
        continue;
      }
      const clone = document.importNode(
        metadataRowTemplateElement.content,
        true
      );
      const td = clone.querySelectorAll('td');
      td[0].textContent = key;
      td[1].textContent = value;
      metadataBodyElement.appendChild(clone);
    }
  }

  document.getElementById('controls-play').addEventListener('click', () => {
    if (!audioPlayer) {
      return;
    }
    audioPlayer.play();
  });
  document.getElementById('controls-pause').addEventListener('click', () => {
    if (!audioPlayer) {
      return;
    }
    audioPlayer.pause();
  });

  document.getElementById('controls-loop').addEventListener('input', (e) => {
    if (!audioPlayer) {
      return;
    }
    audioPlayer.setLoop(e.target.checked);
  });
});
