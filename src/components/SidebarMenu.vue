<!-- src/components/SidebarMenu.vue -->
<template>
  <nav>
    <ul>
      <li><a href="#" @click.prevent="$emit('switch-panel', 'ArtworkListPanel')" :class="{ active: currentPanel === 'ArtworkListPanel' }">작품 리스트 관리</a></li>
      <li><a href="#" @click.prevent="$emit('switch-panel', 'ExhibitionListPanel')" :class="{ active: currentPanel === 'ExhibitionListPanel' }">전시 목록 관리</a></li>
      <li><a href="#" @click.prevent="$emit('switch-panel', 'LectureListPanel')" :class="{ active: currentPanel === 'LectureListPanel' }">특강 목록 관리</a></li>
      <!-- <<<<<<< 여기가 삭제됩니다! >>>>>>> -->
      <!-- <li><a href="#" @click.prevent="$emit('switch-panel', 'ManagedHomepages')" :class="{ active: currentPanel === 'ManagedHomepages' }">메인 페이지 관리</a></li> -->
      <!-- <<<<<<< 여기까지 삭제됩니다! >>>>>>> -->
    </ul>
  </nav>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  currentPanel: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['switch-panel']);
</script>

<style lang="scss" scoped>
// _admin-layout.scss에 정의된 사이드바 메뉴 스타일을 사용합니다.
</style>