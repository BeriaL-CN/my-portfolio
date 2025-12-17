import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        // 分包策略
        manualChunks(id) {
          // 将 Three.js 及其相关库提取到名为 'vendor-three' 的块中
          if (id.includes('three') || id.includes('@react-three') || id.includes('drei')) {
            return 'vendor-three';
          }
          // 其他第三方库
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})