<template>
    <div class="map-dashboard">
      <h1>省份销售额分布</h1>

      <!-- 图表 DOM 始终挂载，避免 v-if 卸载后 ECharts 实例与节点错位 -->
      <div class="chart-container">
        <div v-if="isLoading" class="chart-overlay">正在加载地图数据...</div>
        <div v-else-if="errorMessage" class="chart-overlay chart-overlay--error">
          {{ errorMessage }}
        </div>
        <div ref="barChartRef" class="bar-chart" data-echarts-instance></div>
      </div>
      
      <!-- Top 5 省份排名 -->
      <div v-if="!isLoading && !errorMessage" class="ranking-section">
        <h3>销售额 Top 5 省份</h3>
        <div class="ranking-list">
          <div 
            v-for="(item, index) in topProvinces" 
            :key="item.name" 
            class="ranking-item"
            :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }"
          >
            <span class="rank">{{ index + 1 }}</span>
            <span class="name">{{ item.name }}</span>
            <span class="value">¥{{ formatNumber(item.value) }}</span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: calcBarWidth(item.value) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 点击省份显示城市数据（钻取） -->
      <div v-if="selectedProvince" class="drilldown-section">
        <h3>{{ selectedProvince }} - 城市销售额</h3>
        <div class="city-list">
          <div v-for="city in cityData" :key="city.name" class="city-item">
            <span>{{ city.name }}</span>
            <span>¥{{ formatNumber(city.value) }}</span>
          </div>
        </div>
        <button @click="handleResetDrilldown" class="reset-btn">返回省份视图</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
/**
 * 省份销售地图页面（当前以排名柱图 + 省市钻取列表呈现）
 * - 用了什么：`useMapDashboardState` 管理加载/错误/钻取状态，`buildMapBarOption` 生成图表配置，`useECharts` 管理实例。
 * - 为什么用：把“数据拉取 + 钻取业务”与“图表渲染”分离，后续接入真实地图或接口更容易扩展。
 * - 怎么调用：由路由 `/map` 自动加载；mounted 时先 `loadData` 再初始化图表并绑定点击事件。
 */
  import { ref, onMounted, nextTick } from 'vue'
  import { useECharts } from '../composables/useECharts'
  import { useMapDashboardState, buildMapBarOption } from '../features/map'
  
  // ========== 1. 图表相关 ==========
  const barChartRef = ref<HTMLElement | null>(null)
  const { chart: barChart, setOption } = useECharts(barChartRef)
  
  const {
    provinceData,
    isLoading,
    errorMessage,
    selectedProvince,
    cityData,
    topProvinces,
    formatNumber,
    calcBarWidth,
    loadData,
    selectProvince,
    resetDrilldown
  } = useMapDashboardState()
  
  // ========== 6. 初始化柱状图 ==========
  const initBarChart = () => {
    setOption(buildMapBarOption(provinceData.value, formatNumber), true)
    
    // 添加点击事件
    barChart.value?.off('click')
    barChart.value?.on('click', (params: any) => {
      if (params.componentType === 'series') {
        const provinceName = params.name
        handleProvinceClick(provinceName)
      }
    })
  }
  
  // ========== 7. 处理省份点击（钻取）==========
  const handleProvinceClick = (provinceName: string) => {
    const selected = selectProvince(provinceName)
    if (selected) {
      // 高亮被点击的柱子
      barChart.value?.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        name: provinceName
      })
    }
  }
  
  // ========== 8. 重置钻取 ==========
  const handleResetDrilldown = () => {
    resetDrilldown()

    // 取消高亮
    barChart.value?.dispatchAction({
      type: 'downplay',
      seriesIndex: 0
    })
  }
  
  // ========== 10. 生命周期 ==========
  onMounted(async () => {
    await loadData()
    if (provinceData.value.length === 0) return
    await nextTick()
    initBarChart()
  })
  </script>
  
  <style scoped>
  .map-dashboard {
    padding: 20px;
    background: #f5f7fa;
    min-height: 100vh;
  }

  .status-box {
    margin-bottom: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    background: #f4f4f5;
    color: #606266;
  }

  .status-box.error {
    background: #fef0f0;
    color: #f56c6c;
  }
  
  h1 {
    margin-bottom: 20px;
    color: #303133;
  }
  
  .chart-container {
    position: relative;
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  .chart-overlay {
    position: absolute;
    inset: 20px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.94);
    font-size: 15px;
    color: #606266;
  }

  .chart-overlay--error {
    color: #f56c6c;
    font-weight: 500;
  }
  
  .bar-chart {
    width: 100%;
    height: 500px;
  }
  
  .ranking-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .ranking-section h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #303133;
  }
  
  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .ranking-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 8px;
    transition: all 0.3s;
    cursor: pointer;
  }
  
  .ranking-item:hover {
    transform: translateX(5px);
    background: #e6f7ff;
  }
  
  .rank {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e4e7ed;
    border-radius: 50%;
    font-weight: bold;
    font-size: 18px;
  }
  
  .top-1 .rank {
    background: #ffd700;
    color: #333;
  }
  
  .top-2 .rank {
    background: #c0c0c0;
    color: #333;
  }
  
  .top-3 .rank {
    background: #cd7f32;
    color: white;
  }
  
  .name {
    width: 100px;
    font-weight: 500;
  }
  
  .value {
    width: 100px;
    font-weight: bold;
    color: #f56c6c;
  }
  
  .bar {
    flex: 1;
    height: 8px;
    background: #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #409eff, #66b1ff);
    border-radius: 4px;
    transition: width 0.3s;
  }
  
  .drilldown-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .drilldown-section h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #409eff;
  }
  
  .city-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .city-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 16px;
    background: #f5f7fa;
    border-radius: 6px;
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .city-item:hover {
    background: #e6f7ff;
    transform: translateX(5px);
  }
  
  .city-item span:first-child {
    color: #606266;
  }
  
  .city-item span:last-child {
    font-weight: bold;
    color: #f56c6c;
  }
  
  .reset-btn {
    padding: 8px 20px;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }
  
  .reset-btn:hover {
    background: #66b1ff;
    transform: translateY(-2px);
  }
  </style>