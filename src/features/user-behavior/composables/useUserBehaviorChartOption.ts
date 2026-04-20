/**
 * 用户行为图表 Option 构建器（漏斗图 + 桑基图）
 * - 用了什么：ECharts Funnel/Sankey 配置工厂。
 * - 为什么用：将复杂图表配置与页面交互逻辑解耦，方便维护视觉样式与格式化规则。
 * - 怎么调用：
 *   - `buildFunnelOption(funnelData, formatNumber)`
 *   - `buildSankeyOption(nodes, links, formatNumber)`
 */
import type { EChartsOption } from 'echarts'
import type { FunnelStep, SankeyLink, SankeyNode } from './useUserBehaviorState'

type FormatNumber = (num: number) => string

export function buildFunnelOption(funnelData: FunnelStep[], formatNumber: FormatNumber): EChartsOption {
  return {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}<br/>人数: ${formatNumber(params.value)}<br/>转化率: ${params.data.rate}%`
      }
    },
    series: [
      {
        type: 'funnel',
        data: funnelData.map(item => ({
          name: item.name,
          value: item.value,
          rate: item.rate
        })),
        sort: 'descending',
        gap: 8,
        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => `${params.name}\n${formatNumber(params.value)}人`,
          fontSize: 12,
          fontWeight: 'bold'
        },
        labelLine: {
          show: false
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 8,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#409eff' },
              { offset: 1, color: '#66b1ff' }
            ]
          }
        }
      }
    ]
  }
}

export function buildSankeyOption(
  nodes: SankeyNode[],
  links: SankeyLink[],
  formatNumber: FormatNumber
): EChartsOption {
  return {
    title: {
      show: false
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params: any) => {
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}<br/>人数: ${formatNumber(params.data.value)}`
        }
        return `${params.name}<br/>总流量: ${formatNumber(params.value)}`
      }
    },
    series: [
      {
        type: 'sankey',
        emphasis: {
          focus: 'adjacency'
        },
        data: nodes,
        links,
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
          opacity: 0.3
        },
        label: {
          fontSize: 11,
          position: 'right'
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#fff',
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#409eff' },
              { offset: 1, color: '#67c23a' }
            ]
          }
        },
        nodeWidth: 40,
        nodeGap: 20
      }
    ]
  }
}
