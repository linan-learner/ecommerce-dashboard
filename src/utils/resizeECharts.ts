/**
 * 全局图表重排工具
 * - 用了什么：`echarts.getInstanceByDom` + 约定式 DOM 标记 `data-echarts-instance`。
 * - 为什么用：某些布局变化（如 transform 缩放）不会触发 window.resize，需要手动触发图表 resize。
 * - 怎么调用：在路由切换后或布局重算后调用 `resizeAllECharts()`。
 */
import * as echarts from 'echarts'

/**
 * 在父级布局或 CSS transform 变化后调用（例如 dashboard 整体 scale），
 * window.resize 不会触发，需主动让各实例重算宽高。
 */
export function resizeAllECharts(): void {
  document.querySelectorAll<HTMLElement>('[data-echarts-instance]').forEach((el) => {
    const chart = echarts.getInstanceByDom(el)
    chart?.resize()
  })
}
