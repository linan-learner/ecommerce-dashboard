/**
 * 地图页面柱状图 Option 构建器
 * - 用了什么：按销售额排序后的横向柱图配置 + 自定义 tooltip/label 格式化。
 * - 为什么用：与页面和状态解耦，便于替换图表风格或复用到其他排名场景。
 * - 怎么调用：`buildMapBarOption(provinceData, formatNumber)`。
 */
import type { EChartsOption } from 'echarts'
import type { ProvinceData } from '../../../api/types'

type Formatter = (num: number) => string

export function buildMapBarOption(
  provinceData: ProvinceData[],
  formatNumber: Formatter
): EChartsOption {
  const sortedData = [...provinceData].sort((a, b) => b.value - a.value)

  return {
    title: {
      text: '各省份销售额排名',
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        return `${params[0].name}<br/>销售额: ¥${formatNumber(params[0].value)}`
      }
    },
    grid: {
      left: '10%',
      right: '5%',
      top: '15%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '销售额（元）',
      nameLocation: 'middle',
      nameGap: 35,
      axisLabel: {
        formatter: (value: number) => {
          if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
          return String(value)
        }
      }
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(item => item.name),
      axisLabel: {
        fontSize: 12,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: sortedData.map(item => item.value),
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#409eff' },
              { offset: 1, color: '#66b1ff' }
            ]
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => `¥${formatNumber(params.value)}`,
          fontWeight: 'bold',
          fontSize: 12
        },
        barWidth: '60%'
      }
    ]
  }
}
