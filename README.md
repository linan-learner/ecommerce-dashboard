# Ecommerce Dashboard (Vue 3 + TypeScript)

一个面向电商经营分析的前端可视化看板，包含实时销售趋势、地区销售分布、商品雷达对比、用户行为漏斗/桑基图，以及性能监控面板。

## 技术栈

- Vue 3 + Composition API
- TypeScript
- Vite
- ECharts
- Element Plus

## 项目结构（面试可讲重点）

- `src/views/*`：各业务大屏页面（图表 + 交互逻辑）
- `src/composables/useECharts.ts`：统一图表生命周期（`init / resize / dispose`），减少重复代码和实例泄漏风险
- `src/api/*`：数据层抽象（当前实时订单为 Mock，可替换为真实接口实现）
- `src/composables/useTheme.ts`：主题初始化（当前固定浅色，已移除深色模式）

## 你可以怎么展示「工程化能力」

1. 图表生命周期统一封装：避免频繁 `echarts.init/dispose` 的重复与内存泄漏
2. 数据与 UI 解耦：`SalesDashboard` 实时订单改为走 `src/api/sales.ts`（Mock），后续替换真实 API 不改组件结构
3. 性能意识：`SalesDashboard` 使用滚动虚拟可视区思想（只渲染可见部分）

## 开发与构建

```bash
npm install
npm run dev
```

生产构建（含类型检查）：

```bash
npm run build
```

代码检查：

```bash
npm run lint
```

本地类型检查：`npm run type-check`。编辑器建议安装 [Vue - Official (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。Vite 配置见 [vite.config.ts](vite.config.ts)。
