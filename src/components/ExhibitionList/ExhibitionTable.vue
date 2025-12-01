<template>
  <div class="exhibition-table-container">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>이름</th>
          <th>기간</th>
          <th>장소</th>
          <th>설명</th>
          <th>포스터 파일명</th> <!-- 컬럼명 변경 -->
          <th>포스터 이미지</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="exhibition in exhibitions" :key="exhibition.id">
          <td>{{ exhibition.id }}</td>
          <td>
            <span v-if="!exhibition.isEditing">{{ exhibition.name }}</span>
            <input v-else v-model="exhibition.editedData.name" type="text" />
          </td>
          <td>
            <span v-if="!exhibition.isEditing">{{ exhibition.period }}</span>
            <input v-else v-model="exhibition.editedData.period" type="text" />
          </td>
          <td>
            <span v-if="!exhibition.isEditing">{{ exhibition.place }}</span>
            <input v-else v-model="exhibition.editedData.place" type="text" />
          </td>
          <td>
            <span v-if="!exhibition.isEditing">{{ exhibition.description }}</span>
            <input v-else v-model="exhibition.editedData.description" type="text" />
          </td>
          <td>
            <!-- ⭐️⭐️⭐️ 파일명만 표시하거나 편집하는 인풋 ⭐️⭐️⭐️ -->
            <span v-if="!exhibition.isEditing">{{ exhibition.image ? exhibition.image.split('/').pop() : '없음' }}</span>
            <input v-else v-model="exhibition.editedData.image" type="text" placeholder="파일명 (예: poster.jpg)" />
          </td>
          <td>
            <!-- ⭐️⭐️⭐️ 실제 이미지 표시용 URL과 링크 사용 ⭐️⭐️⭐️ -->
            <div v-if="exhibition.image">
              <a :href="exhibition.image" target="_blank" rel="noopener noreferrer">
                <!-- ⭐️⭐️⭐️ 실제 이미지 로드 시에는 DISPLAY_BASE_URL + 파일명 ⭐️⭐️⭐️ -->
                <img :src="getDisplayImageUrl(exhibition.image)" alt="전시 포스터" class="exhibition-poster-thumbnail" />
              </a>
            </div>
            <span v-else>이미지 없음</span>
          </td>
          <td class="action-buttons">
            <button v-if="!exhibition.isEditing" @click="emit('start-edit', exhibition)">수정</button>
            <button v-else @click="emit('save-exhibition', exhibition)">저장</button>
            <button v-if="exhibition.isEditing" @click="emit('cancel-edit', exhibition)">취소</button>
            <button @click="emit('delete-exhibition', exhibition)">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useExhibitionData } from '@/composables/useExhibitionData'; // ⭐️⭐️⭐️ useExhibitionData 임포트 ⭐️⭐️⭐️

const props = defineProps({
  exhibitions: Array,
});

const emit = defineEmits(['start-edit', 'save-exhibition', 'cancel-edit', 'delete-exhibition']);

// ⭐️⭐️⭐️ 이미지 표시 URL을 생성하는 함수 추가 ⭐️⭐️⭐️
const { IMG_EXHIBITION_DISPLAY_BASE_URL } = useExhibitionData(); // 컴포저블에서 DISPLAY URL 가져오기

const getDisplayImageUrl = (jsonImageUrl) => {
  if (!jsonImageUrl) return '';
  const filename = jsonImageUrl.split('/').pop(); // JSON 저장 URL에서 파일명만 추출
  return IMG_EXHIBITION_DISPLAY_BASE_URL + filename; // DISPLAY URL에 파일명 붙여 반환
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_style.scss' as var;

// ExhibitionTable.vue 고유의 스타일만 여기에 유지
.exhibition-poster-thumb {
    max-width: 80px; /* PC 테이블에서의 특정 포스터 너비 */
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
}
.no-image-text {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #888;
  font-size: 0.8em;
  height: 80px; /* 썸네일과 동일 높이 */
  border: 1px dashed #ccc;
  border-radius: 4px;
}

.desc-col {
    max-width: 250px;
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
}

// 모바일 카드 내부의 고유한 텍스트 스타일
.card-item--title { font-weight: bold; color: #333; }
.card-item--date { color: #555; }
.card-item--desc { color: #666; font-size: 0.85em; }

// 이 외의 모든 공용/반복 스타일은 _style.scss에서 관리됩니다.
</style>