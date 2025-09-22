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
// _variables.scss 파일에서 변수를 불러옵니다.
@import '@/assets/styles/_variables.scss'; 

.managed-homepages {
  display: flex;
  gap: 10px; // 버튼 사이 간격
}

.homepage-button {
  background-color: $accent-color; // _variables.scss의 $accent-color 사용
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  white-space: nowrap; // 텍스트 줄바꿈 방지

  &:hover {
    background-color: darken($accent-color, 10%); // Hover 시 색상 어둡게
  }
}
</style>