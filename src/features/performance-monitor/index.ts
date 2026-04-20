/**
 * Performance Monitor 模块导出入口（Barrel）
 * - 用了什么：统一导出性能状态管理和图表构建函数。
 * - 为什么用：视图层依赖更清晰，后续重构内部目录时更稳定。
 * - 怎么调用：`import { usePerformanceMonitorState, buildFpsOption, buildMemoryOption } from '../features/performance-monitor'`。
 */
export { usePerformanceMonitorState } from './composables/usePerformanceMonitorState'
export { buildFpsOption, buildMemoryOption } from './composables/usePerformanceChartOption'
