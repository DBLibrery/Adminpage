<!-- src/components/LectureList/LectureTable.vue -->
<template>
  <div class="lecture-table-container">
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
        <!-- 'lectures' props로 받은 특강 목록을 순회하며 테이블 행을 생성합니다. -->
        <tr v-for="lec in lectures" :key="lec.id">
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
              <button class="edit-button" @click="emitStartEditing(lec)">수정</button>
              <button class="delete-button" @click="emitDeleteLecture(lec)">삭제</button>
            </template>
            <template v-else>
              <button class="save-button" @click="emitSaveLecture(lec)">저장</button>
              <button class="cancel-button" @click="emitCancelEditing(lec)">취소</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// 부모 컴포넌트로부터 필요한 데이터 (특강 목록)를 받습니다.
const props = defineProps({
  lectures: {
    type: Array,
    required: true
  }
});

// 부모 컴포넌트로 이벤트를 보냅니다.
// 'start-edit', 'save-lecture', 'cancel-edit', 'delete-lecture' 액션에 해당 특강 데이터를 함께 보냅니다.
const emits = defineEmits(['start-edit', 'save-lecture', 'cancel-edit', 'delete-lecture']);

// 각 액션 버튼 클릭 시 부모 컴포넌트에 이벤트를 발생시키는 함수들
const emitStartEditing = (lec) => {
  emits('start-edit', lec);
};

const emitSaveLecture = (lec) => {
  emits('save-lecture', lec);
};

const emitCancelEditing = (lec) => {
  emits('cancel-edit', lec);
};

const emitDeleteLecture = (lec) => {
  emits('delete-lecture', lec);
};
</script>

<style lang="scss" scoped>
// _style.scss에서 공용 스타일을 가져와서 사용합니다.
// scoped 키워드 덕분에 이 컴포넌트 안에서만 스타일이 유효합니다.
@import '@/assets/styles/_style.scss';

// LectureTable.vue 에만 필요한 스타일 (예: .lecture-poster-thumb)
.lecture-poster-thumb {
    max-width: 80px;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
}
</style>