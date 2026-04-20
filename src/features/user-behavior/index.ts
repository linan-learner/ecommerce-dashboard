/**
 * User Behavior 模块导出入口（Barrel）
 * - 用了什么：统一导出状态模型与图表 option 工厂。
 * - 为什么用：保持视图层 import 整洁，同时隔离内部目录结构。
 * - 怎么调用：`import { useUserBehaviorState, buildFunnelOption, buildSankeyOption } from '../features/user-behavior'`。
 */
export {
  useUserBehaviorState,
  type FunnelStep,
  type SankeyLink,
  type SankeyNode
} from './composables/useUserBehaviorState'
export { buildFunnelOption, buildSankeyOption } from './composables/useUserBehaviorChartOption'
