import { Brstm } from 'brstm';
import { AudioPlayer } from './audio-player/audioPlayer';
import { Reactive } from './reactive';
import { Timer } from './timer';
import { ControlsPlayPause } from './controls/controls-play-pause';
import { ControlsTracks } from './controls/controls-tracks';
import { ControlsTimeDisplay } from './controls/controls-time-display';
import { ControlsProgress } from './controls/controls-progress';
import { ControlsVolume } from './controls/controls-volume';
import { ControlsLoop } from './controls/controls-loop';

// Side-effect import to define custom elements
import './controls/controls-play-pause';
import './controls/controls-tracks';
import './controls/controls-time-display';
import './controls/controls-progress';
import './controls/controls-volume';
import './controls/controls-loop';

function showError(e: Error) {
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
  let audioPlayer: AudioPlayer | null = null;

  const uiState = {
    playPause: new Reactive<string>('play'),
    loop: new Reactive<string>('on'),
    volume: new Reactive<number>(1),
    muted: new Reactive<boolean>(false),
    progressMax: new Reactive<number>(0),
    progressValue: new Reactive<number>(0),
    timeDisplayMax: new Reactive<number>(0),
    timeDisplayValue: new Reactive<number>(0),
    tracksCount: new Reactive<number>(1),
    tracksActive: new Reactive<boolean[]>([true]),
    disabled: new Reactive<boolean>(true),
    fileDraggingOver: new Reactive<boolean>(false),
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
    const elControlsSelectFile = document.getElementById(
      'controls-select-file'
    ) as HTMLInputElement;

    window.addEventListener('dragover', (ev) => {
      // Prevent opening file
      ev.preventDefault();

      // Display drag & drop overlay
      uiState.fileDraggingOver.set(true);
    });
    window.addEventListener('dragend', (ev) => {
      uiState.fileDraggingOver.set(false);
    });
    window.addEventListener('dragleave', (ev) => {
      uiState.fileDraggingOver.set(false);
    });

    const elDragAndDropOverlay = document.getElementById(
      'drag-and-drop-overlay'
    );
    uiState.fileDraggingOver.on('change', (newValue) => {
      if (!elDragAndDropOverlay) {
        return;
      }
      if (newValue) {
        elDragAndDropOverlay.classList.remove('hidden');
      } else {
        elDragAndDropOverlay.classList.add('hidden');
      }
    });

    function onFileSelected(
      callback: (
        error: Error | null,
        buffer?: string | ArrayBuffer | null,
        fileName?: string | null
      ) => void
    ) {
      elControlsSelectFile.addEventListener('change', () => {
        const files = elControlsSelectFile.files;
        if (!files || !files.length) {
          callback(new Error('No file read'));
          return;
        }

        const file = files[0];
        readFile(file);
      });

      window.addEventListener('drop', (ev) => {
        // Prevent opening file
        ev.preventDefault();
        uiState.fileDraggingOver.set(false);
        if (
          !ev.dataTransfer ||
          !ev.dataTransfer.items ||
          !ev.dataTransfer.items[0] ||
          ev.dataTransfer.items[0].kind !== 'file'
        ) {
          callback(new Error('No file read'));
          return;
        }

        const file = ev.dataTransfer.items[0].getAsFile();
        if (!file) {
          callback(new Error('No file read'));
          return;
        }

        readFile(file);
      });

      function readFile(file: File) {
        const fileReader = new FileReader();
        fileReader.addEventListener('loadend', (ev) => {
          const buffer = fileReader.result;
          callback(null, buffer, file.name);
        });
        fileReader.readAsArrayBuffer(file);
      }
    }

    onFileSelected(async (error, buffer, fileName) => {
      clearError();
      if (error) {
        showError(error);
        return;
      }
      if (!buffer || !(buffer instanceof ArrayBuffer)) {
        return;
      }

      let elTrackTitle = document.querySelector('#track-title');
      if (elTrackTitle && fileName) {
        elTrackTitle.textContent = fileName;
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
        if (uiState.muted.get()) {
          audioPlayer.setVolume(0);
        } else {
          audioPlayer.setVolume(uiState.volume.get());
        }

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
        showError(e as Error);
      }
    });
  }

  {
    const elControlsPlayPause = document.querySelector(
      'controls-play-pause'
    ) as ControlsPlayPause;
    elControlsPlayPause.addEventListener('playPauseClick', (e) => {
      uiState.playPause.set((e as CustomEvent).detail.mode);
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
    const elControlsTracks = document.querySelector(
      'controls-tracks'
    ) as ControlsTracks;
    uiState.tracksCount.on('change', (newCount: number) => {
      elControlsTracks.setAttribute('count', String(newCount));
    });
    uiState.tracksActive.on('change', (newActiveStates: Array<boolean>) => {
      elControlsTracks.setAttribute('active', JSON.stringify(newActiveStates));
    });

    elControlsTracks.addEventListener('tracksActiveChange', (e) => {
      /** @type {Array<boolean>} */
      const newActive: Array<boolean> = (e as CustomEvent).detail.active;
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
    const elControlsLoop = document.querySelector(
      'controls-loop'
    ) as ControlsLoop;
    elControlsLoop.addEventListener('loopClick', (e) => {
      uiState.loop.set((e as CustomEvent).detail.mode);
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
    const elControlsVolume = document.querySelector(
      'controls-volume'
    ) as ControlsVolume;
    elControlsVolume.addEventListener('volumeChange', (e) => {
      uiState.volume.set((e as CustomEvent).detail.volume);
      uiState.muted.set(false);
    });
    uiState.volume.on('change', (newVolume) => {
      audioPlayer?.setVolume(newVolume);
    });
    uiState.disabled.on('change', (newDisabledValue) => {
      if (newDisabledValue) {
      } else {
        elControlsVolume.removeAttribute('disabled');
      }
    });

    elControlsVolume.addEventListener('mutedChange', (e) => {
      uiState.muted.set((e as CustomEvent).detail.muted);
    });
    uiState.muted.on('change', (newMuted) => {
      if (newMuted) {
        audioPlayer?.setVolume(0);
        elControlsVolume.setAttribute('muted', 'muted');
      } else {
        audioPlayer?.setVolume(uiState.volume.get());
        elControlsVolume.removeAttribute('muted');
      }
    });
  }
  {
    const elProgressBar = document.querySelector(
      'controls-progress'
    ) as ControlsProgress;
    elProgressBar.addEventListener('progressValueChange', (e) => {
      /**
       * @type {number}
       */
      const newProgressValue: number = (e as CustomEvent).detail.value;

      uiState.progressValue.set(newProgressValue);
      uiState.timeDisplayValue.set(newProgressValue);
      let targetTimeInS = newProgressValue;
      audioPlayer?.seek(targetTimeInS);
    });
    uiState.progressValue.on(
      'change',
      (/** @type {number} */ newProgressValue: number) => {
        elProgressBar.setAttribute('value', String(newProgressValue));
      }
    );
    uiState.progressMax.on(
      'change',
      (/** @type {number} */ newMaxValue: number) => {
        elProgressBar.setAttribute('max', String(newMaxValue));
      }
    );
    uiState.disabled.on('change', (newDisabledValue) => {
      if (newDisabledValue) {
        elProgressBar.setAttribute('disabled', '');
      } else {
        elProgressBar.removeAttribute('disabled');
      }
    });
  }

  {
    const elTimeDisplay = document.querySelector(
      'controls-time-display'
    ) as ControlsTimeDisplay;

    uiState.timeDisplayMax.on(
      'change',
      (/** @type {number} */ newMaxValue: number) => {
        elTimeDisplay.setAttribute('max', String(newMaxValue));
      }
    );
    uiState.timeDisplayValue.on(
      'change',
      (/** @type {number} */ newValue: number) => {
        elTimeDisplay.setAttribute('value', String(newValue));
      }
    );
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
