import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        safari: (16 << 16) | (4 << 8),
      }
    }
  },
  server: {
    port: 3000
  }
})

