import { Brstm } from './brstm/index.js';
import { AudioPlayer } from './audioPlayer.js';

document.addEventListener('DOMContentLoaded', () => {
  const fileElement = document.getElementById('file');
  /**
   * @type {null|AudioPlayer}
   */
  let audioPlayer = null;
  const elTime = document.getElementById('controls-time');
  const elPlayPause = document.getElementById('controls-play-pause');
  const elLoop = document.getElementById('controls-loop');
  const elVolume = document.getElementById('controls-volume');
  const elTimeCurrent = document.getElementById('controls-time-current');
  const elTimeAmount = document.getElementById('controls-time-amount');
  const elStreamSelect = document.getElementById('controls-stream-select');
  const elErrors = document.getElementById('errors');
  let currentTimeRenderAf = null;
  let shouldCurrentTimeRender = false;
  let isElTimeDragging = false;
  let streamStates = [true];

  fileElement.setAttribute('disabled', 'disabled');
  function reset() {
    stopRenderCurrentTime();
    currentTimeRenderAf = null;
    shouldCurrentTimeRender = false;
    isElTimeDragging = false;
    elTime.value = 0;
    elTime.max = 0;
    elTime.setAttribute('disabled', 'disabled');
    elPlayPause.setAttribute('disabled', 'disabled');
    elLoop.setAttribute('disabled', 'disabled');
    elLoop.setAttribute('checked', 'true');
    elVolume.value = 1;
    elVolume.setAttribute('disabled', 'disabled');
    fileElement.removeAttribute('disabled');
    elStreamSelect.removeAttribute('style');
    elErrors.textContent = '';
    streamStates = [true];
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

        audioPlayer = new AudioPlayer(brstm.metadata, {
          onPlayed: () => {
            elPlayPause.textContent = 'Pause';
          },
          onPaused: () => {
            elPlayPause.textContent = 'Play';
          },
        });

        // TODO: This seems slow, taking around 200ms
        console.time('brstm.getAllSamples');
        const allSamples = brstm.getAllSamples();
        console.timeEnd('brstm.getAllSamples');

        audioPlayer.load(allSamples);

        elTime.removeAttribute('disabled');
        elPlayPause.removeAttribute('disabled');

        elLoop.removeAttribute('disabled');
        elVolume.removeAttribute('disabled');
        elVolume.value = 1;

        // Reset elStreamSelect
        elStreamSelect.removeAttribute('style');
        elStreamSelect.innerHTML = '';

        if (brstm.metadata.numberChannels > 2) {
          const numberStreams = Math.floor(brstm.metadata.numberChannels / 2);
          const text = document.createElement('span');
          text.textContent = 'Stream(s) enabled:';
          text.title =
            'This file contains more than 1 streams, check or uncheck the checkboxes to enable/disable each stream';
          elStreamSelect.appendChild(text);
          streamStates = [];
          for (let i = 0; i < numberStreams; i++) {
            const child = document.createElement('input');
            child.type = 'checkbox';
            if (i === 0) {
              child.checked = true;
              streamStates.push(true);
            } else {
              child.checked = false;
              streamStates.push(false);
            }
            child.title = `Stream ${i + 1}`;
            child.addEventListener('input', streamCheckedHandler.bind(this, i));
            elStreamSelect.appendChild(child);
          }
          elStreamSelect.style.display = 'block';
        }

        const amountTimeInS =
          brstm.metadata.totalSamples / brstm.metadata.sampleRate;
        elTimeAmount.textContent = formatTime(amountTimeInS);
        elTime.max = amountTimeInS;

        audioPlayer.setLoop(elLoop.checked);
        startRenderCurrentTime();
      } catch (e) {
        console.error('e', e);
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

  elPlayPause.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    if (audioPlayer.isPlaying) {
      audioPlayer.pause();
      stopRenderCurrentTime();
      disableStreamCheckboxes();
    } else {
      audioPlayer.play();
      startRenderCurrentTime();
      enableStreamCheckboxes();
    }
  });

  function streamCheckedHandler(i) {
    if (!audioPlayer) {
      return;
    }
    streamStates[i] = !streamStates[i];
    audioPlayer.setStreamStates(streamStates);
  }

  elLoop.addEventListener('input', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    audioPlayer.setLoop(e.target.checked);
  });

  /**
   * To throttle the input event
   */
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

  elVolume.addEventListener('input', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    let volume = Math.round(parseFloat(e.target.value) * 1000) / 1000;
    audioPlayer.setVolume(volume);
  });

  function displayUnsupported() {
    document.getElementById('unsupported').style.display = 'block';
  }
  function isCompatible() {
    return 'AudioContext' in self;
  }

  function disableStreamCheckboxes() {
    for (const child of elStreamSelect.childNodes) {
      child.disabled = true;
    }
  }
  function enableStreamCheckboxes() {
    for (const child of elStreamSelect.childNodes) {
      child.disabled = false;
    }
  }

  if (isCompatible()) {
    reset();
  } else {
    displayUnsupported();
  }
});
