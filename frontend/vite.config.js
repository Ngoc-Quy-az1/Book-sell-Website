import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis', // 👈 fix lỗi ở trình duyệt
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
      ],
    },
  },
  server: {
    historyApiFallback: true, // 👈 Fix reload 404 for SPA in dev
  },
  // Nếu deploy lên subpath, thêm base: '/ten-thu-muc/'
  base: '/',
})
