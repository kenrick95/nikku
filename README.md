# nikku

Web-based BRSTM player

Just open [the demo](https://kenrick95.github.io/nikku/) in modern browser, select .brstm file, and enjoy!

## What Is BRSTM?

BRSTM is a file format that contains [lossless](https://sound.stackexchange.com/a/40879) audio data that's being used for some Nintendo consoles. One of the differences with the usual audio format (MP3, etc) is that this format can contain a loop point, making it suitable for usage in games.

`.brstm` file is not included in the repository.

Some places to look for BRSTM files:

- [Smash Custom Music](http://smashcustommusic.com/)
- [Reddit](https://www.reddit.com/r/BRSTM/)

## Browser Requirements

There are no polyfill included in [the demo](https://kenrick95.github.io/nikku/).

Browser needs to support the following features without any vendor prefix:

- [Web Audio API](https://caniuse.com/#feat=audio-api)
- [`<script type="module"> `](https://caniuse.com/#feat=es6-module)
- [ES2016 class](https://caniuse.com/#feat=es6-class)
- [ES2015 in general](https://caniuse.com/#feat=es6)
- [`<template>`](https://caniuse.com/#feat=template)

Developed and tested in Firefox 66

## References

- [WiiBrew](https://wiibrew.org/wiki/BRSTM_file), for BRSTM file description.
- [BrawlLib](https://github.com/libertyernie/brawltools) codes, on how to decode BRSTM.

## See Also

- [My journey of building this](https://blog.kenrick95.org/2019/04/nikku/)

## TODOs

- [x] Figure out looping
- [x] Simple UI (play, pause, loop)
- [ ] Figure out gapless looping
- [ ] UI: Progress bar
- [ ] Perf: move brstm decoder to worker --> [Web Worker does not support ES2015 module yet ._.](https://stackoverflow.com/a/45578811/917957)
- [ ] Publish brstm decoder as npm package?
