/**
 * 性能监控状态管理
 * - 用了什么：Performance API、requestAnimationFrame、定时器、响应式历史序列。
 * - 为什么用：把 FPS/内存/API耗时/资源瀑布等采集逻辑集中管理，视图层只消费状态。
 * - 怎么调用：`const perf = usePerformanceMonitorState()`，再调用 `startMonitoring/stopMonitoring` 控制采集。
 */
import { computed, ref } from 'vue'

interface ApiStat {
  url: string
  avgTime: number
  count: number
  totalTime: number
}

interface Resource {
  name: string
  duration: number
  startTime: number
}

const maxHistoryLength = 30

export function usePerformanceMonitorState() {
  const fps = ref(60)
  const memoryUsed = ref(0)
  const pageLoadTime = ref(0)
  const apiAvgTime = ref(0)

  const fpsHistory = ref<number[]>([])
  const memoryHistory = ref<number[]>([])
  const timeLabels = ref<string[]>([])

  const apiStats = ref<ApiStat[]>([])
  const resources = ref<Resource[]>([])

  const isMonitoring = ref(false)
  let memoryInterval: number | null = null
  let resourceInterval: number | null = null
  let rafId: number | null = null

  const maxApiTime = computed(() => {
    const times = apiStats.value.map(a => a.avgTime)
    return times.length ? Math.max(...times, 100) : 100
  })
  const maxResourceTime = computed(() => {
    const times = resources.value.map(r => r.duration)
    return times.length ? Math.max(...times, 100) : 100
  })
  const totalLoadTime = computed(() => {
    const times = resources.value.map(r => r.startTime + r.duration)
    return times.length ? Math.max(...times, 1000) : 1000
  })

  const formatMemory = (mb: number): string => {
    if (mb > 1024) return `${(mb / 1024).toFixed(1)}GB`
    return `${mb.toFixed(0)}MB`
  }
  const getFpsClass = (value: number): string => (value >= 50 ? 'good' : value >= 30 ? 'warning' : 'bad')
  const getFpsStatus = (value: number): string => (value >= 50 ? '流畅' : value >= 30 ? '一般' : '卡顿')
  const getMemoryClass = (value: number): string => (value < 200 ? 'good' : value < 400 ? 'warning' : 'bad')
  const getMemoryStatus = (value: number): string => (value < 200 ? '正常' : value < 400 ? '偏高' : '过高')
  const getApiColor = (time: number): string => (time < 100 ? '#67c23a' : time < 300 ? '#e6a23c' : '#f56c6c')

  const getPageLoadTime = () => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (nav) pageLoadTime.value = nav.loadEventEnd - nav.fetchStart
  }

  const getResourceTiming = () => {
    const entries = performance.getEntriesByType('resource')
    resources.value = entries.slice(-10).map(entry => ({
      name: entry.name.split('/').pop() || entry.name,
      duration: Math.round(entry.duration),
      startTime: entry.startTime
    }))
  }

  const pushTick = (value: number, target: 'fps' | 'memory') => {
    const now = new Date()
    const label = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    timeLabels.value.push(label)
    if (timeLabels.value.length > maxHistoryLength) timeLabels.value.shift()

    if (target === 'fps') {
      fpsHistory.value.push(value)
      if (fpsHistory.value.length > maxHistoryLength) fpsHistory.value.shift()
    } else {
      memoryHistory.value.push(value)
      if (memoryHistory.value.length > maxHistoryLength) memoryHistory.value.shift()
    }
  }

  const tickMemory = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      memoryUsed.value = memory.usedJSHeapSize / (1024 * 1024)
    } else {
      memoryUsed.value = 150 + Math.random() * 100
    }
    pushTick(memoryUsed.value, 'memory')
  }

  const runFpsLoop = () => {
    let frameCount = 0
    let lastTime = performance.now()

    const loop = () => {
      if (!isMonitoring.value) return
      frameCount++
      const now = performance.now()
      if (now - lastTime >= 1000) {
        fps.value = Math.round((frameCount * 1000) / (now - lastTime))
        frameCount = 0
        lastTime = now
        pushTick(fps.value, 'fps')
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
  }

  const simulateApiRequest = () => {
    const urls = [
      '/api/sales/trend',
      '/api/products/list',
      '/api/orders/realtime',
      '/api/users/behavior',
      '/api/map/provinces'
    ]

    const url = urls[Math.floor(Math.random() * urls.length)]!
    const startTime = performance.now()
    setTimeout(() => {
      const duration = Math.round(performance.now() - startTime)
      const existing = apiStats.value.find(s => s.url === url)
      if (existing) {
        existing.totalTime += duration
        existing.count++
        existing.avgTime = Math.round(existing.totalTime / existing.count)
      } else {
        apiStats.value.push({ url, avgTime: duration, count: 1, totalTime: duration })
      }
      const total = apiStats.value.reduce((sum, s) => sum + s.avgTime, 0)
      apiAvgTime.value = Math.round(total / apiStats.value.length)
    }, Math.random() * 200 + 50)
  }

  const clearData = () => {
    fpsHistory.value = []
    memoryHistory.value = []
    timeLabels.value = []
    apiStats.value = []
    resources.value = []
    apiAvgTime.value = 0
  }

  const startMonitoring = () => {
    if (isMonitoring.value) return
    isMonitoring.value = true
    runFpsLoop()
    tickMemory()
    getResourceTiming()
    memoryInterval = window.setInterval(tickMemory, 1000)
    resourceInterval = window.setInterval(getResourceTiming, 5000)
  }

  const stopMonitoring = () => {
    isMonitoring.value = false
    if (memoryInterval) clearInterval(memoryInterval)
    if (resourceInterval) clearInterval(resourceInterval)
    memoryInterval = null
    resourceInterval = null
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
  }

  return {
    fps,
    memoryUsed,
    pageLoadTime,
    apiAvgTime,
    fpsHistory,
    memoryHistory,
    timeLabels,
    apiStats,
    resources,
    maxApiTime,
    maxResourceTime,
    totalLoadTime,
    isMonitoring,
    formatMemory,
    getFpsClass,
    getFpsStatus,
    getMemoryClass,
    getMemoryStatus,
    getApiColor,
    getPageLoadTime,
    startMonitoring,
    stopMonitoring,
    simulateApiRequest,
    clearData
  }
}
