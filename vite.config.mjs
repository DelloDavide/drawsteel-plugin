// vite.config.mjs

import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    lib: {
      entry: 'index.js',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['@owlbear-rodeo/sdk']
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.' // copia direttamente nella cartella dist/
        }
      ]
    })
  ]
})
