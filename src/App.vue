<script setup lang="ts">
// 主应用组件
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  background-color: #121212;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  width: 100%;
}

/* 添加全局响应式规则 */
@media (max-width: 768px) {
  .app-container {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 0.5rem;
  }
}
</style>
