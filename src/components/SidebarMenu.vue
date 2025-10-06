<!-- src/components/SidebarMenu.vue -->
<template>
  <nav class="admin-nav">
    <ul>
      <li><a href="#" @click.prevent="$emit('switch-panel', 'ArtworkListPanel')" :class="{ active: currentPanel === 'ArtworkListPanel' }">작품 리스트 관리</a></li>
      <li><a href="#" @click.prevent="$emit('switch-panel', 'ExhibitionListPanel')" :class="{ active: currentPanel === 'ExhibitionListPanel' }">전시 포스터 관리</a></li>
      <li><a href="#" @click.prevent="$emit('switch-panel', 'LectureListPanel')" :class="{ active: currentPanel === 'LectureListPanel' }">특강 포스터 관리</a></li>
      <!-- '전시특강 연결점 관리' 메뉴는 이전 상태로 되돌리기 위해 추가하지 않습니다. -->
      <!-- <<<<<<< ManagedHomepages 관련 항목은 삭제하거나 주석 처리합니다. >>>>>>> -->
    </ul>
  </nav>
</template>

<script setup>
const props = defineProps({
  currentPanel: { // ✨ prop 이름을 'currentPanel'로 변경하여 HomeView와 통신 방식 일치 ✨
    type: String,
    required: true
  }
});
const emits = defineEmits(['switch-panel']); // ✨ emit 하는 이벤트 이름도 'switch-panel'로 변경 ✨
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_style.scss' as var;
@use '@/assets/styles/_admin-layout.scss'; 
</style>