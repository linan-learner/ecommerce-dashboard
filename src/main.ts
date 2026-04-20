/**
 * 应用入口文件
 * - 用了什么：Vue 3 createApp、Vue Router、Element Plus、全局样式、ECharts resize 工具函数。
 * - 为什么用：统一完成应用初始化，并在路由切换后主动触发图表重算尺寸，避免页面切换/布局变化后图表尺寸错误。
 * - 怎么调用：Vite 启动时会自动执行该入口；无需手动调用。
 */
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import { resizeAllECharts } from './utils/resizeECharts'

// 导入全局样式
import './styles/index.css'

const app = createApp(App)

router.afterEach(() => {
  void nextTick().then(() => {
    requestAnimationFrame(() => resizeAllECharts())
  })
})

app.use(router)
app.use(ElementPlus)

app.mount('#app')