import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { AudioPlayer } from '../audio-player/audio-player';
import { readDroppedItems, type DroppedFile, type DroppedSelection } from '../dropped-files';
import { Timer } from '../timer';
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
  private folderPaths = new WeakMap<File, string>();
  private preserveFolderRoots = false;
  private selectionGeneration = 0;
  private loadingFinished: Promise<void> = Promise.resolve();
  private finishLoading: (() => void) | null = null;

  #fileRelativePath(file: File) {
    return this.folderPaths.get(file) || file.webkitRelativePath || file.name;
  }

  #folderItemPath(file: File) {
    const path = this.#fileRelativePath(file).split('/');
    return !this.preserveFolderRoots && path.length > 1 ? path.slice(1).join('/') : path.join('/');
  }

  async #playAdjacentFile(direction: -1 | 1) {
    if (!this.currentFile || this.loading) return;
    const index = this.folderFiles.indexOf(this.currentFile);
    const file = index >= 0 ? this.folderFiles[index + direction] : undefined;
    if (!file) return;
    this.selectedFile = file;
    await this.#loadFile(file);
    await this.updateComplete;
    this.#getFolderItem(file)?.scrollIntoView({ block: 'nearest' });
  }

  async #playFolderFile(file: File) {
    if (this.loading) return;
    this.selectionGeneration++;
    this.selectedFile = file;
    await this.#loadFile(file);
    await this.updateComplete;
    const item = this.#getFolderItem(file);
    item?.scrollIntoView({ block: 'nearest' });
    item?.focus();
  }

  #getFolderItem(file: File) {
    const index = this.folderFiles.indexOf(file);
    if (index < 0) return undefined;
    return this.renderRoot.querySelectorAll<HTMLButtonElement>('.folder-item')[index];
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
      <main aria-label="Audio player" aria-busy=${this.loading}>
      <div id="main">
        <div id="track-title" title=${this.loading ? 'Loading audio' : this.trackTitle}>${this.loading
          ? `Loading ${this.selectedFile?.name || 'audio'}…`
          : this.trackTitle}</div>
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
        <div id="controls-select-sources">
          <label class=${classMap({ 'source-picker': true, loading: this.loading })}>
            <input
              type="file"
              aria-label="Select file"
              accept=".brstm,.bfstm"
              ?disabled=${this.loading}
              @change=${this.#handleFileInputChange}
            />
            <span aria-hidden="true">Select file…</span>
          </label>
          <label class=${classMap({ 'source-picker': true, loading: this.loading })}>
            <input type="file" webkitdirectory multiple
              aria-label="Select folder"
              ?disabled=${this.loading}
              @change=${this.#handleFolderInputChange} />
            <span aria-hidden="true">Select folder…</span>
          </label>
        </div>

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
      ${this.folderName ? html`
        <section id="folder-view" aria-labelledby="folder-title">
          <div class="folder-heading">
            <h2 id="folder-title">${this.folderName}</h2>
            <span class="file-count" role="status" aria-atomic="true">${this.folderFiles.length} ${this.folderFiles.length === 1 ? 'file' : 'files'}</span>
          </div>
          ${this.folderFiles.length ? html`
              <ul>
                ${this.folderFiles.map((file) => html`
                  <li class=${classMap({ selected: file === this.selectedFile, current: file === this.currentFile })}>
                    <button class="folder-item"
                      aria-label=${`Play ${this.#folderItemPath(file)}`}
                      aria-current=${file === this.currentFile ? 'true' : 'false'}
                      ?disabled=${this.loading}
                      @click=${() => this.#playFolderFile(file)}>
                      <span class="file-path">${this.#folderItemPath(file)}</span>
                      ${file === this.currentFile ? html`<span class="current-label">${this.playPauseIcon === 'pause' ? 'Playing' : 'Current'}</span>` : ''}
                    </button>
                  </li>
                `)}
              </ul>
          ` : html`<p role="status">No BRSTM or BFSTM files found in this folder.</p>`}
        </section>
      ` : ''}
      <p class="sr-only" role="status" aria-atomic="true">${this.loading
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
        Drop BRSTM or BFSTM files or a folder
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
      const generation = ++this.selectionGeneration;
      if (!ev.dataTransfer?.items?.length) {
        this.#showError(new Error('No file read'));
        return;
      }
      void this.#handleDroppedSelection(readDroppedItems(ev.dataTransfer.items), generation);
    });
  }

  async #handleDroppedSelection(selectionPromise: Promise<DroppedSelection>, generation: number) {
    try {
      const selection = await selectionPromise;
      if (generation !== this.selectionGeneration) return;
      await this.loadingFinished;
      if (generation !== this.selectionGeneration) return;
      if (selection.folderName) {
        await this.#loadFolder(selection.files, selection.folderName, selection.preserveFolderRoots);
      } else if (selection.files[0]) {
        await this.#loadFile(selection.files[0].file);
      } else {
        this.#showError(new Error('No file read'));
      }
    } catch (error) {
      if (generation === this.selectionGeneration) this.#showError(error as Error);
    }
  }

  #showError(error: Error) {
    this.errorMessage = error.message;
    console.error(error);
  }
  #clearError() {
    this.errorMessage = '';
  }

  #handleFileInputChange(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files || !files.length) {
      return;
    }

    this.selectionGeneration++;
    const file = files[0];
    input.value = '';
    void this.#loadFile(file).finally(() => input.focus());
  }

  #handleFolderInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (!files.length) {
      return;
    }
    this.selectionGeneration++;
    const folderName = files[0].webkitRelativePath.split('/')[0] || 'Selected folder';
    const droppedFiles = files.map((file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name,
    }));
    input.value = '';
    void this.#loadFolder(droppedFiles, folderName).finally(() => input.focus());
  }

  async #loadFolder(files: DroppedFile[], folderName: string, preserveFolderRoots = false) {
    this.folderPaths = new WeakMap();
    for (const { file, relativePath } of files) {
      this.folderPaths.set(file, relativePath);
    }
    this.preserveFolderRoots = preserveFolderRoots;
    this.folderName = folderName;
    this.folderFiles = files
      .map(({ file }) => file)
      .filter((file) => /\.(brstm|bfstm)$/i.test(file.name))
      .sort((a, b) => this.#fileRelativePath(a).localeCompare(this.#fileRelativePath(b), undefined, { numeric: true }));
    this.selectedFile = this.folderFiles[0] || null;
    if (this.selectedFile) {
      await this.#loadFile(this.selectedFile);
    } else {
      await this.#clearPlayback();
    }
  }

  async #clearPlayback() {
    if (this.loading) return;
    this.#clearError();
    this.#beginLoading();
    this.disabled = true;
    this.currentFile = null;
    this.trackTitle = '';
    try {
      await this.audioPlayer?.destroy();
      this.progressValue = 0;
      this.progressMax = 0;
      this.timeDisplayValue = 0;
      this.timeDisplayMax = 0;
      this.playPauseIcon = 'play';
      this.timer.stop();
    } finally {
      this.#endLoading();
    }
  }

  #beginLoading() {
    this.loading = true;
    this.loadingFinished = new Promise((resolve) => {
      this.finishLoading = resolve;
    });
  }

  #endLoading() {
    this.loading = false;
    this.finishLoading?.();
    this.finishLoading = null;
  }

  async #loadFile(file: File) {
    // Only one load may use the shared decoder at a time.
    if (this.loading) {
      return;
    }
    if (!this.folderFiles.includes(file)) {
      this.folderFiles = [];
      this.folderName = '';
      this.selectedFile = null;
      this.folderPaths = new WeakMap();
      this.preserveFolderRoots = false;
    }
    this.#beginLoading();
    this.disabled = true;
    this.#clearError();
    this.currentFile = null;
    this.trackTitle = '';

    try {
      if (this.audioPlayer) {
        await this.audioPlayer.destroy();
      }
      this.progressValue = 0;
      this.progressMax = 0;
      this.timeDisplayValue = 0;
      this.timeDisplayMax = 0;
      const buffer = await file.arrayBuffer();
      await this.workerInstance.init(transfer(buffer, [buffer]));
      const metadata = await this.workerInstance.getMetadata();

      if (!this.audioPlayer) {
        this.audioPlayer = new AudioPlayer({
          onPlay: () => {
            this.playPauseIcon = 'pause';
            this.timer.start();
          },
          onPause: () => {
            this.playPauseIcon = 'play';
            this.timer.stop();
          },
          onEnded: () => this.#playAdjacentFile(1),
          onPosition: () => {
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

      this.playPauseIcon = 'play';
      this.progressMax = amountTimeInS;
      this.timeDisplayMax = amountTimeInS;

      this.tracksCount = numberTracks;
      this.tracksActive = new Array(numberTracks)
        .fill(true)
        .map((_, i) => (i === 0 ? true : false));
      this.disabled = false;
      this.trackTitle = file.name;
      this.currentFile = file;
      void this.#startPlayback();
    } catch (e) {
      this.disabled = true;
      await this.audioPlayer?.destroy();
      this.currentFile = null;
      this.trackTitle = '';
      this.#showError(e as Error);
    } finally {
      this.#endLoading();
    }
  }

  #handleTracksActiveChange(e: CustomEvent) {
    const newActive: Array<boolean> = e.detail.active;
    this.tracksActive = newActive;
    this.audioPlayer?.setTrackStates(newActive);
  }

  #handlePlayPauseClick(e: CustomEvent) {
    const newMode = e.detail.mode as 'play' | 'pause';
    if (newMode === 'play') {
      void this.audioPlayer?.pause();
    } else if (newMode === 'pause') {
      void this.#startPlayback();
    }
  }

  async #startPlayback() {
    try {
      await this.audioPlayer?.play();
      this.#clearError();
    } catch (error) {
      this.playPauseIcon = 'play';
      this.timer.stop();
      this.#showError(error as Error);
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
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    #folder-view {
      margin-top: 1.5rem;
      border: 1px solid var(--primary-light);
      border-radius: 8px;
      background: var(--white-lighter);
      overflow: hidden;
    }
    .folder-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      background: var(--primary-lightest-2);
    }
    .folder-heading h2 {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
      font-size: 0.9rem;
    }
    #folder-view button {
      font: inherit;
      color: var(--main-text-color);
      cursor: pointer;
    }
    #folder-view button:focus-visible {
      outline: 2px solid var(--primary-dark);
      outline-offset: -2px;
    }
    #folder-view button:disabled, #folder-view button[aria-disabled='true'] {
      opacity: 0.5;
      cursor: default;
    }
    .file-path {
      overflow-wrap: anywhere;
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
      grid-template-rows: 20px 15px 24px 80px auto;
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
    #controls-select-sources {
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
      #main {
        margin-top: 50px;
        grid-template-columns: minmax(0, 1fr) 80px minmax(0, 1fr);
        grid-template-rows: 20px 20px 15px 24px 80px auto;
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
      #controls-select-sources {
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
    #controls-select-sources {
      display: flex;
      gap: 0.5rem;
    }
    .source-picker {
      position: relative;
      display: inline-block;
      cursor: pointer;
      width: 80px;
    }
    .source-picker:last-child {
      width: 94px;
    }
    .source-picker.loading {
      opacity: 0.55;
      cursor: wait;
    }
    .source-picker > input {
      margin: 0;
      opacity: 0;
      height: 24px;
      width: 100%;
      cursor: inherit;
    }
    .source-picker > span {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;

      z-index: 5;

      box-sizing: border-box;
      border-radius: 5px;
      color: var(--primary);
      background-color: var(--primary-lightest-2);
      user-select: none;
      font-size: 12px;
      line-height: 16px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      padding: 2px 4px;
      text-align: center;
    }
    .source-picker:hover > span {
      background-color: var(--primary-lightest-1);
    }

    .source-picker:focus-within {
      outline: 2px solid var(--primary-dark);
      outline-offset: 2px;
      border-radius: 5px;
    }

    @media (prefers-color-scheme: dark) {
      .source-picker > span {
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
