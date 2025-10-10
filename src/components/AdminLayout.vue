<!-- src/components/AdminLayout.vue -->
<template>
  <div class="admin-layout-container">
    <header class="admin-layout-header">
      <h1>영선갤러리 관리</h1>
      <slot name="homepages-nav"></slot>
    </header>

    <aside class="admin-layout-sidebar">
      <slot name="sidebar"></slot>
    </aside>

    <main class="admin-layout-main">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as var; 

.admin-layout-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "header header"
    "sidebar main";
  min-height: 100vh;
  background-color: var.$main-bg-color; 
  font-family: var.$font-family-base;
  color: var.$text-color;
}

.admin-layout-header {
  grid-area: header;
  background-color: var.$header-bg-color;
  color: var.$header-text-color;
  padding: 15px 20px;
  box-shadow: var.$header-shadow;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  font-size: 1.2em;
  font-weight: bold;
}

.admin-layout-sidebar {
  grid-area: sidebar;
  background-color: var.$sidebar-bg-color;
  padding: 20px 0;
  box-shadow: var.$sidebar-shadow;
}

.admin-layout-main {
  grid-area: main;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas:
      "header"
      "sidebar"
      "main";
  }

  .admin-layout-header {
    justify-content: center;
  }

  .admin-layout-sidebar {
    padding: 10px;
  }
}
</style>