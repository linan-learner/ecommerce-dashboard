<template>
    <div class="sales-dashboard">
      <h1>实时销售看板</h1>
      
      <!-- 图表容器 -->
      <div class="chart-container">
        <div ref="chartRef" class="chart" data-echarts-instance></div>
      </div>
      
      <!-- 订单列表 -->
      <div class="order-section">
        <h3>实时订单</h3>
        <div class="order-list" ref="scrollContainer">
          <div class="order-items" :style="{ height: scrollHeight + 'px' }">
            <div 
              v-for="order in visibleOrders" 
              :key="order.id" 
              class="order-item"
            >
              <span>{{ order.time }}</span>
              <span>{{ order.product }}</span>
              <span class="amount">¥{{ order.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
/**
 * 实时销售看板页面
 * - 用了什么：`useSalesDashboardState`（业务状态）+ `buildSalesChartOption`（图表配置）+ `useECharts`（图表生命周期）。
 * - 为什么用：分层设计（状态/配置/渲染）让页面逻辑清晰，便于替换数据源或调整图表样式。
 * - 怎么调用：由路由 `/` 自动加载；页面 mounted 后启动定时拉取 mock 订单并同步刷新图表。
 */
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useECharts } from '../composables/useECharts'
  import { useSalesDashboardState, buildSalesChartOption } from '../features/sales'
  
  // ========== 1. 图表相关 ==========
  const chartRef = ref<HTMLElement | null>(null)
  const { setOption } = useECharts(chartRef)
  
  const { chartData, scrollTop, scrollHeight, visibleOrders, addOrder } = useSalesDashboardState()

  // ========== 2. 订单列表相关 ==========
  const scrollContainer = ref<HTMLElement | null>(null)
  const itemHeight = 60 // 每行高度
  
  // ========== 3. 定时器 ==========
  let dataTimer: number | null = null

  
  // ========== 4. 初始化图表 ==========
  const initChart = () => {
    setOption(buildSalesChartOption(chartData.value), true)
  }
  
  // ========== 5. 更新图表数据 ==========
  const updateChart = () => {
    setOption(buildSalesChartOption(chartData.value), true)
  }
  
  // ========== 6. 添加新订单 ==========
  const addOrderAndRender = async () => {
    try {
      await addOrder()
      updateChart()
    } catch (e) {
      // Mock 接口失败时不影响页面渲染
      console.warn('获取实时订单失败', e)
    }
  }
  // ========== 7. 处理滚动 ==========
  const handleScroll = () => {
    if (!scrollContainer.value) return
    scrollTop.value = scrollContainer.value.scrollTop
  }
  
  // ========== 8. 监听滚动事件（带性能优化）==========
  let ticking = false
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
      ticking = true
    }
  }

  // ========== 10. 生命周期 ==========
  onMounted(() => {
    initChart()
    
    // 启动模拟数据（每3秒添加一条）
    dataTimer = window.setInterval(() => {
      void addOrderAndRender()
    }, 3000)
    
    // 添加滚动监听
    scrollContainer.value?.addEventListener('scroll', onScroll)
  })
  
  onUnmounted(() => {
    // 清理定时器
    if (dataTimer) clearInterval(dataTimer)

    // 移除监听
    scrollContainer.value?.removeEventListener('scroll', onScroll)
  })
  </script>
  
  <style scoped>
  .sales-dashboard {
    padding: 20px;
    background: #f5f7fa;
    min-height: 100vh;
  }
  
  h1 {
    margin-bottom: 20px;
    color: #303133;
  }
  
  .chart-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .chart {
    width: 100%;
    height: 400px;
  }
  
  .order-section {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .order-section h3 {
    margin-top: 0;
    margin-bottom: 16px;
    color: #303133;
  }
  
  .order-list {
    height: 480px;
    overflow-y: auto;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
  
  .order-items {
    position: relative;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    height: 60px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
    transition: background 0.2s;
  }
  
  .order-item:hover {
    background: #f5f7fa;
  }
  
  .order-item span:first-child {
    color: #909399;
    width: 80px;
  }
  
  .order-item span:nth-child(2) {
    color: #303133;
    flex: 1;
    margin-left: 16px;
  }
  
  .order-item .amount {
    color: #f56c6c;
    font-weight: bold;
    width: 80px;
    text-align: right;
  }
  </style>