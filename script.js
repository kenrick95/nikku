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
    result.push(dataView.getInt8(i));
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
  const offsetToHeadChunk1 = getSliceAsNumber(dataView, offsetToHead + 0x0c, 4);
  console.log('offsetToHeadChunk1', offsetToHeadChunk1, getSlice(dataView, offsetToHead, 100));
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
}
