<!-- src/components/AdminLayout.vue -->
<template>
  <div class="admin-wrapper">
    <header class="admin-header">
      <h1>DBLibrery 관리자 페이지</h1>
      <div class="header-buttons-container">
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
// 여기는 나중에 Vue 로직을 추가할 공간이야. 지금은 비워둬도 돼!
</script>

<!-- 여기에서 "scoped" 키워드를 제거했습니다! -->
<style lang="scss">
// 스타일 코드가 길어지는 것을 방지하기 위해 별도의 SCSS 파일에서 불러옵니다.
@import '@/assets/styles/_admin-layout.scss'; 

// 이 스타일은 AdminLayout.vue 내에서 정의되었지만,
// scoped가 없으므로 전역적으로 적용될 수 있습니다.
// 특히 .admin-header 내부의 요소 정렬에 사용됩니다.
.admin-header {
  display: flex; // flexbox를 사용해서 내부 요소들을 정렬
  justify-content: space-between; // h1과 버튼들을 양 끝으로 정렬
  align-items: center; // 세로 중앙 정렬

  h1 {
    margin: 0; // h1의 기본 마진 제거
    font-size: 1.5rem;
    color: white; // 색상 유지
  }
}

.header-buttons-container {
  display: flex; // 버튼 컨테이너도 flex로
  gap: 10px; // 버튼 사이 간격
  // 이 컨테이너 안에 ManagedHomepages 컴포넌트가 들어와서 버튼들을 포함하게 됩니다.
}
</style>