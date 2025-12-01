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

.exhibition-table-container {
  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      border: 1px solid var.$table-border-color;
      padding: 8px;
      text-align: left;
      vertical-align: middle;
      max-width: 200px; // 내용이 너무 길어지는 것을 방지
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; // 줄바꿈 방지
    }
    
    // ⭐️⭐️⭐️ 포스터 이미지 컬럼에만 nowrap 해제 및 이미지 크기 조절을 위해 ⭐️⭐️⭐️
    td:nth-child(7) { // 7번째 컬럼 (포스터 이미지)
      white-space: normal; // 줄바꿈 허용
      width: 100px; // 고정 너비 (필요시 조절)
    }

    th {
      background-color: var.$table-header-bg;
      color: var.$table-header-color;
    }

    .action-buttons button {
      margin-right: 5px;
      padding: 5px 10px;
      cursor: pointer;
    }

    .exhibition-poster-thumbnail {
      max-width: 80px;  // 썸네일 최대 너비
      max-height: 80px; // 썸네일 최대 높이
      display: block;
      margin: 0 auto;
      object-fit: contain;
    }
  }
}
</style>