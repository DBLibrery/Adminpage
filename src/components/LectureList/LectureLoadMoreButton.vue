<!-- src/components/LectureList/LectureLoadMoreButton.vue -->
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
// _style.scss에서 공용 스타일을 가져와서 사용합니다.
// scoped 키워드 덕분에 이 컴포넌트 안에서만 스타일이 유효합니다.
@import '@/assets/styles/_style.scss';
</style>