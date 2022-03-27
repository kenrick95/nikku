import { defineConfig } from 'vite';
import comlink from 'vite-plugin-comlink';
import worker, { pluginHelper } from 'vite-plugin-worker';

import minifyHTML from 'rollup-plugin-minify-html-literals';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    comlink({
      typeFile: 'comlink-workers.d.ts',
      customConfigs: {
        // https://github.com/mathe42/vite-plugin-comlink#change-that-add-dev-support-for-firefox-ie-
        'comlink:': 'comlink@main:worker-iife:comlink@worker:',
      },
    }),
    pluginHelper(),
    worker({}),
  ],
  build: {
    rollupOptions: {
      plugins: [minifyHTML()],
    },
  },
});
