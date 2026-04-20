/**
 * Sales 模块导出入口（Barrel）
 * - 用了什么：统一转发导出。
 * - 为什么用：页面层 import 路径更短、更稳定，后续调整内部结构不影响调用方。
 * - 怎么调用：`import { useSalesDashboardState, buildSalesChartOption } from '../features/sales'`。
 */
export { useSalesDashboardState } from './composables/useSalesDashboardState'
export { buildSalesChartOption } from './composables/useSalesChartOption'
