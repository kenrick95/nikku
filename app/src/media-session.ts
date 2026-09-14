type Actions = {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  previous: () => Promise<void>;
  next: () => Promise<void>;
  getPosition: () => number;
  onError: (error: Error) => void;
};

export type SessionState = {
  title: string;
  duration: number;
  position: number;
  playing: boolean;
  canPrevious: boolean;
  canNext: boolean;
};

/** Browser integration is optional and must never prevent local playback. */
export class PlayerMediaSession {
  private state: SessionState | null = null;
  private registered = new Map<MediaSessionAction, boolean>();

  constructor(
    private actions: Actions,
    private session = typeof navigator === 'undefined' ? undefined : navigator.mediaSession
  ) {}

  update(state: SessionState | null) {
    const previous = this.state;
    this.state = state;
    if (!this.session) return;

    if (!state) {
      if (!previous) return;
      this.safely(() => { this.session!.metadata = null; });
      this.safely(() => { this.session!.playbackState = 'none'; });
      this.safely(() => this.session!.setPositionState?.());
      for (const action of this.registered.keys()) this.register(action, false, () => {});
      return;
    }

    if (previous?.title !== state.title && typeof MediaMetadata !== 'undefined') {
      this.safely(() => {
        this.session!.metadata = new MediaMetadata({
          title: state.title,
          artist: 'Nikku',
          album: 'BRSTM / BFSTM player',
        });
      });
    }
    if (!previous || previous.playing !== state.playing) {
      this.safely(() => {
        this.session!.playbackState = state.playing ? 'playing' : 'paused';
      });
    }
    if (Number.isFinite(state.duration) && state.duration > 0 && Number.isFinite(state.position)) {
      this.safely(() => this.session!.setPositionState?.({
        duration: state.duration,
        playbackRate: 1,
        position: Math.max(0, Math.min(state.duration, state.position)),
      }));
    }

    this.register('play', true, this.actions.play);
    this.register('pause', true, this.actions.pause);
    this.register('stop', true, this.actions.stop);
    this.register('seekto', true, (details) => this.seek(details.seekTime));
    this.register('seekbackward', true, (details) =>
      this.seek(this.actions.getPosition() - (details.seekOffset ?? 10)));
    this.register('seekforward', true, (details) =>
      this.seek(this.actions.getPosition() + (details.seekOffset ?? 10)));
    this.register('previoustrack', state.canPrevious, this.actions.previous);
    this.register('nexttrack', state.canNext, this.actions.next);
  }

  private seek(position: number | undefined) {
    if (!this.state || position === undefined || !Number.isFinite(position)) return;
    return this.actions.seek(Math.max(0, Math.min(this.state.duration, position)));
  }

  private register(
    action: MediaSessionAction,
    enabled: boolean,
    handler: (details: MediaSessionActionDetails) => void | Promise<void>
  ) {
    if (this.registered.get(action) === enabled) return;
    this.registered.set(action, enabled);
    this.safely(() => this.session!.setActionHandler(action, enabled ? (details) => {
      if (!this.state) return;
      Promise.resolve().then(() => handler(details)).catch(this.actions.onError);
    } : null));
  }

  private safely(operation: () => void) {
    try {
      operation();
    } catch {
      // APIs and individual actions are not supported on every browser/platform.
    }
  }
}

export function prepareAudioSession() {
  if (typeof navigator === 'undefined') return;
  const audioSession = (navigator as Navigator & {
    audioSession?: { type: string };
  }).audioSession;
  try {
    if (audioSession) audioSession.type = 'playback';
  } catch {
    // This optional hint is currently supported by only some browsers.
  }
}
