<template>
    <div class="radar-dashboard">
      <h1>商品分析雷达图</h1>

      <!-- 商品选择区域 -->
      <div v-if="!isLoading && !errorMessage" class="product-selector">
        <h3>选择要对比的商品</h3>
        <div class="checkbox-group">
          <label v-for="product in availableProducts" :key="product.name" class="checkbox-item">
            <input 
              type="checkbox" 
              :value="product.name" 
              v-model="selectedProducts"
              @change="updateChart"
            />
            <span :style="{ color: product.color }">{{ product.name }}</span>
          </label>
        </div>
      </div>

      <!-- 图表 DOM 始终挂载（加载态用遮罩，不用 v-if 整段卸载） -->
      <div class="chart-container">
        <div v-if="isLoading" class="chart-overlay">正在加载商品数据...</div>
        <div v-else-if="errorMessage" class="chart-overlay chart-overlay--error">
          {{ errorMessage }}
        </div>
        <div ref="radarChartRef" class="radar-chart" data-echarts-instance></div>
      </div>
      
      <!-- 维度权重调节器 -->
      <div v-if="!isLoading && !errorMessage" class="weight-control">
        <h3>维度权重调节（拖拽滑块调整权重）</h3>
        <div v-for="dim in dimensions" :key="dim.name" class="weight-item">
          <span class="dim-name">{{ dim.name }}</span>
          <input 
            type="range" 
            :min="0" 
            :max="2" 
            :step="0.1"
            v-model.number="dim.weight"
            @input="updateChart"
            class="weight-slider"
          />
          <span class="weight-value">{{ getSafeWeight(dim.weight).toFixed(1) }}x</span>
        </div>
      </div>
      
      <!-- 商品对比表格 -->
      <div v-if="!isLoading && !errorMessage" class="compare-table">
        <h3>商品详细对比</h3>
        <table>
          <thead>
            <tr>
              <th>指标</th>
              <th v-for="product in selectedProductData" :key="product.name">
                <span :style="{ color: product.color }">{{ product.name }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dim in dimensions" :key="dim.name">
              <td class="dim-label">{{ dim.name }}</td>
              <td v-for="product in selectedProductData" :key="product.name" class="value-cell">
                <div class="value-bar">
                  <div 
                    class="value-fill" 
                    :style="{ 
                      width: (getProductValue(product, dim.name) / 100 * 100) + '%',
                      backgroundColor: product.color 
                    }"
                  ></div>
                  <span class="value-text">{{ getProductValue(product, dim.name) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
/**
 * 商品分析雷达页面
 * - 用了什么：`useProductRadarState` 管理商品数据、维度权重、选中项；`buildRadarOption` 输出雷达图配置。
 * - 为什么用：支持“多商品对比 + 权重调节”的动态分析场景，避免把复杂评分逻辑写死在模板里。
 * - 怎么调用：由路由 `/radar` 自动加载；mounted 后拉取商品数据并初始化雷达图，后续通过交互实时更新。
 */
  import { ref, onMounted, nextTick } from 'vue'
  import { useECharts } from '../composables/useECharts'
  import { useProductRadarState, buildRadarOption } from '../features/product-radar'
  
  // ========== 1. 图表相关 ==========
  const radarChartRef = ref<HTMLElement | null>(null)
  const { setOption } = useECharts(radarChartRef)
  
  const {
    availableProducts,
    isLoading,
    errorMessage,
    dimensions,
    selectedProducts,
    selectedProductData,
    getSafeWeight,
    getProductValue,
    loadData
  } = useProductRadarState()
  
  // ========== 8. 初始化雷达图 ==========
  const initRadarChart = () => {
    updateChart()
  }
  
  // ========== 9. 更新图表 ==========
  const updateChart = () => {
    const option = buildRadarOption({
      dimensions: dimensions.value,
      selectedProductData: selectedProductData.value,
      getSafeWeight,
      getProductValue
    })
    setOption(option, true)
  }
  
  // ========== 11. 生命周期 ==========
  onMounted(async () => {
    await loadData()
    if (availableProducts.value.length === 0) return
    await nextTick()
    initRadarChart()
  })
  </script>
  
  <style scoped>
  .radar-dashboard {
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
  
  h3 {
    margin-bottom: 16px;
    color: #606266;
    font-size: 16px;
  }
  
  /* 商品选择器 */
  .product-selector {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .checkbox-group {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px 16px;
    background: #f5f7fa;
    border-radius: 20px;
    transition: all 0.2s;
  }
  
  .checkbox-item:hover {
    background: #e6f7ff;
    transform: translateY(-2px);
  }
  
  .checkbox-item input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  .checkbox-item span {
    font-weight: 500;
    font-size: 14px;
  }
  
  /* 图表容器 */
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
  
  .radar-chart {
    width: 100%;
    height: 550px;
  }
  
  /* 权重调节器 */
  .weight-control {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .weight-item {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
  }
  
  .dim-name {
    width: 100px;
    font-weight: 500;
    color: #606266;
  }
  
  .weight-slider {
    flex: 1;
    height: 6px;
    -webkit-appearance: none;
    background: #e4e7ed;
    border-radius: 3px;
    outline: none;
  }
  
  .weight-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #409eff;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .weight-value {
    width: 50px;
    text-align: right;
    color: #409eff;
    font-weight: bold;
  }
  
  /* 对比表格 */
  .compare-table {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    padding: 12px;
    background: #f5f7fa;
    font-weight: 600;
    color: #303133;
    border-bottom: 2px solid #e4e7ed;
  }
  
  td {
    padding: 12px;
    border-bottom: 1px solid #ebeef5;
  }
  
  .dim-label {
    font-weight: 500;
    color: #606266;
    width: 100px;
  }
  
  .value-cell {
    min-width: 150px;
  }
  
  .value-bar {
    position: relative;
    height: 32px;
    background: #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .value-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s;
    opacity: 0.7;
  }
  
  .value-text {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding-right: 8px;
    font-size: 12px;
    font-weight: bold;
    color: #303133;
    z-index: 1;
  }
  </style>