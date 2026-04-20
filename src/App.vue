<template>
  <div class="dashboard-app">
    <nav class="nav-bar">
      <router-link to="/" class="nav-link">实时销售看板</router-link>
      <router-link to="/map" class="nav-link">省份销售地图</router-link>
      <router-link to="/radar" class="nav-link">商品分析雷达图</router-link>
      <router-link to="/behavior" class="nav-link">用户行为分析</router-link>
      <router-link to="/performance" class="nav-link">性能监控面板</router-link>
    </nav>
    
    <router-view />
  </div>
</template>

<script setup lang="ts">
/**
 * 根布局组件
 * - 用了什么：`router-link` 作为导航、`router-view` 作为页面容器、`useResponsive` 作为全局缩放能力。
 * - 为什么用：把整个项目的“导航壳 + 内容区”统一管理，避免每个页面重复布局代码。
 * - 怎么调用：这是 `main.ts` 挂载的根组件，不需要手动调用；内部执行 `useResponsive()` 即启用大屏适配。
 */
import { useResponsive } from './composables/useResponsive'

// 使用响应式
useResponsive()
</script>

<style>
@import './styles/index.css';
</style>