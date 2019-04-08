// File description: https://wiibrew.org/wiki/BRSTM_file

document.addEventListener('DOMContentLoaded', () => {
  const fileElement = document.getElementById('file');
  fileElement.addEventListener('input', () => {
    const file = fileElement.files[0];
    const headerReader = new FileReader();
    headerReader.addEventListener('loadend', (ev) => {
      const result = headerReader.result;
      const dataView = new DataView(result);
      console.log('dataView', dataView);

      processBuffer(dataView);
    });
    headerReader.readAsArrayBuffer(file);
  });
});

function getSlice(dataView, start, length) {
  const result = [];
  for (let i = start; i < start + length; i++) {
    // Apparently unsigned
    result.push(dataView.getUint8(i));
  }
  return result;
}
function getSliceAsString(dataView, start, length) {
  const resArr = getSlice(dataView, start, length);
  return String.fromCharCode(...resArr);
}
function getSliceAsNumber(dataView, start, length) {
  const resArr = getSlice(dataView, start, length);
  return resArr.reduce((acc, curr) => acc * 256 + curr, 0);
}

function processBuffer(dataView) {
  // Header
  if (getSliceAsString(dataView, 0, 4) === 'RSTM') {
    // Should be a valid BRSTM file
  }

  // getSlice(dataView, 4, 0, 2) === [-2, -1] --> little endian (usually, let's assume this)
  // getSlice(dataView, 4, 0, 2) === [-1, -1] --> big endian
  // getSliceAsNumber(dataView, 8, 4) --> file size; equivalent to dataView.byteLength
  console.log('getSliceAsNumber', getSliceAsNumber(dataView, 8, 4));

  // HEAD
  const offsetToHead = getSliceAsNumber(dataView, 16, 4);
  console.log('offsetToHead', offsetToHead);
  // getSliceAsString(dataView, offsetToHead, 4) === 'HEAD'
  const offsetToHeadChunk1 = 32;
  /**
   * Codec:
   * 0 - 8-bit PCM
   * 1 - 16-bit PCM
   * 2 - 4-bit ADPCM
   */
  const codec = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1,
    1
  );
  console.log('codec', codec);
  const loopFlag = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1 + 0x0001,
    1
  );
  console.log('loopFlag', loopFlag);
  const numberChannels = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1 + 0x0002,
    1
  );
  console.log('numberChannels', numberChannels);
  const sampleRate = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1 + 0x0004,
    2
  );
  console.log('sampleRate', sampleRate);

  const loopStartSample = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1 + 0x0008,
    4
  );
  console.log('loopStartSample', loopStartSample);


  const totalSample = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1 + 0x000C,
    4
  );
  console.log('totalSample', totalSample);

  
  const totalBlocks = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1 + 0x0014,
    4
  );
  console.log('totalBlocks', totalBlocks);

  
  const blockSize = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1 + 0x0018,
    4
  );
  console.log('blockSize', blockSize);


  const samplesPerBlock = getSliceAsNumber(
    dataView,
    offsetToHead + offsetToHeadChunk1 + 0x001C,
    4
  );
  console.log('samplesPerBlock', samplesPerBlock);
}

/*
Notes

Information from opening music.brstm on BrawlBox

music.brstm currently contains

Encoding: ADPCM
Channels: 2
isLooped: true
sampleRate: 44100
loopStartSample: 573440
numSamples: 3749414
numBlocks: 262
blockSize: 8192
bitsPerSample: 4

versionMajor: 1
versionMinor: 0
*/
