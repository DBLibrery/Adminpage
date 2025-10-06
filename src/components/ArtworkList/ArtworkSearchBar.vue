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
// 이 컴포넌트만의 스타일, 또는 _style.scss에 정의된 공용 스타일을 사용합니다.
// 'var' 네임스페이스를 사용합니다.
// ArtworkListPanel.vue, ExhibitionListPanel.vue, LectureListPanel.vue 등 Panel 파일들은
// @use '@/assets/styles/_style.scss' as var; 이 라인만 있으면 됩니다.
// SidebarMenu.vue, ManagedHomepages.vue 도 이 라인만 있으면 됩니다.
// (여기까지는 스타일을 직접 이 파일에 넣는 것이 아니라, _style.scss에서 가져오는 것임)
@use '@/assets/styles/_style.scss' as var;
</style>