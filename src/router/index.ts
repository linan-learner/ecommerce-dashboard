/**
 * 路由配置中心
 * - 用了什么：vue-router 的 history 模式 + 路由懒加载（动态 import）。
 * - 为什么用：把每个业务看板拆成独立页面，按需加载减少首屏包体积。
 * - 怎么调用：在 `src/main.ts` 中通过 `app.use(router)` 注册后，全局生效。
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // GitHub Pages 无服务端路由回退，使用 hash history 可避免刷新 404。
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'sales',
      component: () => import('../views/SalesDashboard.vue')
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('../views/MapDashboard.vue')
    },
    {
      path: '/radar',
      name: 'radar',
      component: () => import('../views/ProductRadar.vue')
    },
    {
      path: '/behavior',
      name: 'behavior',
      component: () => import('../views/UserBehavior.vue')
    },
    {
      path: '/performance',
      name: 'performance',
      component: () => import('../views/PerformanceMonitor.vue')
    }
  ]
})

export default router