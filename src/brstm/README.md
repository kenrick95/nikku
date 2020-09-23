# brstm.js

[![npm version](https://badge.fury.io/js/brstm.svg)](https://badge.fury.io/js/brstm) ![Test](https://github.com/kenrick95/nikku/workflows/Test/badge.svg)

BRSTM decoder.

Part of [Nikku](https://github.com/kenrick95/nikku).

## Usage example

```js
import { Brstm } from 'brstm';

// BRSTM file should be read and passed as ArrayBuffer type
const brstm = new Brstm(arrayBuffer);

// Here you get an Object containing all the metadata extracted from BRSTM's file HEAD chunk
const metadata = brstm.metadata;

// You get per-channel PCM samples
const samples = brstm.getAllSamples();

// If you don't want the full samples, you can decode them partially
// getSamples(offset, size) will return the per-channel `offset`-th sample until `(offset + size - 1)`-th sample
const samplesPartial = brstm.getSamples(0, 100);

```

## Members

- `rawData`: `{Uint8Array}`, representation of array buffer passed in at class constructor.
- `metadata`: `{Object}`, the metadata extracted from BRSTM's file HEAD chunk
  - `fileSize`: `{number}`
  - `endianness`: `{number}`, 0 - little endian, 1 - big endian
  - `codec`: `{number}`
    - 0 - 8-bit PCM
    - 1 - 16-bit PCM
    - 2 - 4-bit ADPCM
  - `loopFlag`: `{number}`
  - `numberChannels`: `{number}`
  - `sampleRate`: `{number}`
  - `loopStartSample`: `{number}`, loop start, in terms of sample #
  - `totalSamples`: `{number}`
  - `totalBlocks`: `{number}`, total number of blocks, per channel, including final block
  - `blockSize`: `{number}`
  - `samplesPerBlock`: `{number}`
  - `finalBlockSize`: `{number}`, Final block size, without padding, in bytes
  - `finalBlockSizeWithPadding`: `{number}`, Final block size, **with** padding, in bytes
  - `totalSamplesInFinalBlock`: `{number}`, Total samples in final block
  - `adpcTableSamplesPerEntry`: `{number}`, Samples per entry in ADPC table
  - `adpcTableBytesPerEntry`: `{number}`, Bytes per entry in ADPC table
  - `numberTracks`: `{number}`, Number of tracks
  - `trackDescriptionType`: `{number}`, Track description type ??

## Methods

- `getAllSamples()`: `{Array<Int16Array>}`, per-channel PCM samples
- `getSamples(offset, size)`: `{Array<Int16Array>}`, per-channel samples from `offset`-th sample until `(offset + size - 1)`-th sample
