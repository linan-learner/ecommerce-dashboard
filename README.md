# Ecommerce Dashboard

一个基于 `Vue 3 + TypeScript + Vite` 的电商经营分析可视化看板项目，面向运营与分析场景，聚焦销售、地域、商品、用户行为与前端性能监控。

## 在线预览

- 网站地址：[https://linan-learner.github.io/ecommerce-dashboard/](https://linan-learner.github.io/ecommerce-dashboard/)
- 仓库地址：[https://github.com/linan-learner/ecommerce-dashboard](https://github.com/linan-learner/ecommerce-dashboard)

## 功能模块

- 实时销售看板：销售趋势折线图 + 实时订单滚动列表
- 省份销售分析：省份销售排名与城市级钻取展示
- 商品雷达分析：多商品多维度对比，支持权重调节
- 用户行为分析：漏斗图 + 桑基图观察转化与流向
- 性能监控面板：FPS、内存、API 耗时、资源加载瀑布

## 技术栈

- 核心框架：`Vue 3`、`Vue Router`、`TypeScript`
- 可视化：`ECharts`
- UI 组件：`Element Plus`
- 工程化：`Vite`、`ESLint`、`Prettier`、`vue-tsc`
- 部署：`GitHub Pages` + `GitHub Actions`

## 项目亮点

- 图表生命周期封装：统一 `init / resize / dispose`，降低实例泄漏风险
- 分层清晰：页面层（`views`）与状态层（`features/*/composables`）解耦
- 配置可复用：图表 `option` 构建器独立，便于维护和扩展
- 数据可替换：`api` 层目前为 Mock，实现与真实接口的平滑切换
- 性能意识：订单列表使用可视区渲染思路减少长列表开销

## 快速开始

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:5174/ecommerce-dashboard/`

## 构建与检查

```bash
# 生产构建（含类型检查）
npm run build

# 本地预览构建产物
npm run preview

# 类型检查
npm run type-check

# 代码规范检查与修复
npm run lint
```

## 目录结构

```text
src/
  api/                 # 数据访问层（当前为 Mock）
  composables/         # 通用组合式能力（响应式缩放、ECharts 封装）
  features/            # 按业务模块组织的状态与图表配置
  router/              # 路由配置
  utils/               # 工具函数（如统一触发图表 resize）
  views/               # 页面组件
```

## 部署说明

项目已配置 GitHub Actions 自动部署，推送 `main` 分支后会自动发布到 GitHub Pages。

- 工作流文件：`.github/workflows/deploy.yml`
- Vite 子路径配置：`vite.config.ts` 中 `base: '/ecommerce-dashboard/'`
- 路由模式：`createWebHashHistory`（适配 Pages 刷新场景）

## License

仅用于学习与个人作品展示。
