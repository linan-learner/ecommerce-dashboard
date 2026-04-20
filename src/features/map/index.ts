/**
 * Map 模块导出入口（Barrel）
 * - 用了什么：统一对外暴露 state + chart builder。
 * - 为什么用：页面层调用更简洁，减少深层路径耦合。
 * - 怎么调用：`import { useMapDashboardState, buildMapBarOption } from '../features/map'`。
 */
export { useMapDashboardState } from './composables/useMapDashboardState'
export { buildMapBarOption } from './composables/useMapChartOption'
