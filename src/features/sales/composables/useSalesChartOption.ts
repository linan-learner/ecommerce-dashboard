/**
 * 销售趋势图 Option 构建器
 * - 用了什么：EChartsOption 工厂函数模式。
 * - 为什么用：让图表配置与页面逻辑解耦，便于测试与复用。
 * - 怎么调用：`setOption(buildSalesChartOption(chartData), true)`。
 */
import type { EChartsOption } from 'echarts'

interface SalesChartData {
  times: string[]
  amounts: number[]
}

export function buildSalesChartOption(data: SalesChartData): EChartsOption {
  return {
    title: { text: '实时销售额趋势', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.times },
    yAxis: { type: 'value', name: '销售额 (元)' },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: data.amounts,
        smooth: true,
        lineStyle: { color: '#409eff', width: 3 },
        areaStyle: { color: 'rgba(64, 158, 255, 0.2)' }
      }
    ]
  }
}
