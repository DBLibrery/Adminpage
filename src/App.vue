<!-- src/App.vue -->
<template>
  <AdminLayout :current-panel="currentPanel" @switch-panel="switchPanel">
    <template #sidebar>
      <SidebarMenu :current-panel="currentPanel" @switch-panel="switchPanel" />
    </template>

    <component :is="activePanelComponent"></component>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue';

import AdminLayout from './components/AdminLayout.vue';
import SidebarMenu from './components/SidebarMenu.vue';

// 각 패널 컴포넌트 임포트
import ArtworkListPanel from './components/ArtworkList/ArtworkListPanel.vue'; 
import ExhibitionListPanel from './components/ExhibitionList/ExhibitionListPanel.vue';
import LectureListPanel from './components/LectureList/LectureListPanel.vue';
// <<<<<<< 여기가 삭제됩니다! >>>>>>>
// import ManagedHomepages from './components/ManagedHomepages.vue';
// <<<<<<< 여기까지 삭제됩니다! >>>>>>>

const currentPanel = ref('ArtworkListPanel'); 

const activePanelComponent = computed(() => {
  switch (currentPanel.value) {
    case 'ArtworkListPanel':
      return ArtworkListPanel;
    case 'ExhibitionListPanel':
      return ExhibitionListPanel;
    case 'LectureListPanel':
      return LectureListPanel;
    // <<<<<<< 여기가 삭제됩니다! >>>>>>>
    // case 'ManagedHomepages':
    //   return ManagedHomepages;
    // <<<<<<< 여기까지 삭제됩니다! >>>>>>>
    default:
      return ArtworkListPanel; // 기본값
  }
});

const switchPanel = (panelName) => {
  currentPanel.value = panelName;
};
</script>

<style>
/* App.vue에는 전역 스타일을 두지 않습니다. */
</style>