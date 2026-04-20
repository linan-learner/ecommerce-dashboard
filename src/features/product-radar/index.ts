/**
 * Product Radar 模块导出入口（Barrel）
 * - 用了什么：统一转发状态管理与图表配置构建器。
 * - 为什么用：页面层更易读，避免多个深路径 import。
 * - 怎么调用：`import { useProductRadarState, buildRadarOption } from '../features/product-radar'`。
 */
export { useProductRadarState, type RadarDimension } from './composables/useProductRadarState'
export { buildRadarOption } from './composables/useProductRadarChart'
