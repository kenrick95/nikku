import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'bfstm',
      fileName: 'bfstm',
      formats: ['cjs', 'es', 'umd'],
    },
  },
});
