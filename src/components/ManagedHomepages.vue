<!-- src/components/ManagedHomepages.vue -->
<template>
  <div class="managed-homepages">
    <!-- 버튼 클릭 시 'select-page' 이벤트를 발생시키고, 어떤 페이지인지 알려줍니다. -->
    <button class="homepage-button" @click="selectHomepage('영선갤러리')">영선갤러리</button>
    <button class="homepage-button" @click="selectHomepage('DTS GRF')">DTS GRF</button>
  </div>
</template>

<script setup>
// 'select-page' 이벤트를 정의합니다. 이 이벤트를 부모 컴포넌트가 받아서 처리할 수 있습니다.
const emits = defineEmits(['select-page']);

const selectHomepage = (siteName) => {
  // 버튼 클릭 시 'select-page' 이벤트를 발생시키고, 클릭된 버튼의 이름을 전달합니다.
  emits('select-page', siteName);
  console.log(`${siteName} 버튼 클릭됨.`);
};
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