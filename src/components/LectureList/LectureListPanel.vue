<!-- src/components/LectureList/LectureListPanel.vue -->
<template>
  <div class="lecture-list-panel">
    <div class="panel-header">
      <h3>영선갤러리 특강 목록</h3>
      <div>
        <button class="add-new-button" @click="startAddingNew">새 특강 추가</button>
        <button class="download-json-button" @click="downloadJson">모든 특강 저장 (JSON 다운로드)</button>
      </div>
    </div>
    
    <!-- 로딩, 에러, 데이터 없음 메시지 -->
    <div v-if="loading" class="loading-message">특강 정보를 불러오는 중입니다...</div>
    <div v-else-if="error" class="error-message">특강 정보를 불러오는데 실패했습니다: {{ error.message }}</div>
    <div v-else-if="filteredItems.length === 0 && !loading" class="no-data-message">등록된 특강 정보가 없습니다.</div>

    <!-- 새 특강 추가 폼: LectureAddForm 컴포넌트 사용 -->
    <LectureAddForm 
      v-if="isAddingNew" 
      :initial-id="generateNewLectureId" 
      @add-lecture="onLectureAdded" 
      @cancel="cancelAddingNew" 
    ></LectureAddForm>

    <!-- 특강 목록 테이블: LectureTable 컴포넌트 사용 -->
    <LectureTable 
      v-if="displayedItems.length > 0"
      :lectures="displayedItems" 
      @start-edit="startEditingLecture" 
      @save-lecture="saveEditedLecture" 
      @cancel-edit="cancelEditingLecture" 
      @delete-lecture="deleteLecture" 
    ></LectureTable>
    
    <!-- 더 보기 버튼: LectureLoadMoreButton 컴포넌트 사용 -->
    <LectureLoadMoreButton 
      :has-more="hasMore" 
      @load-more="loadMore" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'; 

// 분리된 UI 컴포넌트들 임포트
import LectureAddForm from './LectureAddForm.vue'; 
import LectureTable from './LectureTable.vue'; 
import LectureLoadMoreButton from './LectureLoadMoreButton.vue';

// 분리된 스크립트 로직 (Composables) 임포트 (확장자 .js 명확히 명시)
// LectureListPanel.vue는 src/components/LectureList 안에 있으므로 ../../ 경로로 composables에 접근
import { useLectureData } from '../../composables/useLectureData.js'; 
import { useFilterAndPagination } from '../../composables/useFilterAndPagination.js'; 

// useLectureData Composable 사용: 특강 데이터, 로딩/에러 상태, CRUD 함수들 가져오기
const {
  lectures,             // 모든 특강 데이터 (ref)
  loading,              // 로딩 상태 (ref)
  error,                // 에러 상태 (ref)
  generateNewLectureId, // 새 특강 ID 생성 함수
  addLecture,           // 특강 추가 함수
  startEditingLecture,  // 수정 시작 함수
  saveEditedLecture,    // 저장 함수
  cancelEditingLecture, // 취소 함수
  deleteLecture,        // 삭제 함수
  downloadJson          // JSON 다운로드 함수
} = useLectureData(); 

// useFilterAndPagination Composable 사용: 필터링된/표시될 아이템, 페이지네이션 로직 가져오기
// 특강 데이터에는 검색 기능이 없으므로 searchKeys는 비어있는 배열을 전달합니다.
const searchKeys = []; // 특강 패널에는 현재 검색 기능이 없으므로 빈 배열 전달
const {
  filteredItems,       // 검색 필터링된 특강 목록 (여기서는 모든 특강이 됨)
  displayedItems,      // 현재 페이지에 표시될 특강 목록
  hasMore,             // 더보기 버튼 표시 여부
  loadMore,            // 더보기 버튼 클릭 함수
  currentPage          // 현재 페이지 번호 (새 항목 추가 시 페이지 리셋에 사용)
} = useFilterAndPagination(lectures, searchKeys); 


// LectureListPanel 고유의 UI 상태 및 이벤트 핸들러
const isAddingNew = ref(false); // '새 특강 추가' 폼을 표시할지 여부만 관리합니다.

// '새 특강 추가' 버튼 클릭 시 폼을 띄우는 함수
const startAddingNew = () => {
  isAddingNew.value = true;
};

// LectureAddForm 컴포넌트로부터 'add-lecture' 이벤트 수신 시 호출되는 함수
const onLectureAdded = (newLecData) => {
  // useLectureData 컴포저블의 addLecture 함수를 호출하여 실제 데이터 추가 로직을 실행합니다.
  const success = addLecture(newLecData); 
  if (success) {
    // 데이터 추가 성공 시, 페이지를 1로 리셋하여 새로 추가된 특강이 보이도록 합니다.
    currentPage.value = 1; 
  }
  isAddingNew.value = false; // 폼 닫기 (성공 여부와 상관없이)
};

// LectureAddForm 컴포넌트로부터 'cancel' 이벤트 수신 시 호출되는 함수
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