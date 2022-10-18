import { defineConfig } from 'vite';
import comlink from 'vite-plugin-comlink';

import minifyHTML from 'rollup-plugin-minify-html-literals';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [comlink()],
  worker: {
    plugins: [comlink()],
  },
  build: {
    rollupOptions: {
      plugins: [minifyHTML()],
    },
  },
});
