<!-- src/components/ExhibitionTable.vue -->
<template>
  <div class="exhibition-table-container">
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
        <!-- 'exhibitions' props로 받은 전시 목록을 순회하며 테이블 행을 생성합니다. -->
        <tr v-for="exh in exhibitions" :key="exh.id">
          <td>{{ exh.id }}</td>
          <td class="poster-col">
            <img v-if="exh.image" :src="exh.image" :alt="exh.title" class="exhibition-poster-thumb" />
            <span v-else class="no-image-text">이미지 없음</span>
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
              <button class="edit-button" @click="emitStartEditing(exh)">수정</button>
              <button class="delete-button" @click="emitDeleteExhibition(exh)">삭제</button>
            </template>
            <template v-else>
              <button class="save-button" @click="emitSaveExhibition(exh)">저장</button>
              <button class="cancel-button" @click="emitCancelEditing(exh)">취소</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 부모 컴포넌트로부터 필요한 데이터 (전시 목록)를 받습니다.
const props = defineProps({
  exhibitions: {
    type: Array,
    required: true
  }
});

// 부모 컴포넌트로 이벤트를 보냅니다.
// 'start-edit', 'save-exhibition', 'cancel-edit', 'delete-exhibition' 액션에 해당 전시 데이터를 함께 보냅니다.
const emits = defineEmits(['start-edit', 'save-exhibition', 'cancel-edit', 'delete-exhibition']);

// 각 액션 버튼 클릭 시 부모 컴포넌트에 이벤트를 발생시키는 함수들
const emitStartEditing = (exh) => {
  emits('start-edit', exh);
};

const emitSaveExhibition = (exh) => {
  emits('save-exhibition', exh);
};

const emitCancelEditing = (exh) => {
  emits('cancel-edit', exh);
};

const emitDeleteExhibition = (exh) => {
  emits('delete-exhibition', exh);
};
</script>

<style lang="scss" scoped>
// _style.scss에서 공용 스타일을 가져와서 사용합니다.
// scoped 키워드 덕분에 이 컴포넌트 안에서만 스타일이 유효합니다.
@import '@/assets/styles/_style.scss';

// ExhibitionTable.vue 에만 필요한 스타일 (예: .exhibition-poster-thumb, .desc-col)
// 이들은 _style.scss 의 공통 테이블 스타일에는 포함되어 있지 않거나,
// 이곳에서 오버라이드 되어야 하는 경우에만 추가합니다.
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
</style>