<!-- src/components/ArtworkTable.vue -->
<template>
  <!-- `artwork-table-container` 클래스는 _style.scss에 정의된 공용 스타일을 사용합니다. -->
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
        <!-- 'artworks' props로 받은 작품 목록을 순회하며 테이블 행을 생성합니다. -->
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
              <button class="edit-button" @click="emitStartEditing(artwork)">수정</button>
              <button class="delete-button" @click="emitDeleteArtwork(artwork)">삭제</button>
            </template>
            <template v-else>
              <button class="save-button" @click="emitSaveArtwork(artwork)">저장</button>
              <button class="cancel-button" @click="emitCancelEditing(artwork)">취소</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 부모 컴포넌트로부터 필요한 데이터 (작품 목록, 이미지 기본 URL)를 받습니다.
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

// 부모 컴포넌트로 이벤트를 보냅니다.
// 'start-edit', 'save-artwork', 'cancel-edit', 'delete-artwork' 액션에 해당 작품 데이터를 함께 보냅니다.
const emits = defineEmits(['start-edit', 'save-artwork', 'cancel-edit', 'delete-artwork']);

// 작품 코드를 바탕으로 이미지 URL을 생성하는 헬퍼 함수
const generateArtworkImageUrl = (code) => {
  if (!code) return null; 
  return `${props.imgBaseUrl}${code}.png?raw=true`; 
};

// 각 액션 버튼 클릭 시 부모 컴포넌트에 이벤트를 발생시키는 함수들
const emitStartEditing = (artwork) => {
  emits('start-edit', artwork);
};

const emitSaveArtwork = (artwork) => {
  emits('save-artwork', artwork);
};

const emitCancelEditing = (artwork) => {
  emits('cancel-edit', artwork);
};

const emitDeleteArtwork = (artwork) => {
  emits('delete-artwork', artwork);
};
</script>

<style lang="scss" scoped>
// _style.scss에서 공용 스타일을 가져와서 사용합니다.
// scoped 키워드 덕분에 이 컴포넌트 안에서만 스타일이 유효합니다.
@import '@/assets/styles/_style.scss';

// 만약 ArtworkTable.vue 에만 필요한 특별한 스타일이 있다면 여기에 추가할 수 있습니다.
// 현재는 대부분 _style.scss의 공용 스타일로 충분합니다.
</style>