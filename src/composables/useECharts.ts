/**
 * ECharts 通用组合式封装（核心基础设施）
 * - 用了什么：Vue 生命周期、`shallowRef`、ECharts 实例 API、ResizeObserver。
 * - 为什么用：把 init / setOption / resize / dispose 统一封装，避免每个页面重复写图表生命周期代码。
 * - 怎么调用：
 *   1) `const chartRef = ref<HTMLElement | null>(null)`
 *   2) `const { setOption } = useECharts(chartRef)`
 *   3) DOM 挂载后执行 `setOption(option, true)` 渲染图表。
 */
import { onBeforeUnmount, onMounted, shallowRef, unref, type Ref } from 'vue'
import * as echarts from 'echarts'

type EChartsTheme = string | undefined

export function useECharts(
  domRef: Ref<HTMLElement | null | undefined>,
  theme?: EChartsTheme
) {
  const chartRef = shallowRef<echarts.ECharts | null>(null)

  const resize = () => {
    const inst = chartRef.value
    if (!inst || inst.isDisposed()) return
    inst.resize()
  }

  const init = () => {
    const dom = unref(domRef)
    if (!dom) return null

    const existing = chartRef.value
    if (existing) {
      if (existing.isDisposed()) {
        chartRef.value = null
      } else {
        const prevDom = existing.getDom()
        if (prevDom === dom) return existing
        existing.dispose()
        chartRef.value = null
      }
    }

    chartRef.value = echarts.init(dom, theme)
    requestAnimationFrame(() => resize())
    return chartRef.value
  }

  const setOption = (
    option: echarts.EChartsOption,
    notMerge: boolean = false
  ) => {
    init()
    chartRef.value?.setOption(option, notMerge)
    requestAnimationFrame(() => resize())
  }

  let ro: ResizeObserver | null = null

  onMounted(() => {
    const dom = unref(domRef)
    if (dom && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => resize())
      ro.observe(dom)
    }
    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    ro?.disconnect()
    ro = null
    window.removeEventListener('resize', resize)
    const inst = chartRef.value
    if (inst && !inst.isDisposed()) {
      inst.dispose()
    }
    chartRef.value = null
  })

  return {
    chart: chartRef,
    init,
    resize,
    setOption
  }
}
