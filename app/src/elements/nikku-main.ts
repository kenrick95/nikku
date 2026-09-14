import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { AudioPlayer } from '../audio-player/audio-player';
import { Timer } from '../timer';
import { PlayerMediaSession, prepareAudioSession } from '../media-session';
import { transfer } from 'comlink';

@customElement('nikku-main')
export class NikkuMain extends LitElement {
  /**
   * icon state "play" means audio is paused;
   * icon state "pause" means audio is playing;
   */
  @state()
  private playPauseIcon: 'play' | 'pause' = 'play';
  @state()
  private loop: 'on' | 'off' = 'on';
  @state()
  private volume: number = 1;
  @state()
  private muted: boolean = false;
  @state()
  private progressMax: number = 0;
  @state()
  private progressValue: number = 0;
  @state()
  private timeDisplayMax: number = 0;
  @state()
  private timeDisplayValue: number = 0;
  @state()
  private tracksCount: number = 1;
  @state()
  private tracksActive: boolean[] = [true];
  @state()
  private disabled: boolean = true;
  @state()
  private fileDraggingOver: boolean = false;
  @state()
  private trackTitle: string = '';
  @state()
  private errorMessage: string = '';

  @state()
  private folderFiles: File[] = [];
  @state()
  private folderName = '';
  @state()
  private selectedFile: File | null = null;
  @state()
  private currentFile: File | null = null;
  @state()
  private loading = false;

  private audioPlayer: AudioPlayer | null = null;

  private mediaSession = new PlayerMediaSession({
    play: async () => { if (!this.disabled && !this.loading) await this.audioPlayer?.play(); },
    pause: async () => { if (!this.loading) await this.audioPlayer?.pause(); },
    stop: async () => {
      if (this.disabled || this.loading) return;
      await this.audioPlayer?.pause();
      await this.audioPlayer?.seek(0, false);
    },
    seek: async (position) => {
      if (!this.disabled && !this.loading) await this.audioPlayer?.seek(position, false);
    },
    previous: () => this.#playAdjacentFile(-1),
    next: () => this.#playAdjacentFile(1),
    getPosition: () => this.audioPlayer?.getCurrrentPlaybackTime() ?? 0,
    onError: (error) => this.#showError(error),
  });

  #syncMediaSession() {
    if (!this.currentFile || this.loading || this.disabled || !this.audioPlayer) {
      this.mediaSession.update(null);
      return;
    }
    const index = this.folderFiles.indexOf(this.currentFile);
    this.mediaSession.update({
      title: this.currentFile.name,
      duration: this.timeDisplayMax,
      position: this.audioPlayer.getCurrrentPlaybackTime(),
      playing: this.playPauseIcon === 'pause',
      canPrevious: index > 0,
      canNext: index >= 0 && index < this.folderFiles.length - 1,
    });
  }

  async #playAdjacentFile(direction: -1 | 1) {
    if (!this.currentFile || this.loading) return;
    const index = this.folderFiles.indexOf(this.currentFile);
    const file = index >= 0 ? this.folderFiles[index + direction] : undefined;
    if (!file) return;
    this.selectedFile = file;
    await this.#loadFile(file);
  }

  private workerInstance = new ComlinkWorker(new URL('../audio-decoder/worker', import.meta.url))

  private timer = new Timer({
    renderCallback: () => {
      if (!this.audioPlayer) {
        return;
      }

      const currentTime = this.audioPlayer.getCurrrentPlaybackTime();
      this.progressValue = currentTime;
      this.timeDisplayValue = currentTime;
    },
  });

  render() {
    return html`
      <div
        id="error"
        class=${this.errorMessage ? 'has-error' : ''}
        role="alert"
        aria-atomic="true"
      >
        ${this.errorMessage}
      </div>
      <main aria-label="Audio player">
      <div id="main">
        <div id="track-title" title=${this.trackTitle}>${this.trackTitle}</div>
        <div id="controls-time-display">
          <controls-time-display
            ?disabled=${this.disabled}
            value=${this.timeDisplayValue}
            max=${this.timeDisplayMax}
          ></controls-time-display>
        </div>
        <div id="controls-progress">
          <controls-progress
            ?disabled=${this.disabled}
            value=${this.progressValue}
            max=${this.progressMax}
            @progressValueChange=${this.#handleProgressValueChange}
          ></controls-progress>
        </div>
        <label id="controls-select-file-container">
          <input
            type="file"
            id="controls-select-file"
            aria-label="Select file"
            accept=".brstm,.bfstm"
            aria-disabled=${this.loading}
            @click=${(event: MouseEvent) => { if (this.loading) event.preventDefault(); }}
            @change=${this.#handleFileInputChange}
          />
          <span id="controls-select-file-custom" aria-hidden="true">Select file…</span>
        </label>

        <div id="controls-play-pause">
          <controls-play-pause
            ?disabled=${this.disabled}
            mode=${this.playPauseIcon}
            @playPauseClick=${this.#handlePlayPauseClick}
          ></controls-play-pause>
        </div>
        <div id="controls-others">
          <controls-loop
            ?disabled=${this.disabled}
            mode=${this.loop}
            @loopClick=${this.#handleLoopClick}
          ></controls-loop>
          <controls-volume
            ?disabled=${this.disabled}
            ?muted=${this.muted}
            volume=${this.volume}
            @mutedChange=${this.#handleMutedChange}
            @volumeChange=${this.#handleVolumeChange}
          ></controls-volume>
        </div>
        <div id="controls-tracks">
          <controls-tracks
            ?disabled=${this.disabled}
            count=${this.tracksCount}
            .active=${this.tracksActive}
            @tracksActiveChange=${this.#handleTracksActiveChange}
          ></controls-tracks>
        </div>
      </div>
      <section id="folder-view" aria-labelledby="folder-title">
        <div class="folder-toolbar">
          <div>
            <h2 id="folder-title">Music folder</h2>
            ${!this.folderName ? html`<p>Play BRSTM and BFSTM files from one folder.</p>` : ''}
          </div>
          <label class="folder-picker">
            ${this.folderName ? 'Change folder…' : 'Choose folder…'}
            <input type="file" webkitdirectory multiple
              aria-label="Select folder"
              @change=${this.#handleFolderInputChange} />
          </label>
        </div>
        ${this.folderName ? html`
          ${this.folderFiles.length ? html`
            <details open>
              <summary>
                <span class="folder-name">${this.folderName}</span>
                <span class="file-count" role="status" aria-atomic="true">${this.folderFiles.length} ${this.folderFiles.length === 1 ? 'file' : 'files'}</span>
              </summary>
              <ul>
                ${this.folderFiles.map((file) => html`
                  <li class=${classMap({ selected: file === this.selectedFile, current: file === this.currentFile })}>
                    <button class="folder-item"
                      aria-pressed=${file === this.selectedFile}
                      aria-current=${file === this.currentFile ? 'true' : 'false'}
                      aria-disabled=${this.loading}
                      @click=${() => { if (!this.loading) this.selectedFile = file; }}
                      @dblclick=${() => this.#loadFile(file)}
                      @keydown=${(event: KeyboardEvent) => {
                        if (event.key === 'Enter' && !this.loading) {
                          event.preventDefault();
                          this.selectedFile = file;
                          void this.#loadFile(file);
                        }
                      }}>
                      <span class="file-path">${file.webkitRelativePath.split('/').slice(1).join('/') || file.name}</span>
                      ${file === this.currentFile ? html`<span class="current-label">${this.playPauseIcon === 'pause' ? 'Playing' : 'Current'}</span>` : ''}
                    </button>
                    <button class="play-file" aria-label=${`Play ${file.name}`}
                      aria-disabled=${this.loading}
                      @click=${() => { if (!this.loading) void this.#loadFile(file); }}>
                      <span aria-hidden="true">▶</span>
                    </button>
                  </li>
                `)}
              </ul>
            </details>
          ` : html`<p role="status">No BRSTM or BFSTM files found in this folder.</p>`}
        ` : ''}
      </section>
      <p role="status" aria-atomic="true">${this.loading
        ? 'Loading audio…'
        : this.currentFile
          ? `${this.playPauseIcon === 'pause' ? 'Playing' : 'Paused'}: ${this.trackTitle}`
          : ''}</p>
      </main>
      <div
        id="drag-and-drop-overlay"
        class=${classMap({
          hidden: !this.fileDraggingOver,
        })}
      >
        Drop BRSTM or BFSTM file to start playback
      </div>
    `;
  }

  firstUpdated() {
    window.addEventListener('dragover', (ev: DragEvent) => {
      // Prevent opening file
      ev.preventDefault();

      // Display drag & drop overlay
      this.fileDraggingOver = true;
    });
    window.addEventListener('dragend', (_ev: DragEvent) => {
      this.fileDraggingOver = false;
    });
    window.addEventListener('dragleave', (_ev: DragEvent) => {
      this.fileDraggingOver = false;
    });

    window.addEventListener('drop', (ev) => {
      // Prevent opening file
      ev.preventDefault();
      this.fileDraggingOver = false;
      if (
        !ev.dataTransfer ||
        !ev.dataTransfer.items ||
        !ev.dataTransfer.items[0] ||
        ev.dataTransfer.items[0].kind !== 'file'
      ) {
        this.#showError(new Error('No file read'));
        return;
      }

      const file = ev.dataTransfer.items[0].getAsFile();
      if (!file) {
        this.#showError(new Error('No file read'));
        return;
      }

      void this.#loadFile(file);
    });
  }

  #showError(error: Error) {
    this.errorMessage = error.message;
    console.error(error);
  }
  #clearError() {
    this.errorMessage = '';
  }

  #handleFileInputChange(e: InputEvent) {
    const files = (e.target as HTMLInputElement).files;
    if (!files || !files.length) {
      return;
    }

    const file = files[0];
    void this.#loadFile(file);
    (e.target as HTMLInputElement).value = '';
  }

  #handleFolderInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) {
      return;
    }
    this.folderName = files[0].webkitRelativePath.split('/')[0] || 'Selected folder';
    this.folderFiles = files
      .filter((file) => /\.(brstm|bfstm)$/i.test(file.name))
      .sort((a, b) => a.webkitRelativePath.localeCompare(b.webkitRelativePath, undefined, { numeric: true }));
    this.selectedFile = this.folderFiles[0] || null;
    input.value = '';
    this.#syncMediaSession();
  }

  async #loadFile(file: File) {
    // Only one load may use the shared decoder at a time.
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.disabled = true;
    this.#clearError();
    this.#syncMediaSession();
    prepareAudioSession();

    try {
      if (this.audioPlayer) {
        await this.audioPlayer.destroy();
      }
      this.currentFile = null;
      this.trackTitle = '';
      this.progressValue = 0;
      this.timeDisplayValue = 0;
      const buffer = await file.arrayBuffer();
      await this.workerInstance.init(transfer(buffer, [buffer]));
      const metadata = await this.workerInstance.getMetadata();

      if (!this.audioPlayer) {
        this.audioPlayer = new AudioPlayer({
          onPlay: () => {
            this.playPauseIcon = 'pause';
            this.timer.start();
            this.#syncMediaSession();
          },
          onPause: () => {
            this.playPauseIcon = 'play';
            this.timer.stop();
            this.#syncMediaSession();
          },
          onEnded: () => this.#playAdjacentFile(1),
          onPosition: () => {
            this.#syncMediaSession();
            // Refresh the paused UI once; running UI updates remain on rAF.
            if (this.playPauseIcon === 'play') {
              const position = this.audioPlayer?.getCurrrentPlaybackTime() ?? 0;
              this.progressValue = position;
              this.timeDisplayValue = position;
            }
          },
          decodeSamples: async (offset: number, size: number) => {
            const samples =
              (await this.workerInstance.getSamples(offset, size)) || [];
            return samples;
          },
        });
      }
      if (!metadata) {
        throw new Error('metadata is undefined');
      }
      await this.audioPlayer.init(metadata);
      this.audioPlayer.setLoop(this.loop === 'on');
      await this.audioPlayer.setVolume(this.muted ? 0 : this.volume);
      await this.audioPlayer.start();

      const amountTimeInS = metadata.totalSamples / metadata.sampleRate;
      const numberTracks = metadata.numberTracks;

      this.playPauseIcon = 'pause';
      this.progressMax = amountTimeInS;
      this.timeDisplayMax = amountTimeInS;

      this.tracksCount = numberTracks;
      this.tracksActive = new Array(numberTracks)
        .fill(true)
        .map((_, i) => (i === 0 ? true : false));
      this.disabled = false;

      await this.audioPlayer.play();
      this.trackTitle = file.name;
      this.currentFile = file;
    } catch (e) {
      this.disabled = true;
      await this.audioPlayer?.destroy();
      this.#showError(e as Error);
    } finally {
      this.loading = false;
      this.#syncMediaSession();
    }
  }

  #handleTracksActiveChange(e: CustomEvent) {
    const newActive: Array<boolean> = e.detail.active;
    this.tracksActive = newActive;
    this.audioPlayer?.setTrackStates(newActive);
  }

  #handlePlayPauseClick(e: CustomEvent) {
    const newMode = e.detail.mode as 'play' | 'pause';
    this.playPauseIcon = newMode;
    if (newMode === 'play') {
      this.audioPlayer?.pause();
    } else if (newMode === 'pause') {
      this.audioPlayer?.play();
    }
  }

  #handleProgressValueChange(e: CustomEvent) {
    const newProgressValue: number = e.detail.value;
    this.progressValue = newProgressValue;
    this.timeDisplayValue = newProgressValue;
    this.audioPlayer?.seek(newProgressValue);
  }

  #handleLoopClick(e: CustomEvent) {
    const newLoopMode = e.detail.mode as 'on' | 'off';
    this.loop = newLoopMode;
    if (newLoopMode === 'on') {
      this.audioPlayer?.setLoop(true);
    } else if (newLoopMode === 'off') {
      this.audioPlayer?.setLoop(false);
    }
  }

  #handleMutedChange(e: CustomEvent) {
    const newMuted = e.detail.muted as boolean;
    this.muted = newMuted;
    if (newMuted) {
      this.audioPlayer?.setVolume(0);
    } else {
      this.audioPlayer?.setVolume(this.volume);
    }
  }
  #handleVolumeChange(e: CustomEvent) {
    const newVolume = e.detail.volume as number;
    this.volume = newVolume;
    this.muted = false;
    this.audioPlayer?.setVolume(newVolume);
  }

  static styles = css`
    #folder-view {
      margin-top: 1.5rem;
      border: 1px solid var(--primary-light);
      border-radius: 8px;
      background: var(--primary-lightest-2);
      overflow: hidden;
    }
    .folder-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.85rem 1rem;
    }
    .folder-toolbar h2, .folder-toolbar p {
      margin: 0;
    }
    .folder-toolbar h2 {
      font-size: 1rem;
    }
    .folder-toolbar p {
      margin-top: 0.2rem;
      font-size: 12px;
      font-weight: 400;
    }
    #folder-view button, .folder-picker, #folder-view summary {
      font: inherit;
      color: var(--main-text-color);
      cursor: pointer;
    }
    .folder-picker {
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
      color: var(--primary-dark);
      border: 1px solid var(--primary-dark);
      border-radius: 5px;
      padding: 0.4rem 0.6rem;
    }
    .folder-picker input {
      position: absolute;
      inset: 0;
      width: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .folder-picker:focus-within, #folder-view button:focus-visible, #folder-view summary:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
    }
    #folder-view button:disabled, #folder-view button[aria-disabled='true'] {
      opacity: 0.5;
      cursor: default;
    }
    #folder-view details {
      border-top: 1px solid var(--primary-light);
    }
    #folder-view summary {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      background: var(--white-lighter);
      list-style: none;
    }
    #folder-view summary::-webkit-details-marker {
      display: none;
    }
    #folder-view summary::after {
      content: '⌄';
      margin-left: auto;
      font-size: 1.1rem;
      transform: rotate(0deg);
    }
    #folder-view details:not([open]) summary::after {
      transform: rotate(-90deg);
    }
    .folder-name, .file-path {
      overflow-wrap: anywhere;
    }
    .folder-name {
      font-weight: 600;
    }
    .file-count {
      color: var(--primary-dark);
      font-size: 12px;
      white-space: nowrap;
    }
    #folder-view ul {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 20rem;
      overflow: auto;
      background: var(--white-lighter);
      border-top: 1px solid var(--primary-light);
    }
    #folder-view li {
      display: flex;
      align-items: stretch;
      border-left: 3px solid transparent;
      border-bottom: 1px solid var(--primary-lightest-2);
    }
    #folder-view li:last-child {
      border-bottom: 0;
    }
    #folder-view li:hover, #folder-view li.selected {
      background: var(--primary-lightest-2);
    }
    #folder-view li.current {
      border-left-color: var(--primary-dark);
    }
    #folder-view .folder-item {
      min-width: 0;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      text-align: left;
      background: transparent;
      border: 0;
      border-radius: 0;
      padding: 0.65rem 0.75rem;
    }
    #folder-view .play-file {
      width: 2.75rem;
      flex: 0 0 2.75rem;
      color: var(--primary-dark);
      background: transparent;
      border: 0;
      border-left: 1px solid transparent;
    }
    #folder-view li:hover .play-file, #folder-view .play-file:focus-visible {
      border-left-color: var(--primary-light);
    }
    .current-label {
      font-size: 12px;
      flex-shrink: 0;
      color: var(--primary-dark);
    }
    #error {
      padding: 0.6rem;
      margin-top: 0.6rem;
      margin-bottom: 0.6rem;
      color: var(--error-color);
      overflow-wrap: anywhere;
      border: 1px solid currentColor;
      padding: 0.6rem;
    }
    #error:not(.has-error) {
      padding: 0;
      border: 0;
      margin: 0;
    }
    #drag-and-drop-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--primary);
      font-size: 2rem;
      background: var(--white-lighter);
      z-index: 100;
      user-select: none;
    }
    #drag-and-drop-overlay:before {
      content: ' ';
      position: absolute;
      left: 1rem;
      right: 1rem;
      top: 1rem;
      bottom: 1rem;
      border: 1rem dashed currentColor;
    }
    #drag-and-drop-overlay.hidden {
      display: none;
    }

    #main {
      margin-top: 100px;
      display: grid;
      grid-template-columns: 2fr 80px 1fr 1fr;
      grid-template-rows: auto 28px 32px 80px auto;
      row-gap: 10px;
      column-gap: 2rem;
      margin-bottom: 10px;
    }
    #track-title {
      grid-column: 1 / span 3;
      grid-row: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    #controls-time-display {
      grid-column: 4;
      grid-row: 1;
    }
    #controls-progress {
      grid-column: 1 / span 4;
      grid-row: 2;
    }
    #controls-select-file-container {
      grid-column: 1 / span 4;
      grid-row: 3;
    }
    #controls-tracks {
      grid-column: 1;
      grid-row: 4 / span 2;
    }
    #controls-play-pause {
      grid-column: 2;
      grid-row: 4;
    }
    #controls-others {
      grid-column: 3 / span 2;
      grid-row: 4;

      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    controls-loop {
      height: 40px;
    }
    controls-volume {
      margin-inline-start: 10px;
      height: 40px;
    }

    @media (max-width: 640px) {
      .folder-toolbar {
        align-items: flex-start;
      }
      .folder-toolbar p {
        max-width: 12rem;
      }
      #main {
        margin-top: 50px;
        grid-template-columns: minmax(0, 1fr) 80px minmax(0, 1fr);
        grid-template-rows: auto auto 28px 32px 80px auto;
        column-gap: 0.75rem;
      }
      #track-title {
        grid-column: 1 / span 3;
        grid-row: 1;
      }
      #controls-time-display {
        grid-column: 1 / span 3;
        grid-row: 2;
      }
      #controls-progress {
        grid-column: 1 / span 3;
        grid-row: 3;
      }
      #controls-select-file-container {
        grid-column: 1 / span 3;
        grid-row: 4;
      }
      #controls-play-pause {
        grid-column: 2;
        grid-row: 5;
      }
      #controls-others {
        grid-column: 1 / span 3;
        grid-row: 6;
        justify-content: center;
      }
      #controls-tracks {
        grid-column: 1 / span 3;
        grid-row: 7;
      }
    }

    /* Modified from "file" from https://github.com/mdo/wtf-forms/blob/master/wtf-forms.css */
    #controls-select-file-container {
      position: relative;
      display: inline-block;
      cursor: pointer;
      width: 100px;
    }
    #controls-select-file-container > input {
      margin: 0;
      opacity: 0;
      height: 32px;
      width: 100%;
    }
    #controls-select-file-custom {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;

      z-index: 5;

      box-sizing: border-box;
      border-radius: 5px;
      color: var(--primary-dark);
      border: 1px solid var(--primary-dark);
      background-color: var(--primary-lightest-2);
      user-select: none;
      font-size: 12px;
      line-height: 16px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      padding: 2px 4px;
      text-align: center;
    }
    #controls-select-file-custom:hover {
      background-color: var(--primary-lightest-1);
    }

    #controls-select-file-container:focus-within {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
      border-radius: 5px;
    }

    @media (prefers-color-scheme: dark) {
      #controls-select-file-custom {
        color: var(--main-text-color);
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'nikku-main': NikkuMain;
  }
}
