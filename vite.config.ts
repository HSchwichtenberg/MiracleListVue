import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// für Vitest
import { defineConfig } from 'vitest/config'

// für Nightwatch
import nightwatchPlugin from 'vite-plugin-nightwatch'

// https://vitejs.dev/config/
export default defineConfig({
 test: {
  // globals: true, // für Vitest, wenn keine lokalen Importe verwendet werden,
},
plugins: [vue(), vueJsx(),
 nightwatchPlugin() // für Nightwatch
],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

})