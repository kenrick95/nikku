import { defineConfig } from 'vite';
import comlink from 'vite-plugin-comlink';
import { VitePWA } from 'vite-plugin-pwa';

import minifyHTML from 'rollup-plugin-minify-html-literals';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    comlink(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Nikku - Web-based BRSTM player',
        short_name: 'Nikku',
        description: '👽 Web-based BRSTM player',
        theme_color: '#198813',
        icons: [
          {
            src: './assets/android-launchericon-192-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './assets/android-launchericon-512-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
    }),
  ],
  worker: {
    plugins: [comlink()],
  },
  build: {
    rollupOptions: {
      plugins: [minifyHTML()],
    },
  },
});
