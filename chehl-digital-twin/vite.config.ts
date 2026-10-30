import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import stylelintPlugin from 'vite-plugin-stylelint'

import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: './docs',
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    stylelintPlugin({ fix: true }),
    visualizer({ open: true }),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 'primary-6': '#009cdc',
          'border-radius-small': '0px',
          'border-radius-medium': '0px',
          'border-radius-large': '0px',
        },
        javascriptEnabled: true,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8090,
    open: true,
    proxy: {
      '/bridge': {
        // target: 'http://192.168.1.123:9990',
        // target: 'http://192.168.1.21:9990',
        target: 'http://192.168.100.125:8081',
        changeOrigin: true,
      },
    },
  },
})
