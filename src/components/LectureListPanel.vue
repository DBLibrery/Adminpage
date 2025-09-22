<!-- src/components/LectureListPanel.vue -->
<template>
  <div class="lecture-list-panel">
    <div class="panel-header">
      <h3>영선갤러리 특강 목록</h3>
      <div>
        <button class="add-new-button" @click="startAddingNew">새 특강 추가</button>
        <button class="download-json-button" @click="downloadJson">모든 특강 저장 (JSON 다운로드)</button>
      </div>
    </div>
    
    <div v-if="loading" class="loading-message">특강 정보를 불러오는 중입니다...</div>
    <div v-else-if="error" class="error-message">특강 정보를 불러오는데 실패했습니다: {{ error.message }}</div>
    <div v-else-if="displayedLectures.length === 0 && !isAddingNew && !loading" class="no-data-message">등록된 특강 정보가 없습니다.</div>

    <!-- 새 특강 추가 폼 -->
    <div v-if="isAddingNew" class="add-new-form">
      <h4>새 특강 추가</h4>
      <div class="form-row">
        <label>제목</label>
        <input type="text" v-model="newLecture.title" placeholder="특강 제목" />
      </div>
      <div class="form-row">
        <label>강사 (SLI)</label>
        <input type="text" v-model="newLecture.SLI" placeholder="예: 김정환 작가" />
      </div>
      <div class="form-row">
        <label>일시</label>
        <input type="text" v-model="newLecture.date" placeholder="예: 2025.03.10." />
      </div>
      <div class="form-row">
        <label>이미지 URL</label>
        <input type="text" v-model="newLecture.image" placeholder="포스터 이미지 URL (선택 사항)" />
      </div>
      <div class="form-actions">
        <button class="save-button" @click="addNewLecture">추가</button>
        <button class="cancel-button" @click="cancelAddingNew">취소</button>
      </div>
    </div>

    <!-- 특강 목록 테이블 -->
    <div v-if="displayedLectures.length > 0" class="lecture-table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>포스터</th>
            <th>제목</th>
            <th>강사</th>
            <th>일시</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lec in displayedLectures" :key="lec.id"> <!-- 'lectures' 대신 'displayedLectures' 사용 -->
            <td>{{ lec.id }}</td>
            <td class="poster-col">
              <img v-if="lec.image" :src="lec.image" :alt="lec.title" class="lecture-poster-thumb" />
              <span v-else class="no-image-text">이미지 없음</span>
            </td>
            <td>
              <span v-if="!lec.isEditing">{{ lec.title }}</span>
              <input v-else v-model="lec.editedData.title" type="text" class="edit-input" />
            </td>
            <td>
              <span v-if="!lec.isEditing">{{ lec.SLI }}</span>
              <input v-else v-model="lec.editedData.SLI" type="text" class="edit-input" />
            </td>
            <td>
              <span v-if="!lec.isEditing">{{ lec.date }}</span>
              <input v-else v-model="lec.editedData.date" type="text" class="edit-input" />
            </td>
            <td class="actions-col">
              <template v-if="!lec.isEditing">
                <button class="edit-button" @click="startEditing(lec)">수정</button>
                <button class="delete-button" @click="deleteLecture(lec)">삭제</button>
              </template>
              <template v-else>
                <button class="save-button" @click="saveLecture(lec)">저장</button>
                <button class="cancel-button" @click="cancelEditing(lec)">취소</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="hasMore" @click="loadMore" class="load-more-button">더 보기</button> <!-- 더 보기 버튼 추가 -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; // 'computed' 불러오기 추가

const lectures = ref([]);
const loading = ref(true);
const error = ref(null);
const isAddingNew = ref(false); // 새 특강 추가 폼 표시 여부
const newLecture = ref({
  id: null, 
  title: '',
  SLI: '',
  date: '',
  image: '', 
});

// 페이지네이션 관련 상태 추가
const itemsPerPage = ref(5); // 한 번에 보여줄 항목 수 (테스트 용으로 작게 설정)
const currentPage = ref(1); // 현재 페이지

// 실제로 화면에 보여줄 특강 항목들
const displayedLectures = computed(() => {
  return lectures.value.slice(0, currentPage.value * itemsPerPage.value);
});

// 더 불러올 항목이 남아있는지 여부
const hasMore = computed(() => {
  return displayedLectures.value.length < lectures.value.length;
});

// 더 보기 버튼 클릭 시
const loadMore = () => {
  currentPage.value++;
};

onMounted(async () => {
  try {
    const response = await fetch('/data/lectures.json'); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    lectures.value = data.map(item => ({
      ...item,
      isEditing: false, 
      editedData: { ...item },
      originalDataCopy: { ...item } 
    }));
  } catch (e) {
    error.value = e;
    console.error("특강 정보를 불러오는데 실패했습니다:", e);
  } finally {
    loading.value = false;
  }
});

// 이미지 URL에 ?raw=true가 붙도록 정규화하는 헬퍼 함수
const ensureRawTrue = (imageUrl) => {
  if (!imageUrl) return ''; // 이미지가 없으면 빈 문자열 반환
  if (imageUrl.includes('?raw=')) { 
    return imageUrl;
  }
  // GitHub 블롭 이미지이고 '?raw='가 없으면 붙여줌
  if (imageUrl.includes('github.com') && imageUrl.includes('blob')) {
    return imageUrl + '?raw=true';
  }
  return imageUrl; // 그 외에는 원본 URL 반환
};


const startEditing = (lec) => {
  lec.originalDataCopy = { ...lec }; 
  lec.editedData = { ...lec }; 
  lec.isEditing = true;
};

const saveLecture = (lec) => {
  // 저장 전에 이미지 URL 정규화
  lec.editedData.image = ensureRawTrue(lec.editedData.image);

  Object.assign(lec, lec.editedData); 
  lec.isEditing = false;
  console.log('특강 저장됨 (프론트엔드):', lec);
  alert(`'${lec.title}' 특강 정보가 프론트엔드에 저장되었습니다!`);
  lec.originalDataCopy = { ...lec };
};

const cancelEditing = (lec) => {
  lec.editedData = { ...lec.originalDataCopy }; 
  lec.isEditing = false;
  console.log('편집 취소됨:', lec);
};

const deleteLecture = (lec) => {
  console.log('삭제 버튼 클릭! 특강 정보:', lec);
  if (confirm(`정말로 '${lec.title}' 특강을 삭제하시겠습니까?`)) {
    alert(`'${lec.title}' 특강을 삭제합니다! (프론트엔드에서만 반영)`);
    lectures.value = lectures.value.filter(item => item.id !== lec.id);
  }
};

const downloadJson = () => {
  const dataToDownload = lectures.value.map(item => {
    const { isEditing, editedData, originalDataCopy, ...rest } = item;
    // 다운로드 시에도 모든 이미지 URL이 정규화되도록
    rest.image = ensureRawTrue(rest.image);
    return rest;
  });

  const jsonString = JSON.stringify(dataToDownload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lectures_updated.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('수정된 특강 목록 JSON 파일이 다운로드됩니다!');
};

// 새 특강 추가 시작
const startAddingNew = () => {
  isAddingNew.value = true;
  const maxId = lectures.value.reduce((max, item) => Math.max(max, item.id), 0);
  const newId = maxId + 1;

  newLecture.value = {
    id: newId, 
    title: '',
    SLI: '',
    date: '',
    image: '',
  };
};

// 새 특강 추가 (실제 로직)
const addNewLecture = () => {
  if (!newLecture.value.title || !newLecture.value.SLI || !newLecture.value.date) {
    alert('제목, 강사, 일시는 필수 입력 사항입니다!');
    return;
  }

  // 새 특강 이미지 URL 정규화
  newLecture.value.image = ensureRawTrue(newLecture.value.image);

  const newLec = {
    id: newLecture.value.id, // 자동 생성된 ID 사용
    title: newLecture.value.title,
    SLI: newLecture.value.SLI,
    date: newLecture.value.date,
    image: newLecture.value.image,
    isEditing: false,
    editedData: { ...newLecture.value },
    originalDataCopy: { ...newLecture.value }
  };

  // 목록 상단에 추가
  lectures.value.unshift(newLec);
  // 새 항목이 추가되면 첫 페이지로 리셋하여 새로 추가된 항목이 보이도록
  currentPage.value = 1; 

  isAddingNew.value = false; // 폼 닫기
  alert(`'${newLec.title}' 특강이 목록에 추가되었습니다! (ID: ${newLec.id})`);
  console.log('새 특강 추가됨:', newLec);
  newLecture.value = { id: null, title: '', SLI: '', date: '', image: '' };
};

// 새 특강 추가 취소
const cancelAddingNew = () => {
  isAddingNew.value = false; // 폼 닫기
  newLecture.value = { id: null, title: '', SLI: '', date: '', image: '' };
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.lecture-list-panel {
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid $accent-color;
    padding-bottom: 10px;

    h3 {
      color: $primary-color;
      font-size: 1.8rem;
      margin: 0;
    }
    div { // 버튼들을 묶는 div 스타일
      display: flex;
      gap: 10px;
    }
  }

  .add-new-button {
    background-color: #007bff; // 파란색
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: darken(#007bff, 10%);
    }
  }
  .download-json-button {
    background-color: #28a745; // 녹색
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: darken(#28a745, 10%);
    }
  }

  .add-new-form {
    background-color: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);

    h4 {
      margin-top: 0;
      color: $primary-color;
      font-size: 1.4rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .form-row {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      label {
        font-weight: bold;
        color: #555;
        margin-bottom: 5px;
      }
      input[type="text"], textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      textarea {
        resize: vertical;
        min-height: 80px;
      }
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      button {
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s ease;
      }
      .save-button {
        background-color: $accent-color;
        color: white;
        &:hover { background-color: darken($accent-color, 10%); }
      }
      .cancel-button {
        background-color: #6c757d;
        color: white;
        &:hover { background-color: darken(#6c757d, 10%); }
      }
    }
  }

  .loading-message, .error-message, .no-data-message {
    text-align: center;
    padding: 30px;
    color: #666;
  }
  .error-message {
    color: #d32f2f;
  }
  
  .lecture-table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;

    th, td {
      border: 1px solid #e0e0e0;
      padding: 12px 15px;
      text-align: left;
      vertical-align: middle;
    }

    th {
      background-color: #f5f7fa;
      color: $primary-color;
      font-weight: bold;
      white-space: nowrap;
    }

    tbody tr:nth-child(even) {
      background-color: #fcfcfc;
    }
    tbody tr:hover {
      background-color: #f0f8ff;
    }

    .poster-col {
      width: 100px;
      text-align: center;
    }
    .lecture-poster-thumb {
      max-width: 80px;
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 4px;
    }
    .no-image-text {
        color: #888;
        font-size: 0.85rem;
    }

    .actions-col {
      width: 150px;
      text-align: center;
      white-space: nowrap;
    }
    .actions-col button {
      padding: 6px 10px;
      margin: 0 3px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .edit-button {
      background-color: #007bff;
      color: white;
      &:hover { background-color: darken(#007bff, 10%); }
    }
    .delete-button {
      background-color: #dc3545;
      color: white;
      &:hover { background-color: darken(#dc3545, 10%); }
    }
    .save-button {
      background-color: $accent-color;
      color: white;
      &:hover { background-color: darken($accent-color, 10%); }
    }
    .cancel-button {
      background-color: #6c757d;
      color: white;
      &:hover { background-color: darken(#6c757d, 10%); }
    }

    .edit-input, .edit-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 0.9rem;
      resize: vertical;
    }
    .edit-textarea {
      min-height: 60px;
    }
    .load-more-button {
        display: block;
        width: 100%;
        padding: 10px 20px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-top: 20px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #e0e0e0;
        }
    }
  }
}
</style>