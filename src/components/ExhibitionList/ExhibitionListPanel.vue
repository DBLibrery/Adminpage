<!-- src/components/ExhibitionListPanel.vue -->
<template>
  <div class="exhibition-list-panel">
    <div class="panel-header">
      <h3>영선갤러리 전시 목록</h3>
      <div>
        <button class="add-new-button" @click="startAddingNew">새 전시 추가</button>
        <button class="download-json-button" @click="downloadJson">모든 전시 저장 (JSON 다운로드)</button>
      </div>
    </div>
    
    <!-- 로딩, 에러, 데이터 없음 메시지 -->
    <div v-if="loading" class="loading-message">전시 정보를 불러오는 중입니다...</div>
    <div v-else-if="error" class="error-message">전시 정보를 불러오는데 실패했습니다: {{ error.message }}</div>
    <div v-else-if="filteredItems.length === 0 && !loading" class="no-data-message">등록된 전시 정보가 없습니다.</div>

    <!-- 새 전시 추가 폼: ExhibitionAddForm 컴포넌트 사용 -->
    <ExhibitionAddForm 
      v-if="isAddingNew" 
      :initial-id="generateNewExhibitionId" 
      @add-exhibition="onExhibitionAdded" 
      @cancel="cancelAddingNew" 
    ></ExhibitionAddForm>

    <!-- 전시 목록 테이블: ExhibitionTable 컴포넌트 사용 -->
    <ExhibitionTable 
      v-if="displayedItems.length > 0"
      :exhibitions="displayedItems" 
      @start-edit="startEditingExhibition" 
      @save-exhibition="saveEditedExhibition" 
      @cancel-edit="cancelEditingExhibition" 
      @delete-exhibition="deleteExhibition" 
    ></ExhibitionTable>
    
    <!-- 더 보기 버튼: ExhibitionLoadMoreButton 컴포넌트 사용 -->
    <ExhibitionLoadMoreButton 
      :has-more="hasMore" 
      @load-more="loadMore" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'; // 이제 ref만 필요하고 나머지는 Composables 안으로 이동했습니다.

// 분리된 UI 컴포넌트들 임포트
import ExhibitionAddForm from './ExhibitionAddForm.vue'; 
import ExhibitionTable from './ExhibitionTable.vue'; 
import ExhibitionLoadMoreButton from './ExhibitionLoadMoreButton.vue';

// 분리된 스크립트 로직 (Composables) 임포트
import { useExhibitionData } from '../../composables/useExhibitionData.js'; // 전시 데이터 관련 로직
import { useFilterAndPagination } from '../../composables/useFilterAndPagination.js'; // 검색 및 페이지네이션 로직

// useExhibitionData Composable 사용: 전시 데이터, 로딩/에러 상태, CRUD 함수들 가져오기
const {
  exhibitions,             // 모든 전시 데이터 (ref)
  loading,                 // 로딩 상태 (ref)
  error,                   // 에러 상태 (ref)
  generateNewExhibitionId, // 새 전시 ID 생성 함수
  addExhibition,           // 전시 추가 함수
  startEditingExhibition,  // 수정 시작 함수
  saveEditedExhibition,    // 저장 함수
  cancelEditingExhibition, // 취소 함수
  deleteExhibition,        // 삭제 함수
  downloadJson             // JSON 다운로드 함수
} = useExhibitionData(); // useExhibitionData를 호출하여 필요한 모든 반응형 데이터와 함수를 가져옵니다.

// useFilterAndPagination Composable 사용: 필터링된/표시될 아이템, 페이지네이션 로직 가져오기
// 전시 데이터에는 검색 기능이 없으므로 searchKeys는 비어있는 배열을 전달합니다.
const searchKeys = []; // 전시 패널에는 현재 검색 기능이 없으므로 빈 배열 전달
const {
  filteredItems,       // 검색 필터링된 전시 목록 (여기서는 모든 전시가 됨)
  displayedItems,      // 현재 페이지에 표시될 전시 목록
  hasMore,             // 더보기 버튼 표시 여부
  loadMore,            // 더보기 버튼 클릭 함수
  currentPage          // 현재 페이지 번호 (새 항목 추가 시 페이지 리셋에 사용)
} = useFilterAndPagination(exhibitions, searchKeys); // useFilterAndPagination을 호출하여 필요한 모든 반응형 데이터와 함수를 가져옵니다.


// ExhibitionListPanel 고유의 UI 상태 및 이벤트 핸들러
const isAddingNew = ref(false); // '새 전시 추가' 폼을 표시할지 여부만 관리합니다.

// '새 전시 추가' 버튼 클릭 시 폼을 띄우는 함수
const startAddingNew = () => {
  isAddingNew.value = true;
};

// ExhibitionAddForm 컴포넌트로부터 'add-exhibition' 이벤트 수신 시 호출되는 함수
const onExhibitionAdded = (newExhData) => {
  // useExhibitionData 컴포저블의 addExhibition 함수를 호출하여 실제 데이터 추가 로직을 실행합니다.
  const success = addExhibition(newExhData); 
  if (success) {
    // 데이터 추가 성공 시, 페이지를 1로 리셋하여 새로 추가된 전시가 보이도록 합니다.
    currentPage.value = 1; 
  }
  isAddingNew.value = false; // 폼 닫기 (성공 여부와 상관없이)
};

// ExhibitionAddForm 컴포넌트로부터 'cancel' 이벤트 수신 시 호출되는 함수
const cancelAddingNew = () => {
  isAddingNew.value = false;
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_style.scss'; 
</style>