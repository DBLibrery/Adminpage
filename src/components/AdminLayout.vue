<!-- src/components/AdminLayout.vue (최종 확인 및 복구) -->
<template>
  <div class="admin-wrapper">
    <!-- 이 header가 상단 헤더입니다. -->
    <header class="admin-header">
      <h1>DBLibrery 관리자 페이지</h1>
      <div class="header-buttons-container">
        <!-- 이 부분은 나중에 homepages-nav 슬롯을 구현할 때 사용합니다. -->
        <slot name="homepages-nav"></slot> 
      </div>
    </header>

    <div class="admin-content-area">
      <aside class="admin-sidebar">
        <!-- 이 부분이 SidebarMenu 컴포넌트가 들어갈 슬롯입니다. -->
        <slot name="sidebar"></slot> 
      </aside>

      <main class="admin-main">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// App.vue에서 currentPanel 값을 받아서 사이드바 메뉴 활성화에 사용합니다.
const props = defineProps({
  currentPanel: {
    type: String,
    required: true
  }
});
</script>

<style lang="scss" scoped>
// `_admin-layout.scss` 파일을 `@use`로 불러와서 AdminLayout의 스타일로 사용합니다.
// (이 파일에는 스타일이 직접 정의되지 않으며, 모두 _global-layout.scss에 있음)
@use '@/assets/styles/_admin-layout.scss'; 
</style>