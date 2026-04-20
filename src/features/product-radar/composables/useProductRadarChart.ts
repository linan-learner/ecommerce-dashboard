/**
 * 商品雷达图 Option 构建器
 * - 用了什么：基于维度配置动态生成 indicator + 多商品 series 数据。
 * - 为什么用：实现“维度可调、商品可选”的动态雷达图，而不是写死配置。
 * - 怎么调用：`setOption(buildRadarOption({ dimensions, selectedProductData, getSafeWeight, getProductValue }), true)`。
 */
import type { EChartsOption } from 'echarts'
import type { ProductData } from '../../../api/types'
import type { RadarDimension } from './useProductRadarState'

interface BuildRadarOptionArgs {
  dimensions: RadarDimension[]
  selectedProductData: ProductData[]
  getSafeWeight: (weight: unknown) => number
  getProductValue: (product: ProductData, dimName: string) => number
}

export function buildRadarOption(args: BuildRadarOptionArgs): EChartsOption {
  const { dimensions, selectedProductData, getSafeWeight, getProductValue } = args

  const indicator = dimensions.map(dim => ({
    name: `${dim.name} (x${getSafeWeight(dim.weight).toFixed(1)})`,
    max: 100
  }))

  const data = selectedProductData.map(product => {
    const values = dimensions.map(dim => getProductValue(product, dim.name))
    return {
      name: product.name,
      value: values,
      areaStyle: {
        color: product.color,
        opacity: 0.1
      },
      lineStyle: {
        color: product.color,
        width: 2
      },
      itemStyle: {
        color: product.color
      }
    }
  })

  return {
    title: {
      text: '商品多维分析雷达图',
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: selectedProductData.map(product => product.name),
      left: 'center',
      top: 50,
      icon: 'circle'
    },
    radar: {
      indicator,
      shape: 'circle',
      center: ['50%', '55%'],
      radius: '65%',
      axisName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333'
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(64, 158, 255, 0.1)', 'rgba(64, 158, 255, 0.05)']
        }
      }
    },
    series: [
      {
        type: 'radar',
        data,
        symbolSize: 8,
        symbol: 'circle',
        areaStyle: {
          opacity: 0.2
        }
      }
    ]
  }
}
