# brstm.js

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
```

## Members

- `rawData`: `{Uint8Array}`, representation of array buffer passed in at class constructor.
- `metadata`: `{Object}`, the metadata extracted from BRSTM's file HEAD chunk
  - `fileSize`: `{number}`
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
