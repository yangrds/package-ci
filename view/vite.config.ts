import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
const path = require('path');


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'package-ci',
    sourcemap: true
  },
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  define: {
    'process.env': {},
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
