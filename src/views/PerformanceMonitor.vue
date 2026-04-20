<template>
    <div class="performance-monitor">
      <h1>性能监控面板</h1>
      
      <!-- 实时性能指标卡片 -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value" :class="getFpsClass(fps)">{{ fps }}</div>
          <div class="metric-label">FPS (帧率)</div>
          <div class="metric-status">{{ getFpsStatus(fps) }}</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value" :class="getMemoryClass(memoryUsed)">{{ formatMemory(memoryUsed) }}</div>
          <div class="metric-label">内存占用</div>
          <div class="metric-status">{{ getMemoryStatus(memoryUsed) }}</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{{ pageLoadTime }}ms</div>
          <div class="metric-label">页面加载时间</div>
          <div class="metric-status">首屏加载</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">{{ apiAvgTime }}ms</div>
          <div class="metric-label">API平均响应</div>
          <div class="metric-status">最近10次请求</div>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts-row">
        <!-- FPS 趋势图 -->
        <div class="chart-card">
          <h3>FPS 趋势图</h3>
          <div ref="fpsChartRef" class="fps-chart" data-echarts-instance></div>
        </div>
        
        <!-- 内存趋势图 -->
        <div class="chart-card">
          <h3>内存占用趋势</h3>
          <div ref="memoryChartRef" class="memory-chart" data-echarts-instance></div>
        </div>
      </div>
      
      <!-- API 请求耗时统计 -->
      <div class="api-section">
        <h3>API 请求耗时统计</h3>
        <div class="api-list">
          <div v-for="api in apiStats" :key="api.url" class="api-item">
            <span class="api-url">{{ api.url }}</span>
            <div class="api-bar-container">
              <div class="api-bar" :style="{ width: (api.avgTime / maxApiTime * 100) + '%', backgroundColor: getApiColor(api.avgTime) }"></div>
            </div>
            <span class="api-time">{{ api.avgTime }}ms</span>
            <span class="api-count">{{ api.count }}次</span>
          </div>
        </div>
      </div>
      
      <!-- 资源加载瀑布图 -->
      <div class="resources-section">
        <h3>资源加载瀑布图</h3>
        <div class="resources-list">
          <div v-for="resource in resources" :key="resource.name" class="resource-item">
            <span class="resource-name">{{ resource.name }}</span>
            <div class="resource-bar-container">
              <div class="resource-bar" :style="{ width: (resource.duration / maxResourceTime * 100) + '%', left: (resource.startTime / totalLoadTime * 100) + '%' }"></div>
            </div>
            <span class="resource-time">{{ resource.duration }}ms</span>
          </div>
        </div>
      </div>
      
      <!-- 控制按钮 -->
      <div class="control-section">
        <button @click="startMonitoring" class="control-btn" :disabled="isMonitoring">开始监控</button>
        <button @click="stopMonitoring" class="control-btn stop" :disabled="!isMonitoring">停止监控</button>
        <button @click="simulateApiRequest" class="control-btn simulate">模拟API请求</button>
        <button @click="handleClearData" class="control-btn clear">清空数据</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
/**
 * 性能监控面板页面
 * - 用了什么：`usePerformanceMonitorState` 采集性能数据，`buildFpsOption/buildMemoryOption` 绘制趋势图，`useECharts` 管理实例。
 * - 为什么用：把采集逻辑（Performance API、FPS loop）从模板抽离，页面专注指标展示和控制按钮。
 * - 怎么调用：由路由 `/performance` 自动加载；mounted 时读取首屏耗时并启动监控，unmounted 自动清理。
 */
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useECharts } from '../composables/useECharts'
  import { usePerformanceMonitorState, buildFpsOption, buildMemoryOption } from '../features/performance-monitor'
  
  // ========== 1. 图表引用 ==========
  const fpsChartRef = ref<HTMLElement | null>(null)
  const memoryChartRef = ref<HTMLElement | null>(null)
  const { setOption: setFpsOption } = useECharts(fpsChartRef)
  const { setOption: setMemoryOption } = useECharts(memoryChartRef)
  let renderTimer: number | null = null
  
  const {
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
  } = usePerformanceMonitorState()
  
  // ========== 10. 初始化图表 ==========
  const initCharts = () => {
    setFpsOption(buildFpsOption({ labels: timeLabels.value, values: fpsHistory.value }), true)
    setMemoryOption(buildMemoryOption({ labels: timeLabels.value, values: memoryHistory.value }), true)
  }
  
  // ========== 11. 更新图表 ==========
  const updateCharts = () => {
    setFpsOption(buildFpsOption({ labels: timeLabels.value, values: fpsHistory.value }), true)
    setMemoryOption(buildMemoryOption({ labels: timeLabels.value, values: memoryHistory.value }), true)
  }

  const handleClearData = () => {
    clearData()
    updateCharts()
  }
  
  // ========== 16. 生命周期 ==========
  onMounted(() => {
    getPageLoadTime()
    initCharts()
    startMonitoring()
    renderTimer = window.setInterval(updateCharts, 1000)
  })
  
  onUnmounted(() => {
    stopMonitoring()
    if (renderTimer) clearInterval(renderTimer)
  })
  </script>
  
  <style scoped>
  .performance-monitor {
    padding: 20px;
    background: var(--bg-color, #f5f7fa);
    min-height: 100vh;
  }
  
  h1 {
    margin-bottom: 20px;
    color: var(--text-primary, #303133);
  }
  
  h3 {
    margin-bottom: 16px;
    color: var(--text-regular, #606266);
    font-size: 16px;
  }
  
  /* 指标卡片 */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .metric-card {
    background: var(--bg-white, white);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: var(--card-shadow, 0 2px 12px rgba(0, 0, 0, 0.1));
  }
  
  .metric-value {
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .metric-value.good { color: #67c23a; }
  .metric-value.warning { color: #e6a23c; }
  .metric-value.bad { color: #f56c6c; }
  
  .metric-label {
    font-size: 14px;
    color: var(--text-secondary, #909399);
    margin-bottom: 4px;
  }
  
  .metric-status {
    font-size: 12px;
    color: var(--text-placeholder, #c0c4cc);
  }
  
  /* 图表区域 */
  .charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .chart-card {
    background: var(--bg-white, white);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--card-shadow, 0 2px 12px rgba(0, 0, 0, 0.1));
  }
  
  .fps-chart, .memory-chart {
    width: 100%;
    height: 280px;
  }
  
  /* API 统计 */
  .api-section {
    background: var(--bg-white, white);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: var(--card-shadow, 0 2px 12px rgba(0, 0, 0, 0.1));
  }
  
  .api-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .api-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .api-url {
    width: 200px;
    font-size: 13px;
    color: var(--text-regular, #606266);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .api-bar-container {
    flex: 1;
    height: 24px;
    background: var(--border-light, #e4e7ed);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  
  .api-bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
  }
  
  .api-time {
    width: 60px;
    text-align: right;
    font-weight: bold;
    color: var(--text-primary, #303133);
  }
  
  .api-count {
    width: 60px;
    text-align: right;
    color: var(--text-secondary, #909399);
    font-size: 12px;
  }
  
  /* 资源加载 */
  .resources-section {
    background: var(--bg-white, white);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: var(--card-shadow, 0 2px 12px rgba(0, 0, 0, 0.1));
  }
  
  .resources-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .resource-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .resource-name {
    width: 200px;
    font-size: 13px;
    color: var(--text-regular, #606266);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .resource-bar-container {
    flex: 1;
    height: 24px;
    background: var(--border-light, #e4e7ed);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  
  .resource-bar {
    position: absolute;
    height: 100%;
    background: linear-gradient(90deg, #409eff, #66b1ff);
    border-radius: 4px;
    transition: all 0.3s;
  }
  
  .resource-time {
    width: 60px;
    text-align: right;
    font-weight: bold;
    color: var(--text-primary, #303133);
  }
  
  /* 控制按钮 */
  .control-section {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  
  .control-btn {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: all 0.2s;
    background: #409eff;
    color: white;
  }
  
  .control-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    opacity: 0.9;
  }
  
  .control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .control-btn.stop {
    background: #f56c6c;
  }
  
  .control-btn.simulate {
    background: #67c23a;
  }
  
  .control-btn.clear {
    background: #909399;
  }
  
  /* 响应式 */
  @media (max-width: 1000px) {
    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .charts-row {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    .api-url, .resource-name {
      width: 120px;
    }
  }
  </style>