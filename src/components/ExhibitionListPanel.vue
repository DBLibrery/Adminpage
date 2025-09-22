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
    
    <div v-if="loading" class="loading-message">전시 정보를 불러오는 중입니다...</div>
    <div v-else-if="error" class="error-message">전시 정보를 불러오는데 실패했습니다: {{ error.message }}</div>
    <div v-else-if="displayedExhibitions.length === 0 && !isAddingNew && !loading" class="no-data-message">등록된 전시 정보가 없습니다.</div> <!-- 로딩 중일 때는 메시지 표시 안함 -->

    <!-- 새 전시 추가 폼 -->
    <div v-if="isAddingNew" class="add-new-form">
      <h4>새 전시 추가</h4>
      <div class="form-row">
        <label>제목</label>
        <input type="text" v-model="newExhibition.title" placeholder="전시 제목" />
      </div>
      <div class="form-row">
        <label>기간</label>
        <input type="text" v-model="newExhibition.date" placeholder="예: 2025.07.01. ~ 2025.09.30." />
      </div>
      <div class="form-row">
        <label>설명</label>
        <textarea v-model="newExhibition.desc" placeholder="영선갤러리"></textarea>
      </div>
      <div class="form-row">
        <label>이미지 URL</label>
        <input type="text" v-model="newExhibition.image" placeholder="포스터 이미지 URL (예: https://...)" />
      </div>
      <div class="form-actions">
        <button class="save-button" @click="addNewExhibition">추가</button>
        <button class="cancel-button" @click="cancelAddingNew">취소</button>
      </div>
    </div>

    <!-- 전시 목록 테이블 -->
    <div v-if="displayedExhibitions.length > 0" class="exhibition-table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>포스터</th>
            <th>제목</th>
            <th>기간</th>
            <th>설명</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exh in displayedExhibitions" :key="exh.id"> <!-- 'exhibitions' 대신 'displayedExhibitions' 사용 -->
            <td>{{ exh.id }}</td>
            <td class="poster-col">
              <img :src="exh.image" :alt="exh.title" class="exhibition-poster-thumb" />
            </td>
            <td>
              <span v-if="!exh.isEditing">{{ exh.title }}</span>
              <input v-else v-model="exh.editedData.title" type="text" class="edit-input" />
            </td>
            <td>
              <span v-if="!exh.isEditing">{{ exh.date }}</span>
              <input v-else v-model="exh.editedData.date" type="text" class="edit-input" />
            </td>
            <td class="desc-col">
              <span v-if="!exh.isEditing">{{ exh.desc }}</span>
              <textarea v-else v-model="exh.editedData.desc" class="edit-textarea"></textarea>
            </td>
            <td class="actions-col">
              <template v-if="!exh.isEditing">
                <button class="edit-button" @click="startEditing(exh)">수정</button>
                <button class="delete-button" @click="deleteExhibition(exh)">삭제</button>
              </template>
              <template v-else>
                <button class="save-button" @click="saveExhibition(exh)">저장</button>
                <button class="cancel-button" @click="cancelEditing(exh)">취소</button>
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

const exhibitions = ref([]);
const loading = ref(true);
const error = ref(null);
const isAddingNew = ref(false); // 새 전시 추가 폼 표시 여부
const newExhibition = ref({
  id: null, 
  title: '',
  date: '',
  desc: '영선갤러리', 
  image: '', 
});

// 페이지네이션 관련 상태 추가
const itemsPerPage = ref(5); // 한 번에 보여줄 항목 수 (테스트 용으로 작게 설정)
const currentPage = ref(1); // 현재 페이지

// 실제로 화면에 보여줄 전시 항목들
const displayedExhibitions = computed(() => {
  return exhibitions.value.slice(0, currentPage.value * itemsPerPage.value);
});

// 더 불러올 항목이 남아있는지 여부
const hasMore = computed(() => {
  return displayedExhibitions.value.length < exhibitions.value.length;
});

// 더 보기 버튼 클릭 시
const loadMore = () => {
  currentPage.value++;
};

onMounted(async () => {
  try {
    const response = await fetch('/data/exhibitions.json'); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    exhibitions.value = data.map(item => ({
      ...item,
      isEditing: false, 
      editedData: { ...item },
      originalDataCopy: { ...item } 
    }));
  } catch (e) {
    error.value = e;
    console.error("전시 정보를 불러오는데 실패했습니다:", e);
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


const startEditing = (exh) => {
  exh.originalDataCopy = { ...exh }; 
  exh.editedData = { ...exh }; 
  exh.isEditing = true;
};

const saveExhibition = (exh) => {
  // 저장 전에 이미지 URL 정규화
  exh.editedData.image = ensureRawTrue(exh.editedData.image);

  Object.assign(exh, exh.editedData); 
  exh.isEditing = false;
  console.log('전시 저장됨 (프론트엔드):', exh);
  alert(`'${exh.title}' 전시 정보가 프론트엔드에 저장되었습니다!`);
  exh.originalDataCopy = { ...exh };
};

const cancelEditing = (exh) => {
  exh.editedData = { ...exh.originalDataCopy }; 
  exh.isEditing = false;
  console.log('편집 취소됨:', exh);
};

const deleteExhibition = (exh) => {
  console.log('삭제 버튼 클릭! 전시 정보:', exh);
  if (confirm(`정말로 '${exh.title}' 전시를 삭제하시겠습니까?`)) {
    alert(`'${exh.title}' 전시를 삭제합니다! (프론트엔드에서만 반영)`);
    exhibitions.value = exhibitions.value.filter(item => item.id !== exh.id);
    // 항목이 삭제되면 현재 페이지의 데이터가 줄어들 수 있으므로
    // displayedExhibitions가 다시 제대로 계산되도록 강제하는 로직 필요할 수 있으나
    // computed 속성은 반응형 데이터가 변하면 자동으로 재계산됨.
    // 만약 현재 페이지의 아이템 수가 itemsPerPage보다 적어지면 다음 페이지에서 더 불러와야 할 수 있음.
    // 이는 복잡한 페이지네이션 로직으로 넘어가므로 일단은 삭제 시 목록만 갱신.
  }
};

const downloadJson = () => {
  const dataToDownload = exhibitions.value.map(item => {
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
  a.download = 'exhibitions_updated.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('수정된 전시 목록 JSON 파일이 다운로드됩니다!');
};

// 새 전시 추가 시작
const startAddingNew = () => {
  isAddingNew.value = true;
  // 새 전시 코드 자동 생성 (가장 높은 숫자 ID + 1)
  const maxId = exhibitions.value.reduce((max, item) => Math.max(max, item.id), 0);
  const newId = maxId + 1;

  newExhibition.value = {
    id: newId, 
    title: '',
    date: '',
    desc: '영선갤러리',
    image: '',
  };
};

// 새 전시 추가 (실제 로직)
const addNewExhibition = () => {
  if (!newExhibition.value.title || !newExhibition.value.date) {
    alert('제목과 기간은 필수 입력 사항입니다!');
    return;
  }

  // 중복 ID 검사는 reduce로 이미 새로운 ID가 Unique하게 생성되므로 필요 없음.
  // 다만, 혹시 모를 상황 대비 (예: 사용자 직접 ID 입력)

  // 새 전시 이미지 URL 정규화
  newExhibition.value.image = ensureRawTrue(newExhibition.value.image);

  const newExh = {
    id: newExhibition.value.id, // 자동 생성된 ID 사용
    title: newExhibition.value.title,
    date: newExhibition.value.date,
    desc: newExhibition.value.desc,
    image: newExhibition.value.image,
    isEditing: false,
    editedData: { ...newExhibition.value },
    originalDataCopy: { ...newExhibition.value }
  };

  // 목록 상단에 추가
  exhibitions.value.unshift(newExh);
  // 새 항목이 추가되면 첫 페이지로 리셋하여 새로 추가된 항목이 보이도록
  currentPage.value = 1; 

  isAddingNew.value = false; // 폼 닫기
  alert(`'${newExh.title}' 전시가 목록에 추가되었습니다! (ID: ${newExh.id})`);
  console.log('새 전시 추가됨:', newExh);
  // 폼 초기화 (다음에 추가할 때 빈 폼으로 시작)
  newExhibition.value = { id: null, title: '', date: '', desc: '영선갤러리', image: '' };
};

// 새 전시 추가 취소
const cancelAddingNew = () => {
  isAddingNew.value = false; // 폼 닫기
  newExhibition.value = { id: null, title: '', date: '', desc: '영선갤러리', image: '' };
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.exhibition-list-panel {
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
    background-color: #007bff;
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
    background-color: #28a745;
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

  .exhibition-table-container {
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
    .exhibition-poster-thumb {
      max-width: 80px;
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 4px;
    }

    .desc-col {
      max-width: 250px;
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
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