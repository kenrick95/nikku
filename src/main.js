//@ts-check
import { Brstm } from './brstm/index.js';
import { AudioPlayer } from './audioPlayer.js';
import './controls-progress.js';
import './controls-play-pause.js';
import './controls-loop.js';
import './controls-volume.js';

document.addEventListener('DOMContentLoaded', () => {
  let playPauseState = 'play';
  let loopState = 'on';

  {
    const elControlsPlayPause = document.querySelector('controls-play-pause');
    elControlsPlayPause.addEventListener('playPauseClick', (e) => {
      // @ts-ignore
      playPauseState = e.detail.mode;
    });
  }

  {
    const elControlsLoop = document.querySelector('controls-loop');
    elControlsLoop.addEventListener('loopClick', (e) => {
      // @ts-ignore
      loopState = e.detail.mode;
    });
  }

  return;

  // @ts-ignore
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
  const elTrackSelect = document.getElementById('controls-track-select');
  const elErrors = document.getElementById('errors');
  let currentTimeRenderAf = null;
  let shouldCurrentTimeRender = false;
  let isElTimeDragging = false;
  let trackStates = [true];
  /**
   * 0..1
   */
  let volume = 1;

  fileElement.setAttribute('disabled', 'disabled');
  function reset() {
    stopRenderCurrentTime();
    currentTimeRenderAf = null;
    shouldCurrentTimeRender = false;
    isElTimeDragging = false;
    // @ts-ignore
    elTime.value = 0;
    // @ts-ignore
    elTime.max = 0;
    elTime.setAttribute('disabled', 'disabled');
    elPlayPause.setAttribute('disabled', 'disabled');
    elLoop.setAttribute('disabled', 'disabled');
    elLoop.setAttribute('checked', 'true');
    elVolume.setAttribute('disabled', 'disabled');
    // @ts-ignore
    volume = Math.round(parseFloat(elVolume.value) * 1000) / 1000;
    volume = Math.min(1, Math.max(0, volume));
    // @ts-ignore
    elVolume.value = volume;

    fileElement.removeAttribute('disabled');
    elTrackSelect.removeAttribute('style');
    elErrors.textContent = '';
    trackStates = [true];
  }

  // @ts-ignore
  fileElement.addEventListener('change', () => {
    // @ts-ignore
    const file = fileElement.files[0];
    const headerReader = new FileReader();
    // @ts-ignore
    headerReader.addEventListener('loadend', async (ev) => {
      try {
        elErrors.textContent = '';

        const buffer = headerReader.result;

        // @ts-ignore
        const brstm = new Brstm(buffer);

        // console.log('brstm', brstm);

        renderMetadata(brstm.metadata);

        if (audioPlayer) {
          audioPlayer.destroy();
        }

        audioPlayer = new AudioPlayer(brstm.metadata, {
          onPlay: () => {
            elPlayPause.textContent = 'Pause';
          },
          onPause: () => {
            elPlayPause.textContent = 'Play';
          },
        });

        // TODO: This seems slow, taking around 200ms
        console.time('brstm.getAllSamples');
        const allSamples = brstm.getAllSamples();
        console.timeEnd('brstm.getAllSamples');

        await audioPlayer.readyPromise;
        audioPlayer.load(allSamples);

        elTime.removeAttribute('disabled');
        elPlayPause.removeAttribute('disabled');

        elLoop.removeAttribute('disabled');
        elVolume.removeAttribute('disabled');

        // Reset elTrackSelect
        elTrackSelect.removeAttribute('style');
        // @ts-ignore
        elTrackSelect.setAttribute('tabindex', 0);
        elTrackSelect.innerHTML = '';

        const numberTracks = brstm.metadata.numberTracks;

        if (numberTracks > 1) {
          const text = document.createElement('span');
          text.textContent = 'Track(s) enabled:';
          text.title =
            'This file contains more than 1 track, check or uncheck the checkboxes to enable/disable each track';
          elTrackSelect.appendChild(text);
          trackStates = [];
          for (let i = 0; i < numberTracks; i++) {
            const child = document.createElement('input');
            child.type = 'checkbox';
            if (i === 0) {
              child.checked = true;
              trackStates.push(true);
            } else {
              child.checked = false;
              trackStates.push(false);
            }
            child.title = `Track ${i + 1}`;
            child.addEventListener('input', trackCheckedHandler.bind(this, i));
            elTrackSelect.appendChild(child);
          }
          elTrackSelect.style.display = 'block';
        }

        const amountTimeInS =
          brstm.metadata.totalSamples / brstm.metadata.sampleRate;
        elTimeAmount.textContent = formatTime(amountTimeInS);
        // @ts-ignore
        elTime.max = amountTimeInS;

        audioPlayer.setVolume(volume);
        // @ts-ignore
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
        // @ts-ignore
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
      // @ts-ignore
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

  // @ts-ignore
  elPlayPause.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    if (audioPlayer.isPlaying) {
      audioPlayer.pause();
      stopRenderCurrentTime();
      disableTrackCheckboxes();
    } else {
      audioPlayer.play();
      startRenderCurrentTime();
      enableTrackCheckboxes();
    }
  });

  function trackCheckedHandler(i) {
    if (!audioPlayer) {
      return;
    }
    trackStates[i] = !trackStates[i];
    audioPlayer.setTrackStates(trackStates);
  }

  // @ts-ignore
  elLoop.addEventListener('input', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioPlayer) {
      return;
    }
    // @ts-ignore
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
      // @ts-ignore
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
    // @ts-ignore
    volume = Math.round(parseFloat(e.target.value) * 1000) / 1000;
    audioPlayer.setVolume(volume);
  });

  function displayUnsupported() {
    document.getElementById('unsupported').style.display = 'block';
  }
  function isCompatible() {
    return 'AudioContext' in self;
  }

  function disableTrackCheckboxes() {
    for (const child of elTrackSelect.childNodes) {
      // @ts-ignore
      child.disabled = true;
    }
  }
  function enableTrackCheckboxes() {
    for (const child of elTrackSelect.childNodes) {
      // @ts-ignore
      child.disabled = false;
    }
  }

  // @ts-ignore
  if (isCompatible()) {
    reset();
  } else {
    displayUnsupported();
  }
});
