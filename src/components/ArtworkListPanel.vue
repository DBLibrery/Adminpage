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
    
    <div v-if="loading" class="loading-message">작품 정보를 불러오는 중입니다...</div>
    <div v-else-if="error" class="error-message">작품 정보를 불러오는데 실패했습니다: {{ error.message }}</div>
    <div v-else-if="filteredArtworks.length === 0 && !isAddingNew && !loading && !searchTerm" class="no-data-message">등록된 작품 정보가 없습니다.</div>
    <div v-else-if="filteredArtworks.length === 0 && searchTerm" class="no-data-message">"{{ searchTerm }}"(으)로 검색된 작품이 없습니다.</div>

    <!-- 새 작품 추가 폼 -->
    <div v-if="isAddingNew" class="add-new-form">
      <h4>새 작품 추가</h4>
      <div class="form-row">
        <label>코드</label>
        <input type="text" v-model="newArtwork.code" placeholder="예: YS123 (자동 생성)" disabled />
      </div>
      <div class="form-row">
        <label>제목</label>
        <input type="text" v-model="newArtwork.title" placeholder="작품 제목" />
      </div>
      <div class="form-row">
        <label>작가</label>
        <input type="text" v-model="newArtwork.artist" placeholder="작가 이름" />
      </div>
      <div class="form-row">
        <label>기법</label>
        <input type="text" v-model="newArtwork.technique" placeholder="예: 캔버스에 유채" />
      </div>
      <div class="form-row">
        <label>규격</label>
        <input type="text" v-model="newArtwork.size" placeholder="예: 61 X 50.5cm" />
      </div>
      <div class="form-row">
        <label>연도</label>
        <input type="number" v-model="newArtwork.year" placeholder="예: 2022" />
      </div>
      <!-- 새로운 필드 추가 -->
      <div class="form-row">
        <label>구입가</label>
        <input type="number" v-model="newArtwork.buyPrice" placeholder="구입 가격 (숫자)" />
      </div>
      <div class="form-row">
        <label>판매가</label>
        <input type="number" v-model="newArtwork.sellPrice" placeholder="판매 가격 (숫자)" />
      </div>
      <div class="form-row">
        <label>입고일</label>
        <input type="text" v-model="newArtwork.stockDate" placeholder="예: 2024-01-15" />
      </div>
      <div class="form-row">
        <label>세트명</label>
        <input type="text" v-model="newArtwork.setName" placeholder="세트명 (선택 사항)" />
      </div>

      <div class="form-actions">
        <button class="save-button" @click="addNewArtwork">추가</button>
        <button class="cancel-button" @click="cancelAddingNew">취소</button>
      </div>
    </div>

    <!-- 검색 입력창 -->
    <div class="search-bar">
      <input type="text" v-model="searchTerm" placeholder="제목, 작가, 코드 등으로 검색..." class="search-input" />
    </div>

    <!-- 작품 목록 테이블 -->
    <div v-if="displayedArtworks.length > 0" class="artwork-table-container">
      <table>
        <thead>
          <tr>
            <th>코드</th>
            <th>포스터</th>
            <th>제목</th>
            <th>작가</th>
            <th>기법</th>
            <th>규격</th>
            <th>연도</th>
            <!-- 새로운 컬럼 추가 -->
            <th>구입가</th>
            <th>판매가</th>
            <th>입고일</th>
            <th>세트명</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="artwork in displayedArtworks" :key="artwork.code">
            <td>{{ artwork.code }}</td>
            <td class="poster-col">
              <img 
                v-if="generateArtworkImageUrl(artwork.code)"
                :src="generateArtworkImageUrl(artwork.code)" 
                :alt="artwork.title" 
                class="artwork-poster-thumb" 
              />
              <span v-else class="no-image-text">이미지 없음</span>
            </td>
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.title }}</span>
              <input v-else v-model="artwork.editedData.title" type="text" class="edit-input" />
            </td>
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.artist }}</span>
              <input v-else v-model="artwork.editedData.artist" type="text" class="edit-input" />
            </td>
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.technique }}</span>
              <input v-else v-model="artwork.editedData.technique" type="text" class="edit-input" />
            </td>
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.size }}</span>
              <input v-else v-model="artwork.editedData.size" type="text" class="edit-input" />
            </td>
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.year }}</span>
              <input v-else v-model="artwork.editedData.year" type="number" class="edit-input" />
            </td>
            <!-- 새로운 필드 값 표시 및 편집 입력창 -->
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.buyPrice }}</span>
              <input v-else v-model="artwork.editedData.buyPrice" type="number" class="edit-input" />
            </td>
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.sellPrice }}</span>
              <input v-else v-model="artwork.editedData.sellPrice" type="number" class="edit-input" />
            </td>
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.stockDate }}</span>
              <input v-else v-model="artwork.editedData.stockDate" type="text" class="edit-input" />
            </td>
            <td>
              <span v-if="!artwork.isEditing">{{ artwork.setName }}</span>
              <input v-else v-model="artwork.editedData.setName" type="text" class="edit-input" />
            </td>
            <td class="actions-col">
              <template v-if="!artwork.isEditing">
                <button class="edit-button" @click="startEditing(artwork)">수정</button>
                <button class="delete-button" @click="deleteArtwork(artwork)">삭제</button>
              </template>
              <template v-else>
                <button class="save-button" @click="saveArtwork(artwork)">저장</button>
                <button class="cancel-button" @click="cancelEditing(artwork)">취소</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="hasMore" @click="loadMore" class="load-more-button">더 보기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const artworks = ref([]);
const loading = ref(true);
const error = ref(null);
const isAddingNew = ref(false); 
const searchTerm = ref(''); // 검색어 상태 추가

const newArtwork = ref({
  code: '',
  title: '',
  artist: '',
  technique: '',
  size: '',
  year: null,
  buyPrice: null,   // 새 필드 추가
  sellPrice: null,  // 새 필드 추가
  stockDate: '',    // 새 필드 추가
  setName: '',      // 새 필드 추가
});

// 페이지네이션 관련 상태
const itemsPerPage = ref(5);
const currentPage = ref(1);

// 검색 결과 필터링
const filteredArtworks = computed(() => {
  if (!searchTerm.value) {
    return artworks.value;
  }
  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  return artworks.value.filter(artwork => {
    // 검색어가 제목, 작가, 코드, 기법, 세트명, 심지어 숫자 필드에도 일치하는지 확인
    return (
      String(artwork.code).toLowerCase().includes(lowerCaseSearchTerm) ||
      String(artwork.title).toLowerCase().includes(lowerCaseSearchTerm) ||
      String(artwork.artist).toLowerCase().includes(lowerCaseSearchTerm) ||
      String(artwork.technique).toLowerCase().includes(lowerCaseSearchTerm) ||
      String(artwork.setName || '').toLowerCase().includes(lowerCaseSearchTerm) || // setName이 null일 경우 대비
      String(artwork.year || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      String(artwork.buyPrice || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      String(artwork.sellPrice || '').toLowerCase().includes(lowerCaseSearchTerm) ||
      String(artwork.stockDate || '').toLowerCase().includes(lowerCaseSearchTerm)
    );
  });
});

// 실제로 화면에 보여줄 작품 항목들 (필터링된 결과에서 슬라이스)
const displayedArtworks = computed(() => {
  return filteredArtworks.value.slice(0, currentPage.value * itemsPerPage.value);
});

// 더 불러올 항목이 남아있는지 여부
const hasMore = computed(() => {
  return displayedArtworks.value.length < filteredArtworks.value.length;
});

// 더 보기 버튼 클릭 시
const loadMore = () => {
  currentPage.value++;
};

// GitHub 이미지 저장소의 기본 URL
const IMG_BASE_URL = 'https://github.com/youngsungallery/IMG_DB/blob/main/youngsungallery/art/';

// 작품 코드를 바탕으로 이미지 URL을 생성하는 헬퍼 함수
const generateArtworkImageUrl = (code) => {
  if (!code) return null; 
  return `${IMG_BASE_URL}${code}.png?raw=true`; 
};


onMounted(async () => {
  try {
    const response = await fetch('/data/artworks.json'); 
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    
    // YS 코드 숫자를 기준으로 내림차순(역순) 정렬
    data.sort((a, b) => {
      const getNum = (code) => parseInt(String(code).replace('YS', ''));
      return getNum(b.code) - getNum(a.code);
    });

    artworks.value = data.map(item => ({
      ...item,
      // 숫자 필드는 확실히 숫자로 변환
      year: item.year ? Number(item.year) : null,
      buyPrice: item.buyPrice ? Number(item.buyPrice) : null,
      sellPrice: item.sellPrice ? Number(item.sellPrice) : null,
      // 편집용 데이터 초기화
      isEditing: false, 
      editedData: { 
        ...item,
        year: item.year ? Number(item.year) : null,
        buyPrice: item.buyPrice ? Number(item.buyPrice) : null,
        sellPrice: item.sellPrice ? Number(item.sellPrice) : null,
      },
      originalDataCopy: { 
        ...item,
        year: item.year ? Number(item.year) : null,
        buyPrice: item.buyPrice ? Number(item.buyPrice) : null,
        sellPrice: item.sellPrice ? Number(item.sellPrice) : null,
      } 
    }));
  } catch (e) {
    error.value = e;
    console.error("작품 정보를 불러오는데 실패했습니다:", e);
  } finally {
    loading.value = false;
  }
});

const startEditing = (artwork) => {
  artwork.originalDataCopy = { ...artwork }; 
  artwork.editedData = { ...artwork }; 
  artwork.isEditing = true;
};

const saveArtwork = (artwork) => {
  // 숫자 타입 필드는 저장 전에 숫자로 확실히 변환
  artwork.editedData.year = artwork.editedData.year ? Number(artwork.editedData.year) : null;
  artwork.editedData.buyPrice = artwork.editedData.buyPrice ? Number(artwork.editedData.buyPrice) : null;
  artwork.editedData.sellPrice = artwork.editedData.sellPrice ? Number(artwork.editedData.sellPrice) : null;

  Object.assign(artwork, artwork.editedData); 
  artwork.isEditing = false;
  console.log('작품 저장됨 (프론트엔드):', artwork);
  alert(`'${artwork.title}' 작품 정보가 프론트엔드에 저장되었습니다!`);
  artwork.originalDataCopy = { ...artwork };
};

const cancelEditing = (artwork) => {
  artwork.editedData = { ...artwork.originalDataCopy }; 
  artwork.isEditing = false;
  console.log('편집 취소됨:', artwork);
};

const deleteArtwork = (artwork) => {
  console.log('삭제 버튼 클릭! 작품 정보:', artwork);
  if (confirm(`정말로 '${artwork.title}' 작품을 삭제하시겠습니까?`)) {
    alert(`'${artwork.title}' 작품을 삭제합니다! (프론트엔드에서만 반영)`);
    artworks.value = artworks.value.filter(item => item.code !== artwork.code);
    // 삭제 시 검색어 필터링이 되어 있다면 검색 결과도 업데이트 되도록
    // (computed 속성이므로 artworks.value가 바뀌면 filteredArtworks도 자동으로 재계산됨)
  }
};

const downloadJson = () => {
  const dataToDownload = artworks.value.map(item => {
    const { isEditing, editedData, originalDataCopy, ...rest } = item;
    return rest; 
  });

  const jsonString = JSON.stringify(dataToDownload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'artworks_updated.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('수정된 작품 목록 JSON 파일이 다운로드됩니다!');
};

// 새 작품 추가 시작
const startAddingNew = () => {
  isAddingNew.value = true;
  const currentMaxNum = artworks.value.reduce((max, item) => {
    const match = String(item.code).match(/^YS(\d+)$/);
    return match ? Math.max(max, parseInt(match[1])) : max;
  }, 0);
  newArtwork.value = {
    code: `YS${currentMaxNum + 1}`, 
    title: '',
    artist: '',
    technique: '',
    size: '',
    year: null,
    buyPrice: null,
    sellPrice: null,
    stockDate: '',
    setName: '',
  };
};

// 새 작품 추가 (실제 로직)
const addNewArtwork = () => {
  if (!newArtwork.value.title || !newArtwork.value.artist || !newArtwork.value.code) {
    alert('코드, 제목, 작가는 필수 입력 사항입니다!');
    return;
  }
  
  if (artworks.value.some(item => item.code === newArtwork.value.code)) {
    alert(`코드 '${newArtwork.value.code}'는 이미 존재합니다. 다른 코드를 사용해 주세요.`);
    return;
  }

  const newArt = {
    code: newArtwork.value.code,
    title: newArtwork.value.title,
    artist: newArtwork.value.artist,
    technique: newArtwork.value.technique,
    size: newArtwork.value.size,
    year: newArtwork.value.year ? Number(newArtwork.value.year) : null,
    buyPrice: newArtwork.value.buyPrice ? Number(newArtwork.value.buyPrice) : null,
    sellPrice: newArtwork.value.sellPrice ? Number(newArtwork.value.sellPrice) : null,
    stockDate: newArtwork.value.stockDate,
    setName: newArtwork.value.setName,
    isEditing: false,
    editedData: { ...newArtwork.value },
    originalDataCopy: { ...newArtwork.value }
  };

  artworks.value.unshift(newArt); // 목록 상단에 추가 (역순 유지)
  currentPage.value = 1; // 새 항목이 추가되면 첫 페이지로 리셋하여 새로 추가된 항목이 보이도록

  isAddingNew.value = false;
  alert(`'${newArt.title}' 작품이 목록에 추가되었습니다! (코드: ${newArt.code})`);
  console.log('새 작품 추가됨:', newArt);
  newArtwork.value = { code: '', title: '', artist: '', technique: '', size: '', year: null, buyPrice: null, sellPrice: null, stockDate: '', setName: '' };
};

// 새 작품 추가 취소
const cancelAddingNew = () => {
  isAddingNew.value = false;
  newArtwork.value = { code: '', title: '', artist: '', technique: '', size: '', year: null, buyPrice: null, sellPrice: null, stockDate: '', setName: '' };
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.artwork-list-panel {
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
    div {
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
      input[type="text"], input[type="number"], textarea {
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

  .search-bar {
    margin-bottom: 20px;
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 1rem;
      box-sizing: border-box;
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
  
  .artwork-table-container {
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
    .artwork-poster-thumb {
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