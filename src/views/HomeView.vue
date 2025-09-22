<!-- src/views/HomeView.vue -->
<template>
  <AdminLayout>
    <!-- AdminLayout의 "homepages-nav" 슬롯에 ManagedHomepages 컴포넌트를 넣어줍니다. -->
    <template #homepages-nav>
      <ManagedHomepages @select-page="handlePageSelect" />
    </template>

    <!-- AdminLayout의 "사이드바" 슬롯에 SidebarMenu 컴포넌트를 넣어줍니다. -->
    <template #sidebar> 
      <SidebarMenu 
        :selectedHomepage="selectedPageName" 
        @select-menu-item="handleMenuItemSelect" 
      />
    </template>

    <!-- AdminLayout의 기본 슬롯 (메인 콘텐츠 영역)으로 들어갈 내용 -->
    <div class="main-content-display">
      <!-- --------------------- 조건부 컴포넌트 렌더링 --------------------- -->
      <!-- "영선갤러리"가 선택되고 "전시 포스터 관리" 메뉴가 클릭되었을 때 -->
      <ExhibitionListPanel 
        v-if="selectedPageName === '영선갤러리' && selectedMenuItem === 'exhibition_poster_management'" 
      />
      <!-- "영선갤러리"가 선택되고 "특강 포스터 관리" 메뉴가 클릭되었을 때 -->
      <LectureListPanel 
        v-else-if="selectedPageName === '영선갤러리' && selectedMenuItem === 'lecture_poster_management'" 
      />
      <!-- "영선갤러리"가 선택되고 "작품 리스트 관리" 메뉴가 클릭되었을 때 -->
      <ArtworkListPanel 
        v-else-if="selectedPageName === '영선갤러리' && selectedMenuItem === 'artwork_list_management'" 
      />
      <!-- 그 외의 경우 (초기 상태, 다른 홈페이지/메뉴 선택) -->
      <div v-else>
        <h2>환영합니다!</h2>
        <p>현재 선택된 페이지: <strong>{{ selectedPageName }}</strong></p>
        <p v-if="selectedMenuItem">선택된 서브 메뉴: <strong>{{ selectedMenuItem }}</strong></p>
        <p v-else-if="selectedPageName !== '없음'">좌측 사이드바에서 메뉴를 선택해 주세요.</p>
        <p v-else>상단의 버튼을 통해 관리할 홈페이지를 선택해 주세요.</p>
      </div>
      <!-- ------------------------------------------------------------- -->
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue';
import AdminLayout from '@/components/AdminLayout.vue';
import ManagedHomepages from '@/components/ManagedHomepages.vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import ExhibitionListPanel from '@/components/ExhibitionListPanel.vue';
import LectureListPanel from '@/components/LectureListPanel.vue'; 
import ArtworkListPanel from '@/components/ArtworkListPanel.vue'; // ArtworkListPanel 컴포넌트 불러오기

const selectedPageName = ref('없음');
const selectedMenuItem = ref('');

const handlePageSelect = (pageName) => {
  selectedPageName.value = pageName;
  selectedMenuItem.value = ''; // 다른 홈페이지 선택 시 서브 메뉴 선택 초기화
};

const handleMenuItemSelect = (menuName) => {
  selectedMenuItem.value = menuName;
};
</script>

<style scoped>
/* HomeView 자체의 스타일은 필요하면 여기에 정의합니다. */
.main-content-display {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-height: 200px; /* 메인 콘텐츠 영역이 너무 작아지지 않도록 최소 높이 지정 */
}
h2 {
  color: #333;
  margin-bottom: 10px;
}
p {
  color: #666;
  line-height: 1.5;
}
strong {
  color: #2c3e50;
  font-weight: bold;
}
</style>