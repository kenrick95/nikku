import { Brstm } from './brstm/index.js';
import { AudioPlayer } from './audioPlayer.js';

document.addEventListener('DOMContentLoaded', () => {
  const fileElement = document.getElementById('file');
  let audioPlayer = null;
  const elTime = document.getElementById('controls-time');
  const elPlay = document.getElementById('controls-play');
  const elPause = document.getElementById('controls-pause');
  const elLoop = document.getElementById('controls-loop');
  const elTimeCurrent = document.getElementById('controls-time-current');
  const elTimeAmount = document.getElementById('controls-time-amount');
  const elErrors = document.getElementById('errors');
  let currentTimeRenderAf = null;
  let shouldCurrentTimeRender = false;
  let isElTimeDragging = false;

  fileElement.setAttribute('disabled', 'disabled');
  function reset() {
    stopRenderCurrentTime();
    currentTimeRenderAf = null;
    shouldCurrentTimeRender = false;
    isElTimeDragging = false;
    elTime.value = 0;
    elTime.max = 0;
    elTime.setAttribute('disabled', 'disabled');
    elPlay.setAttribute('disabled', 'disabled');
    elPause.setAttribute('disabled', 'disabled');
    elLoop.setAttribute('disabled', 'disabled');
    elLoop.setAttribute('checked', 'true');
    fileElement.removeAttribute('disabled');
    elErrors.textContent = "";
  }

  fileElement.addEventListener('change', () => {
    const file = fileElement.files[0];
    const headerReader = new FileReader();
    headerReader.addEventListener('loadend', async (ev) => {
      try {
        const buffer = headerReader.result;

        const brstm = new Brstm(buffer);

        // console.log('brstm', brstm);

        renderMetadata(brstm.metadata);

        if (audioPlayer) {
          audioPlayer.destroy();
        }

        audioPlayer = new AudioPlayer(brstm.metadata);

        audioPlayer.load(brstm.getAllSamples());

        elTime.removeAttribute('disabled');
        elPlay.removeAttribute('disabled');
        elPause.removeAttribute('disabled');
        elLoop.removeAttribute('disabled');

        const amountTimeInS =
          brstm.metadata.totalSamples / brstm.metadata.sampleRate;
        elTimeAmount.textContent = formatTime(amountTimeInS);
        elTime.max = amountTimeInS;

        audioPlayer.setLoop(elLoop.checked);
        startRenderCurrentTime();
      } catch (e) {
        elErrors.textContent = e.message;
      }
    });
    headerReader.readAsArrayBuffer(file);
  });

  function formatTime(timeAmountInS) {
    const mm = getTwoDigits(Math.floor(timeAmountInS / 60));
    const ss = getTwoDigits(Math.floor(timeAmountInS % 60));
    const xx = getTwoDigits(Math.floor(((timeAmountInS % 60) * 100) % 100));

    return `${mm}:${ss}.${xx}`;
  }
  function getTwoDigits(number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number;
  }

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

  function renderCurrentTime() {
    const currentTime = audioPlayer.getCurrrentPlaybackTime();
    if (!isElTimeDragging) {
      elTime.value = currentTime;
    }
    elTimeCurrent.textContent = formatTime(currentTime);

    if (shouldCurrentTimeRender) {
      currentTimeRenderAf = requestAnimationFrame(renderCurrentTime);
    }
  }

  function startRenderCurrentTime() {
    shouldCurrentTimeRender = true;
    currentTimeRenderAf = requestAnimationFrame(renderCurrentTime);
  }
  function stopRenderCurrentTime() {
    if (currentTimeRenderAf) {
      cancelAnimationFrame(currentTimeRenderAf);
    }
    shouldCurrentTimeRender = false;
  }

  elPlay.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    audioPlayer.play();
    startRenderCurrentTime();
  });
  elPause.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    audioPlayer.pause();
    stopRenderCurrentTime();
  });

  elLoop.addEventListener('input', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    audioPlayer.setLoop(e.target.checked);
  });

  let isElTimeDraggingTimeoutId = null;
  elTime.addEventListener('input', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    isElTimeDragging = true;
    if (isElTimeDraggingTimeoutId) {
      clearTimeout(isElTimeDraggingTimeoutId);
    }
    // Make sure targetTimeInMs is at most "xx.xx" (chop off the 0.00000000000001 floating point error)
    let targetTimeInS =
      Math.round(parseFloat(e.target.value) * 1000 + 150) / 1000;
    isElTimeDraggingTimeoutId = setTimeout(() => {
      isElTimeDragging = false;
      audioPlayer.seek(targetTimeInS);
      startRenderCurrentTime();
    }, 150);
  });
  function displayUnsupported() {
    document.getElementById('unsupported').style.display = 'block';
  }
  function isCompatible() {
    return 'AudioContext' in self;
  }

  if (isCompatible()) {
    reset();
  } else {
    displayUnsupported();
  }
});
