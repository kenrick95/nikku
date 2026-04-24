import { clamp } from '@nikku/utils';

export class DspAdpcm {
  samplesInFinalBlock: number;
  samplesPerBlock: number;
  totalBlocks: number;
  totalChannels: number;

  constructor({
    samplesInFinalBlock,
    samplesPerBlock,
    totalBlocks,
    totalChannels,
  }: {
    samplesInFinalBlock: number;
    samplesPerBlock: number;
    totalBlocks: number;
    totalChannels: number;
  }) {
    this.samplesInFinalBlock = samplesInFinalBlock;
    this.samplesPerBlock = samplesPerBlock;
    this.totalBlocks = totalBlocks;
    this.totalChannels = totalChannels;
  }
  #getSamplesAtBlock(b: number): Array<Int16Array> {
    const result: Array<Int16Array> = [];
    const totalSamplesInBlock =
      b === totalBlocks - 1 ? samplesInFinalBlock : samplesPerBlock;

    for (let c = 0; c < numberChannels; c++) {
      result.push(new Int16Array(totalSamplesInBlock));
    }

    for (let c = 0; c < numberChannels; c++) {
      const { adpcmCoefficients } = channelInfo[c];
      const blockData = allChannelsBlockData[c];

      const sampleResult: Array<number> = [];
      const ps = blockData[0];
      const { yn1, yn2 } = adpcChunkData[c][b];

      // #region Magic adapted from brawllib's ADPCMState.cs
      let cps = ps,
        cyn1 = yn1,
        cyn2 = yn2,
        dataIndex = 0;

      for (let sampleIndex = 0; sampleIndex < totalSamplesInBlock; ) {
        let outSample = 0;
        if (sampleIndex % 14 === 0) {
          cps = blockData[dataIndex++];
        }
        if ((sampleIndex++ & 1) === 0) {
          outSample = blockData[dataIndex] >> 4;
        } else {
          outSample = blockData[dataIndex++] & 0x0f;
        }
        if (outSample >= 8) {
          outSample -= 16;
        }
        const scale = 1 << (cps & 0x0f);
        const cIndex = (cps >> 4) << 1;

        outSample =
          (0x400 +
            ((scale * outSample) << 11) +
            adpcmCoefficients[clamp(cIndex, 0, 15)] * cyn1 +
            adpcmCoefficients[clamp(cIndex + 1, 0, 15)] * cyn2) >>
          11;

        cyn2 = cyn1;
        cyn1 = clamp(outSample, -32768, 32767);

        sampleResult.push(cyn1);
      }

      // Overwrite history samples for the next block with decoded samples
      if (b < totalBlocks - 1) {
        adpcChunkData[c][b + 1].yn1 = sampleResult[totalSamplesInBlock - 1];
        adpcChunkData[c][b + 1].yn2 = sampleResult[totalSamplesInBlock - 2];
      }

      // #endregion

      result[c].set(sampleResult);
    }
    return result;
  }
}
