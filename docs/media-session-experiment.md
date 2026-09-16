# Media Session experiment

## Goal

Allow system media controls and hardware media keys to control Nikku while its page is not focused.

Nikku decodes BRSTM and BFSTM data into PCM samples and plays them with an `AudioWorkletNode`. It does not have an encoded media resource that a native `<audio>` element can play.

## Approaches tested

The first implementation registered Media Session metadata, playback state, position, and handlers for play, pause, stop, seeking, and playlist navigation.

Because browsers may require an `HTMLMediaElement` to claim system audio focus, a second implementation routed the Web Audio graph into a `MediaStreamAudioDestinationNode`, assigned that stream to an `Audio` element through `srcObject`, and explicitly played the element. A final ordering experiment registered all metadata and action handlers before starting that element.

Diagnostic logging confirmed that:

- `navigator.mediaSession` was available.
- Metadata, playback state, position, and every supported action handler were accepted without errors.
- The stream-backed audio element emitted `play` and `playing` events and produced the expected audio.
- No Media Session action callback ran when a hardware media key was pressed.

The same result was reproduced in Firefox and Microsoft Edge on September 16, 2026. Firefox's `media.hardwaremediakeys.enabled` preference was enabled. Starting the stream-backed element before or after Media Session registration did not change the result.

## Finding

Browsers did not treat a media element whose `srcObject` was Web Audio output as an active, system-controllable media source. The JavaScript Media Session API can accept metadata and handlers without the browser selecting that page as its active platform media session.

Firefox explicitly documents that its media controls support audible `<audio>` and `<video>` playback but not Web Audio. [Mozilla's media-control documentation](https://support.mozilla.org/en-US/kb/control-audio-or-video-playback-your-keyboard) and [Firefox bug 2067534](https://bugzilla.mozilla.org/show_bug.cgi?id=2067534) describe this activation gap.

Chromium documentation describes the supported Web Audio arrangement in the opposite direction: a real `<audio>` element is the playback source and feeds Web Audio for processing. It does not document Web Audio output routed into a media element as a way to obtain audio focus. See [Customize media notifications and handle playlists](https://developer.chrome.com/blog/media-session).

## Decision

The Media Session implementation and audio bridge were removed. The bridge added lifecycle and routing complexity without making hardware controls work in either tested browser. Nikku again connects its gain node directly to `AudioContext.destination`.

A future implementation would need a real media-element playback source. For this player, that likely means decoding and mixing the selected tracks into an encoded or WAV resource and making an `<audio>` element the primary playback clock. That design must account for decode latency, memory use, BRSTM loop points, seeking, and live track selection before Media Session support is reconsidered.
