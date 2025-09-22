<!-- src/components/ArtworkListPanel.vue -->
<template>
  <div class="artwork-list-panel">
    <div class="panel-header">
      <h3>영선갤러리 작품 리스트</h3>
      <div>
        <button class="add-new-button" @click="startAddingNew">새 작품 추가</button>
        <button class="download-json-button" @click="downloadJson">모든 작품 저장 (JSON 다운로드)</button>
      </div>
    </div>
    
    <!-- 로딩, 에러, 데이터 없음 메시지 -->
    <div v-if="loading" class="loading-message">작품 정보를 불러오는 중입니다...</div>
    <div v-else-if="error" class="error-message">작품 정보를 불러오는데 실패했습니다: {{ error.message }}</div>
    <div v-else-if="filteredItems.length === 0 && debouncedSearchTerm" class="no-data-message">"{{ debouncedSearchTerm }}"(으)로 검색된 작품이 없습니다.</div>
    <div v-else-if="filteredItems.length === 0 && !isAddingNew && !loading" class="no-data-message">등록된 작품 정보가 없습니다.</div>

    <!-- 새 작품 추가 폼: ArtworkAddForm 컴포넌트 사용 -->
    <ArtworkAddForm 
      v-if="isAddingNew" 
      :initial-code="generateNewArtworkCode" 
      @add-artwork="onArtworkAdded" 
      @cancel="cancelAddingNew" 
    ></ArtworkAddForm>

    <!-- 검색 입력창: ArtworkSearchBar 컴포넌트 사용 -->
    <ArtworkSearchBar v-model="searchTerm" />

    <!-- 작품 목록 테이블: ArtworkTable 컴포넌트 사용 -->
    <ArtworkTable 
      v-if="displayedItems.length > 0"
      :artworks="displayedItems" 
      :img-base-url="IMG_BASE_URL" 
      @start-edit="startEditingArtwork" 
      @save-artwork="saveEditedArtwork" 
      @cancel-edit="cancelEditingArtwork" 
      @delete-artwork="deleteArtwork" 
    ></ArtworkTable>
    
    <!-- 더 보기 버튼: ArtworkLoadMoreButton 컴포넌트 사용 -->
    <ArtworkLoadMoreButton 
      :has-more="hasMore" 
      @load-more="loadMore" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'; 

// 분리된 UI 컴포넌트들 임포트
import ArtworkAddForm from './ArtworkAddForm.vue'; 
import ArtworkSearchBar from './ArtworkSearchBar.vue';
import ArtworkTable from './ArtworkTable.vue'; 
import ArtworkLoadMoreButton from './ArtworkLoadMoreButton.vue';

// 분리된 스크립트 로직 (Composables) 임포트 (확장자 .js 명확히 명시)
import { useArtworkData } from '../../composables/useArtworkData.js';
import { useFilterAndPagination } from '../../composables/useFilterAndPagination.js';

// useArtworkData Composable 사용: 작품 데이터, 로딩/에러 상태, CRUD 함수들 가져오기
const {
  artworks,             // 모든 작품 데이터 (ref)
  loading,              // 로딩 상태 (ref)
  error,                // 에러 상태 (ref)
  IMG_BASE_URL,         // 이미지 기본 URL
  generateNewArtworkCode, // 새 작품 코드 생성 함수
  addArtwork,           // 작품 추가 함수 (Composable 내부 로직)
  startEditingArtwork,  // 수정 시작 함수
  saveEditedArtwork,    // 저장 함수
  cancelEditingArtwork, // 취소 함수
  deleteArtwork,        // 삭제 함수
  downloadJson          // JSON 다운로드 함수
} = useArtworkData(); // useArtworkData를 호출하여 필요한 모든 반응형 데이터와 함수를 가져옵니다.

// useFilterAndPagination Composable 사용: 검색어, 필터링된/표시될 아이템, 페이지네이션 로직 가져오기
// artworks (전체 데이터)와 searchKeys (검색할 필드 목록)를 인자로 전달합니다.
const searchKeys = ['code', 'title', 'artist', 'technique', 'setName', 'year', 'buyPrice', 'sellPrice', 'stockDate'];
const {
  searchTerm,           // 검색어 입력 (ref)
  debouncedSearchTerm,  // 디바운싱된 검색어 (computed)
  filteredItems,        // 검색 필터링된 작품 목록 (computed)
  displayedItems,       // 현재 페이지에 표시될 작품 목록 (computed)
  hasMore,              // 더보기 버튼 표시 여부 (computed)
  loadMore,             // 더보기 버튼 클릭 함수
  currentPage           // 현재 페이지 번호 (ref) - 새 항목 추가 시 페이지 리셋에 사용
} = useFilterAndPagination(artworks, searchKeys);


// ArtworkListPanel 고유의 UI 상태 및 이벤트 핸들러
const isAddingNew = ref(false); // '새 작품 추가' 폼을 표시할지 여부만 관리합니다.

// '새 작품 추가' 버튼 클릭 시 폼을 띄우는 함수
const startAddingNew = () => {
  isAddingNew.value = true;
};

// ArtworkAddForm 컴포넌트로부터 'add-artwork' 이벤트 수신 시 호출되는 함수
const onArtworkAdded = (newArtData) => {
  // useArtworkData 컴포저블의 addArtwork 함수를 호출하여 실제 데이터 추가 로직을 실행합니다.
  const success = addArtwork(newArtData); 
  if (success) {
    // 데이터 추가 성공 시, 페이지를 1로 리셋하여 새로 추가된 작품이 보이도록 합니다.
    currentPage.value = 1; 
  }
  isAddingNew.value = false; // 폼 닫기 (성공 여부와 상관없이)
};

// ArtworkAddForm 컴포넌트로부터 'cancel' 이벤트 수신 시 호출되는 함수
const cancelAddingNew = () => {
  isAddingNew.value = false;
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