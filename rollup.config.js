import nodeResolve from '@rollup/plugin-node-resolve';
import OMT from '@surma/rollup-plugin-off-main-thread';

const config = {
  input: 'src/main.js',
  output: {
    dir: 'dist/',
    format: 'amd',
  },
  // NOTE: Damn it, I have issues with "public path", seems like they "force" me to put index.html into dist folder, but I don't want it ._.
  plugins: [nodeResolve(), OMT()],
};

export default config;
