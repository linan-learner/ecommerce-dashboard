/**
 * 性能监控趋势图 Option 构建器
 * - 用了什么：ECharts 折线图配置工厂（FPS 与内存两套）。
 * - 为什么用：统一图表样式并复用同一套输入结构，减少重复配置。
 * - 怎么调用：
 *   - `buildFpsOption({ labels, values })`
 *   - `buildMemoryOption({ labels, values })`
 */
import type { EChartsOption } from 'echarts'

interface TrendData {
  labels: string[]
  values: number[]
}

export function buildFpsOption(data: TrendData): EChartsOption {
  return {
    title: { show: false },
    grid: { top: 30, left: 50, right: 20, bottom: 20 },
    xAxis: { type: 'category', data: data.labels, name: '时间' },
    yAxis: { type: 'value', name: 'FPS', min: 0, max: 70 },
    series: [
      {
        type: 'line',
        data: data.values,
        smooth: true,
        lineStyle: { color: '#409eff', width: 2 },
        areaStyle: { opacity: 0.1 }
      }
    ]
  }
}

export function buildMemoryOption(data: TrendData): EChartsOption {
  return {
    title: { show: false },
    grid: { top: 30, left: 50, right: 20, bottom: 20 },
    xAxis: { type: 'category', data: data.labels, name: '时间' },
    yAxis: { type: 'value', name: '内存 (MB)' },
    series: [
      {
        type: 'line',
        data: data.values,
        smooth: true,
        lineStyle: { color: '#67c23a', width: 2 },
        areaStyle: { opacity: 0.1 }
      }
    ]
  }
}
