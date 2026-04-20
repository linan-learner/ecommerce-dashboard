import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署需要仓库子路径；请确保与仓库名一致。
  // 例如仓库名是 ecommerce-dashboard，则访问路径为 /ecommerce-dashboard/
  base: '/ecommerce-dashboard/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
