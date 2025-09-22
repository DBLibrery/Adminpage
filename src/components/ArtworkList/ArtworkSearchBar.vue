<!-- src/components/ArtworkSearchBar.vue -->
<template>
  <!-- `search-bar`와 `search-input` 클래스는 _style.scss에 정의된 공용 스타일을 사용합니다. -->
  <div class="search-bar">
    <input 
      type="text" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)" 
      placeholder="제목, 작가, 코드 등으로 검색..." 
      class="search-input" 
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 부모 컴포넌트로부터 검색어(modelValue)를 받습니다.
// Vue의 v-model을 커스텀 컴포넌트에서 사용할 때 modelValue prop과 update:modelValue 이벤트 사용.
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

// 부모 컴포넌트로 검색어 변경 이벤트를 보냅니다.
const emits = defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
// _style.scss에서 공용 스타일을 가져와서 사용합니다.
// scoped 키워드 덕분에 이 컴포넌트 안에서만 스타일이 유효합니다.
@import '@/assets/styles/_style.scss';
</style>