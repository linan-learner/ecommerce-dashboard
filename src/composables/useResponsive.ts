/**
 * 大屏响应式缩放组合函数
 * - 用了什么：窗口 resize 监听、`nextTick`、CSS transform 缩放策略。
 * - 为什么用：在不同分辨率下保持看板视觉比例，避免纯媒体查询导致的大屏布局失真。
 * - 怎么调用：在根组件 `App.vue` 中执行 `useResponsive()` 即可自动监听窗口并应用缩放。
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { resizeAllECharts } from '../utils/resizeECharts'

// 设计稿基准宽度（大屏设计稿通常是 1920px）
const DESIGN_WIDTH = 1920

export function useResponsive() {
  const scale = ref(1)
  const isLargeScreen = ref(true)
  const screenWidth = ref(window.innerWidth)
  
  // 计算缩放比例
  const calculateScale = () => {
    const width = window.innerWidth
    screenWidth.value = width
    
    // 判断是否为大屏
    isLargeScreen.value = width >= 1200
    
    // 计算缩放比例（大屏按比例缩放，普通屏幕保持原样）
    if (width >= DESIGN_WIDTH) {
      scale.value = width / DESIGN_WIDTH
    } else if (width >= 1200) {
      // 中等屏幕，稍微缩小
      scale.value = width / DESIGN_WIDTH
    } else {
      // 小屏幕，不缩放，让内容自适应滚动
      scale.value = 1
    }
    
    // 限制最大缩放比例
    scale.value = Math.min(scale.value, 1.5)
    
    return scale.value
  }
  
  // 应用缩放
  const applyScale = () => {
    const app = document.querySelector('.dashboard-app') as HTMLElement
    if (app && isLargeScreen.value) {
      app.style.transform = `scale(${scale.value})`
      app.style.transformOrigin = 'top left'
      app.style.width = `${100 / scale.value}%`
    } else if (app) {
      app.style.transform = 'none'
      app.style.width = '100%'
    }
    // transform 不会触发 window.resize，ECharts 需主动 resize
    void nextTick().then(() => {
      requestAnimationFrame(() => resizeAllECharts())
    })
  }
  
  // 监听窗口大小变化（使用防抖优化）
  let resizeTimer: number | null = null
  const handleResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      calculateScale()
      applyScale()
    }, 100)
  }
  
  // 获取响应式样式
  const getResponsiveStyle = () => {
    return {
      fontSize: `calc(14px * ${scale.value})`,
      padding: `calc(20px * ${scale.value})`
    }
  }
  
  onMounted(() => {
    calculateScale()
    applyScale()
    window.addEventListener('resize', handleResize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimer) clearTimeout(resizeTimer)
  })
  
  return {
    scale,
    isLargeScreen,
    screenWidth,
    calculateScale,
    applyScale,
    getResponsiveStyle
  }
}