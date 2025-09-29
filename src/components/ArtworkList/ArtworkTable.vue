<!-- src/components/ArtworkList/ArtworkTable.vue -->
<template>
  <div class="artwork-table-container">
    <table>
      <thead>
        <tr>
          <th>코드</th>
          <th>작품</th> 
          <th>제목</th>
          <th>작가</th>
          <th>기법</th>
          <th>규격</th>
          <th>연도</th>
          <th>구입가</th>
          <th>판매가</th>
          <th>입고일</th>
          <th>세트명</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <!-- PC 버전 레이아웃 (테이블 구조 유지) -->
        <template v-if="!isMobile">
          <tr v-for="artwork in artworks" :key="artwork.code">
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
            <!-- ✨ 구입가 표시 부분 수정 (PC 버전) ✨ -->
            <td>
              <span v-if="!artwork.isEditing">{{ formatNumber(artwork.buyPrice) }}</span>
              <input v-else v-model.number="artwork.editedData.buyPrice" type="number" class="edit-input" />
            </td>
            <!-- ✨ 판매가 표시 부분 수정 (PC 버전) ✨ -->
            <td>
              <span v-if="!artwork.isEditing">{{ formatNumber(artwork.sellPrice) }}</span>
              <input v-else v-model.number="artwork.editedData.sellPrice" type="number" class="edit-input" />
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
                <button class="edit-button" @click="emitStartEditing(artwork)">수정</button>
                <button class="delete-button" @click="emitDeleteArtwork(artwork)">삭제</button>
              </template>
              <template v-else>
                <button class="save-button" @click="emitSaveArtwork(artwork)">저장</button>
                <button class="cancel-button" @click="emitCancelEditing(artwork)">취소</button>
              </template>
            </td>
          </tr>
        </template>
        <!-- 모바일 버전 레이아웃 (카드형 구조) -->
        <template v-else>
          <tr v-for="artwork in artworks" :key="artwork.code">
            <!-- 이미지 왼쪽, 내용 오른쪽 배치 -->
            <td class="mobile-card-row">
              <div class="poster-col">
                <img 
                  v-if="generateArtworkImageUrl(artwork.code)"
                  :src="generateArtworkImageUrl(artwork.code)" 
                  :alt="artwork.title" 
                  class="artwork-poster-thumb" 
                />
                <span v-else class="no-image-text">이미지 없음</span>
              </div>
              <div class="card-content-wrapper">
                <div class="card-item card-item--code">{{ artwork.code }}</div>
                <div class="card-item card-item--title">{{ artwork.title }}</div>
                <div class="card-item card-item--artist">{{ artwork.artist }}</div>
                <div class="card-item" v-if="artwork.technique">{{ artwork.technique }}</div>
                <div class="card-item" v-if="artwork.size">{{ artwork.size }}</div>
                <div class="card-item" v-if="artwork.year">{{ artwork.year }}</div>
                <!-- ✨ 모바일 버전에서는 구입가/판매가를 표시하지 않으므로 수정 불필요 ✨ -->
                <!-- 공백 내용은 v-if로 렌더링 자체를 방지 -->
                <!-- 구입가, 판매가, 입고일은 이미 Hidden -->
                <div class="card-item" v-if="artwork.setName">{{ artwork.setName }}</div>

                <!-- 모바일에서 관리 버튼이 필요하다면 여기에 추가 (현재는 숨김) -->
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // onMounted, onUnmounted 추가
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  artworks: {
    type: Array,
    required: true
  },
  imgBaseUrl: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['start-edit', 'save-artwork', 'cancel-edit', 'delete-artwork']);

// ✨ 숫자를 세 자리 쉼표로 포맷하는 헬퍼 함수 추가 ✨
const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return ''; // 값이 없으면 빈 문자열 반환
  }
  // 숫자가 아니면 그대로 반환 (예외 처리)
  if (typeof value !== 'number' && typeof value !== 'string') {
    return value;
  }
  // 문자열일 경우 숫자로 변환 시도
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return value; // 숫자로 변환 실패 시 원본 값 반환
  }
  return numValue.toLocaleString('ko-KR'); // 한국식으로 쉼표 추가
};

const generateArtworkImageUrl = (code) => {
  if (!code) return null; 
  return `${props.imgBaseUrl}${code}.png?raw=true`; 
};

const emitStartEditing = (artwork) => { emits('start-edit', artwork); };
const emitSaveArtwork = (artwork) => { emits('save-artwork', artwork); };
const emitCancelEditing = (artwork) => { emits('cancel-edit', artwork); };
const emitDeleteArtwork = (artwork) => { emits('delete-artwork', artwork); };

// 모바일 여부를 판단하는 반응형 상태
const isMobile = ref(false);

// 화면 너비를 체크하여 isMobile 상태를 업데이트하는 함수
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768; // 768px을 기준으로 모바일 판단
};

// 컴포넌트 마운트 시, 초기 체크 및 resize 이벤트 리스너 추가
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

// 컴포넌트 언마운트 시, resize 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style lang="scss" scoped>
// _style.scss에서 공용 스타일을 가져와서 사용합니다.
@use '@/assets/styles/_style.scss' as var;
</style>