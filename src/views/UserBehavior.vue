<template>
    <div class="user-behavior">
      <h1>用户行为分析</h1>
      
      <!-- 数据统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-value">{{ formatNumber(totalUsers) }}</div>
          <div class="stat-label">总访问用户</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ formatNumber(convertedUsers) }}</div>
          <div class="stat-label">转化用户</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ conversionRate }}%</div>
          <div class="stat-label">转化率</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ avgTimeSpent }}s</div>
          <div class="stat-label">平均停留时长</div>
        </div>
      </div>
      
      <!-- 漏斗图 + 桑基图双栏布局 -->
      <div class="charts-row">
        <!-- 漏斗图 -->
        <div class="chart-card">
          <h3>用户转化漏斗</h3>
          <div ref="funnelChartRef" class="funnel-chart" data-echarts-instance></div>
          <div class="funnel-steps">
            <div v-for="step in funnelData" :key="step.name" class="step-info">
              <span class="step-name">{{ step.name }}</span>
              <span class="step-value">{{ formatNumber(step.value) }}人</span>
              <span class="step-rate">{{ step.rate }}%</span>
            </div>
          </div>
        </div>
        
        <!-- 桑基图 -->
        <div class="chart-card">
          <h3>用户行为流向</h3>
          <div ref="sankeyChartRef" class="sankey-chart" data-echarts-instance></div>
        </div>
      </div>
      
      <!-- 计算状态提示 -->
      <div class="calc-status" v-if="isCalculating">
        <span class="loading-spinner"></span>
        正在计算大数据集...
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
/**
 * 用户行为分析页面
 * - 用了什么：`useUserBehaviorState` 提供漏斗/桑基业务数据，`buildFunnelOption` 与 `buildSankeyOption` 构建图表配置。
 * - 为什么用：将“行为数据模型”和“可视化呈现”解耦，方便后续替换真实埋点数据。
 * - 怎么调用：由路由 `/behavior` 自动加载；mounted 时初始化漏斗图和桑基图。
 */
  import { ref, onMounted } from 'vue'
  import { useECharts } from '../composables/useECharts'
  import { useUserBehaviorState, buildFunnelOption, buildSankeyOption } from '../features/user-behavior'

  // ========== 1. 图表引用 ==========
  const funnelChartRef = ref<HTMLElement | null>(null)
  const sankeyChartRef = ref<HTMLElement | null>(null)
  const { chart: funnelChart, setOption: setFunnelOption } = useECharts(funnelChartRef)
  const { chart: sankeyChart, setOption: setSankeyOption } = useECharts(sankeyChartRef)
  const {
    isCalculating,
    funnelData,
    totalUsers,
    convertedUsers,
    conversionRate,
    avgTimeSpent,
    formatNumber,
    getSankeyData
  } = useUserBehaviorState()
  
  // ========== 8. 初始化漏斗图 ==========
  const initFunnelChart = () => {
    setFunnelOption(buildFunnelOption(funnelData.value, formatNumber), true)
  }

  // ========== 9. 初始化桑基图（使用 Web Worker 计算）==========
  const initSankeyChart = () => {
    // 显示加载状态
    sankeyChart.value?.showLoading()
    isCalculating.value = true
    
    // 使用 setTimeout 模拟 Web Worker 计算（实际项目中可替换为真实 Worker）
    setTimeout(() => {
      const sankeyData = getSankeyData()
      setSankeyOption(buildSankeyOption(sankeyData.nodes, sankeyData.links, formatNumber), true)
      
      sankeyChart.value?.hideLoading()
      isCalculating.value = false
    }, 500) // 模拟计算耗时
  }
  
  // ========== 10. 生命周期 ==========
  onMounted(() => {
    initFunnelChart()
    initSankeyChart()
  })
  </script>
  
  <style scoped>
  .user-behavior {
    padding: 20px;
    background: #f5f7fa;
    min-height: 100vh;
  }
  
  h1 {
    margin-bottom: 20px;
    color: #303133;
  }
  
  h3 {
    margin-bottom: 16px;
    color: #606266;
    font-size: 16px;
  }
  
  /* 统计卡片 */
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: bold;
    color: #409eff;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #909399;
  }
  
  /* 双栏布局 */
  .charts-row {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .chart-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .funnel-chart {
    width: 100%;
    height: 400px;
  }
  
  .sankey-chart {
    width: 100%;
    height: 500px;
  }
  
  /* 漏斗步骤详情 */
  .funnel-steps {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .step-info {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
  }
  
  .step-name {
    font-weight: 500;
    color: #606266;
  }
  
  .step-value {
    color: #409eff;
    font-weight: bold;
  }
  
  .step-rate {
    color: #67c23a;
    width: 60px;
    text-align: right;
  }
  
  /* 计算状态提示 */
  .calc-status {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1000;
  }
  
  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* 响应式 */
  @media (max-width: 1200px) {
    .charts-row {
      grid-template-columns: 1fr;
    }
    
    .stats-cards {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .stats-cards {
      grid-template-columns: 1fr;
    }
  }
  </style>