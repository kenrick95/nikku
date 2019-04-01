const fs = require('fs');
const http = require('http');
// const url = require('url');
const util = require('util');
const ffmpeg = require('fluent-ffmpeg');
const getIn = require('fast-get')

const ffprobe = util.promisify(ffmpeg.ffprobe);

// console.log('command', command);

// const statSize = 0;

// https://gist.github.com/dtrce/1204243
http
  .createServer(async function(request, response) {
    if (request.url === '/favicon.ico') {
      response.statusCode = 404;
      response.end();
      return;
    }

    // const url = new URL(request.url, 'http://' + request.headers.host);
    // const skip = url.searchParams.get('skip') || 0;
    // const startByte = statSize * skip;
    const fileName = './music.brstm';
    const metadata = await ffprobe(fileName);
    //  duration: 85.020726,
    //  size: 4287520,
    //  bit_rate: 403432,
    //  probe_score: 66,
    const fileSize = getIn(metadata, ['format', 'size'], 0);
    const loopPoint = getIn(metadata, ['format', 'tags', 'loop_start'], null);
    console.log(loopPoint);
    const inputStream = fs.createReadStream(fileName);

    ffmpeg(inputStream)
      .noVideo()
      .format('mp3')
      .on('end', function() {
        console.log('Finished processing');
      })
      .output(response)
      .run();

    response.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0

      //   'Content-Length': statSize - startByte
    });

    // TODO: https://github.com/kenrick95/xion/blob/master/index.js
    // Do something like write only small chunk
    //
  })
  .listen(2000);
