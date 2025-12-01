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
          <th>포스터 이미지 URL</th>
          <th>포스터 이미지 미리보기</th>
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
            <!-- ⭐️⭐️⭐️ JSON에 저장된 이미지의 전체 URL (exhibition.image)을 그대로 표시/편집합니다. ⭐️⭐️⭐️ -->
            <span v-if="!exhibition.isEditing">{{ exhibition.image || '없음' }}</span>
            <input v-else v-model="exhibition.editedData.image" type="text" placeholder="이미지 전체 URL (예: https://.../image.png)" />
          </td>
          <td>
            <!-- ⭐️⭐️⭐️ exhibition.image 필드를 사용하여 미리보기를 표시합니다. ⭐️⭐️⭐️ -->
            <div v-if="exhibition.image">
              <a :href="exhibition.image" target="_blank" rel="noopener noreferrer">
                <img :src="exhibition.image" alt="전시 포스터" class="exhibition-poster-thumbnail" />
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
// ⭐️⭐️⭐️ 이전 답변에서 삭제했었던 useExhibitionData 임포트와 관련 로직이 다시 들어갔다면 삭제해 주세요. ⭐️⭐️⭐️
// import { useExhibitionData } from '@/composables/useExhibitionData'; // <-- 이 줄은 없어야 합니다.

const props = defineProps({
  exhibitions: Array,
});

const emit = defineEmits(['start-edit', 'save-exhibition', 'cancel-edit', 'delete-exhibition']);

// ⭐️⭐️⭐️ getDisplayImageUrl 함수도 이제 필요 없습니다. ⭐️⭐️⭐️
// const { IMG_EXHIBITION_DISPLAY_BASE_URL } = useExhibitionData(); // <-- 이 줄도 없어야 합니다.
// const getDisplayImageUrl = (jsonImageUrl) => { /* ... */ };      // <-- 이 함수도 없어야 합니다.
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
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    td:nth-child(6), td:nth-child(7) { 
      white-space: normal;
    }
    td:nth-child(7) { 
      width: 100px; 
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
      max-width: 80px;
      max-height: 80px;
      display: block;
      margin: 0 auto;
      object-fit: contain;
    }
  }
}
</style>