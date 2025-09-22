<!-- src/components/ArtworkLoadMoreButton.vue -->
<template>
  <!-- `load-more-button` 클래스는 _style.scss에 정의된 공용 스타일을 사용합니다. -->
  <button 
    v-if="hasMore" 
    @click="$emit('load-more')" 
    class="load-more-button"
  >
    더 보기
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 부모 컴포넌트로부터 '더 불러올 항목이 있는지' 여부를 받습니다.
const props = defineProps({
  hasMore: {
    type: Boolean,
    required: true
  }
});

// 부모 컴포넌트로 '더 보기' 요청 이벤트를 보냅니다.
const emits = defineEmits(['load-more']);
</script>

<style lang="scss" scoped>
// 이 컴포넌트만의 스타일, 또는 _style.scss에 정의된 공용 스타일을 사용합니다.
// 'var' 네임스페이스를 사용합니다.
// ArtworkListPanel.vue, ExhibitionListPanel.vue, LectureListPanel.vue 등 Panel 파일들은
// @use '@/assets/styles/_style.scss' as var; 이 라인만 있으면 됩니다.
// SidebarMenu.vue, ManagedHomepages.vue 도 이 라인만 있으면 됩니다.
// (여기까지는 스타일을 직접 이 파일에 넣는 것이 아니라, _style.scss에서 가져오는 것임)
@use '@/assets/styles/_style.scss' as var;
</style>