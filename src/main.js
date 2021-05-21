//@ts-check
import { Brstm } from './brstm/index.js';
import { AudioPlayer } from './audioPlayer.js';
import { Reactive } from './reactive.js';
import './controls-progress.js';
import './controls-time-display.js';
import './controls-play-pause.js';
import './controls-loop.js';
import './controls-volume.js';
import './controls-tracks.js';
import { Timer } from './timer.js';

/**
 *
 * @param {Error} e
 */
function showError(e) {
  const elError = document.getElementById('error');
  if (elError) {
    elError.style.display = 'block';
    elError.textContent = e.message;
  }
}
function clearError() {
  const elError = document.getElementById('error');
  if (elError) {
    elError.style.display = 'none';
    elError.textContent = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  /**
   * @type {null|AudioPlayer}
   */
  let audioPlayer = null;

  const uiState = {
    playPause: new Reactive('play'),
    loop: new Reactive('on'),
    volume: new Reactive(1),
    progressMax: new Reactive(0),
    progressValue: new Reactive(0),
    timeDisplayMax: new Reactive(0),
    timeDisplayValue: new Reactive(0),
    tracksCount: new Reactive(1),
    tracksActive: new Reactive([true]),
    disabled: new Reactive(true),
  };

  const timer = new Timer({
    renderCallback: () => {
      if (!audioPlayer) {
        return;
      }

      const currentTime = audioPlayer.getCurrrentPlaybackTime();
      // console.log('currentTime', currentTime) TODO: BUG: 1. play, 2. pause, 3. play --> for 2 frames, the "currentTime" is wrong (showing few seconds ahead)
      uiState.progressValue.set(currentTime);
      uiState.timeDisplayValue.set(currentTime);
    },
  });

  {
    const elControlsSelectFile = /** @type {HTMLInputElement} */ (
      document.getElementById('controls-select-file')
    );

    /**
     *
     * @param {(error: Error | null, buffer?: string | ArrayBuffer | null) => void} callback
     */
    function onFileSelected(callback) {
      elControlsSelectFile.addEventListener('change', () => {
        const files = elControlsSelectFile.files;
        if (!files || !files.length) {
          callback(new Error('No file read'));
          return;
        }

        const file = files[0];
        let elTrackTitle = document.querySelector('#track-title');
        if (elTrackTitle) {
          elTrackTitle.textContent = file.name;
        }

        const fileReader = new FileReader();
        fileReader.addEventListener('loadend', (ev) => {
          const buffer = fileReader.result;
          callback(null, buffer);
        });
        fileReader.readAsArrayBuffer(file);
      });
    }

    onFileSelected(async (error, buffer) => {
      clearError();
      if (error) {
        showError(error);
        return;
      }
      if (!buffer || !(buffer instanceof ArrayBuffer)) {
        return;
      }

      try {
        const brstm = new Brstm(buffer);
        // console.log('brstm', brstm);
        if (audioPlayer) {
          audioPlayer.destroy();
        }

        audioPlayer = new AudioPlayer(brstm.metadata, {
          onPlay: () => {},
          onPause: () => {},
        });

        console.time('brstm.getAllSamples');
        const allSamples = brstm.getAllSamples();
        console.timeEnd('brstm.getAllSamples');
        const amountTimeInS =
          brstm.metadata.totalSamples / brstm.metadata.sampleRate;
        const numberTracks = brstm.metadata.numberTracks;

        await audioPlayer.readyPromise;
        audioPlayer.load(allSamples);

        uiState.playPause.set('pause');
        uiState.progressMax.set(amountTimeInS);
        uiState.timeDisplayMax.set(amountTimeInS);

        uiState.tracksCount.set(numberTracks);
        uiState.tracksActive.set(
          new Array(numberTracks)
            .fill(true)
            .map((_, i) => (i === 0 ? true : false))
        );
        uiState.disabled.set(false);
      } catch (e) {
        showError(e);
      }
    });
  }

  {
    const elControlsPlayPause =
      /** @type {import('./controls-play-pause').ControlsPlayPause} */ (
        document.querySelector('controls-play-pause')
      );
    elControlsPlayPause.addEventListener('playPauseClick', (e) => {
      uiState.playPause.set(/** @type {any} */ (e).detail.mode);
    });
    uiState.playPause.on('change', (newPlayPause) => {
      elControlsPlayPause.setAttribute('mode', newPlayPause);
      if (newPlayPause === 'play') {
        audioPlayer?.pause();
        timer.stop();
      } else if (newPlayPause === 'pause') {
        audioPlayer?.play();
        timer.start();
      }
    });
    uiState.disabled.on('change', (newDisabledValue) => {
      if (newDisabledValue) {
        elControlsPlayPause.setAttribute('disabled', '');
      } else {
        elControlsPlayPause.removeAttribute('disabled');
      }
    });
  }
  {
    const elControlsTracks =
      /** @type {import('./controls-tracks').ControlsTracks} */ (
        document.querySelector('controls-tracks')
      );
    uiState.tracksCount.on('change', (/** @type {number} */ newCount) => {
      elControlsTracks.setAttribute('count', String(newCount));
    });
    uiState.tracksActive.on(
      'change',
      (/** @type {Array<boolean>} */ newActiveStates) => {
        elControlsTracks.setAttribute(
          'active',
          newActiveStates
            .map((v, i) => {
              return v ? i : -1;
            })
            .filter((v) => v !== -1)
            .join(',')
        );
      }
    );

    elControlsTracks.addEventListener('tracksActiveChange', (e) => {
      /** @type {Array<boolean>} */
      const newActive = /** @type {any} */ (e).detail.active;
      uiState.tracksActive.set(newActive);

      audioPlayer?.setTrackStates(newActive);
    });
    uiState.disabled.on('change', (newDisabledValue) => {
      if (newDisabledValue) {
        elControlsTracks.setAttribute('disabled', '');
      } else {
        elControlsTracks.removeAttribute('disabled');
      }
    });
  }

  {
    const elControlsLoop =
      /** @type {import('./controls-loop').ControlsLoop} */ (
        document.querySelector('controls-loop')
      );
    elControlsLoop.addEventListener('loopClick', (e) => {
      uiState.loop.set(/** @type {any} */ (e).detail.mode);
    });
    uiState.loop.on('change', (newLoop) => {
      elControlsLoop.setAttribute('mode', newLoop);
      if (newLoop === 'on') {
        audioPlayer?.setLoop(true);
      } else {
        audioPlayer?.setLoop(false);
      }
    });
    uiState.disabled.on('change', (newDisabledValue) => {
      if (newDisabledValue) {
        elControlsLoop.setAttribute('disabled', '');
      } else {
        elControlsLoop.removeAttribute('disabled');
      }
    });
  }

  {
    const elControlsVolume =
      /** @type {import('./controls-volume').ControlsVolume} */ (
        document.querySelector('controls-volume')
      );
    elControlsVolume.addEventListener('volumeChange', (e) => {
      uiState.volume.set(/** @type {any} */ (e).detail.volume);
    });
    uiState.volume.on('change', (newVolume) => {
      audioPlayer?.setVolume(newVolume);
    });
    uiState.disabled.on('change', (newDisabledValue) => {
      if (newDisabledValue) {
        elControlsVolume.setAttribute('disabled', '');
      } else {
        elControlsVolume.removeAttribute('disabled');
      }
    });
  }
  {
    const elProgressBar =
      /** @type {import('./controls-progress').ControlsProgress} */ (
        document.querySelector('controls-progress')
      );
    elProgressBar.addEventListener('progressValueChange', (e) => {
      /**
       * @type {number}
       */
      const newProgressValue = /** @type {any} */ (e).detail.value;

      uiState.progressValue.set(newProgressValue);
      uiState.timeDisplayValue.set(newProgressValue);
      let targetTimeInS = newProgressValue;
      audioPlayer?.seek(targetTimeInS);
    });
    uiState.progressValue.on(
      'change',
      (/** @type {number} */ newProgressValue) => {
        elProgressBar.setAttribute('value', String(newProgressValue));
      }
    );
    uiState.progressMax.on('change', (/** @type {number} */ newMaxValue) => {
      elProgressBar.setAttribute('max', String(newMaxValue));
    });
    uiState.disabled.on('change', (newDisabledValue) => {
      if (newDisabledValue) {
        elProgressBar.setAttribute('disabled', '');
      } else {
        elProgressBar.removeAttribute('disabled');
      }
    });
  }

  {
    const elTimeDisplay =
      /** @type {import('./controls-time-display').ControlsTimeDisplay} */ (
        document.querySelector('controls-time-display')
      );

    uiState.timeDisplayMax.on('change', (/** @type {number} */ newMaxValue) => {
      elTimeDisplay.setAttribute('max', String(newMaxValue));
    });
    uiState.timeDisplayValue.on('change', (/** @type {number} */ newValue) => {
      elTimeDisplay.setAttribute('value', String(newValue));
    });
    uiState.disabled.on('change', (newDisabledValue) => {
      if (newDisabledValue) {
        elTimeDisplay.setAttribute('disabled', '');
      } else {
        elTimeDisplay.removeAttribute('disabled');
      }
    });
  }

  return;
});
