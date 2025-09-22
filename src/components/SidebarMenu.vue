<!-- src/components/SidebarMenu.vue -->
<template>
  <nav class="sidebar-nav">
    <ul>
      <template v-if="selectedHomepage === '영선갤러리'">
        <li v-for="menu in youngsunGalleryMenus" :key="menu.name">
          <a 
            href="#" 
            :class="{ active: selectedMenuItem === menu.name }" 
            @click.prevent="selectMenuItem(menu.name)">
            {{ menu.label }}
          </a>
        </li>
      </template>
      <template v-else-if="selectedHomepage === 'DTS GRF'">
        <li v-for="menu in dtsGrfMenus" :key="menu.name">
          <a 
            href="#" 
            :class="{ active: selectedMenuItem === menu.name }" 
            @click.prevent="selectMenuItem(menu.name)">
            {{ menu.label }}
          </a>
        </li>
      </template>
      <template v-else>
        <li>
            <a href="#" :class="{ active: selectedMenuItem === 'homepage_select_wait' }" @click.prevent="selectMenuItem('homepage_select_wait')">홈페이지 선택 대기</a>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  selectedHomepage: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['select-menu-item']);
const selectedMenuItem = ref('');

const youngsunGalleryMenus = ref([
  { name: 'exhibition_poster_management', label: '전시 포스터 관리' },
  { name: 'lecture_poster_management', label: '특강 포스터 관리' },
  // 이 부분의 label을 '작품 리스트 관리'로 수정합니다.
  { name: 'artwork_list_management', label: '작품 리스트 관리' }, // 이름도 artwork_list_poster_management에서 artwork_list_management으로 더 간결하게 변경!
]);

const dtsGrfMenus = ref([
  { name: 'dts_grf_data_management', label: 'GRF 데이터 관리' },
  { name: 'dts_grf_settings', label: 'GRF 설정' },
]);

const selectMenuItem = (menuName) => {
  selectedMenuItem.value = menuName;
  emits('select-menu-item', menuName);
  console.log(`사이드바 메뉴 클릭: ${menuName}`);
};

watch(() => props.selectedHomepage, () => {
  selectedMenuItem.value = '';
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    a {
      display: block;
      padding: 12px 20px;
      text-decoration: none;
      color: #333;
      transition: background-color 0.2s ease, color 0.2s ease;
      white-space: nowrap;

      &:hover {
        background-color: lighten($accent-color, 40%);
        color: $primary-color;
      }

      &.active {
        background-color: $accent-color;
        color: white;
        font-weight: bold;
      }
    }
  }
}
</style>