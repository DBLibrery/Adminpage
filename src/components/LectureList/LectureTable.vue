<!-- src/components/LectureList/LectureTable.vue -->
<template>
  <div class="lecture-table-container">
    <table>
      <thead>
        <tr>
          <!-- PC 버전에서만 보이는 헤더 -->
          <th v-if="!isMobile">ID</th>
          <th>포스터</th>
          <th>제목</th>
          <th>강사</th>
          <th>일시</th>
          <th v-if="!isMobile">관리</th> <!-- PC 버전에서만 보이는 관리 헤더 -->
        </tr>
      </thead>
      <tbody>
        <!-- PC 버전 레이아웃 -->
        <template v-if="!isMobile">
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
        </template>

        <!-- 모바일 버전 레이아웃 (카드형 + 이미지 왼쪽/내용 오른쪽) -->
        <template v-else>
          <tr v-for="lec in lectures" :key="lec.id">
            <td class="mobile-card-row">
              <!-- <<<<<<< 여기가 수정됩니다! 이미지가 있을 때만 poster-col 렌더링! >>>>>>> -->
              <div v-if="lec.image" class="poster-col">
                <img :src="lec.image" :alt="lec.title" class="lecture-poster-thumb" />
              </div>
              <!-- <<<<<<< '이미지 없음' 문구는 렌더링하지 않음! >>>>>>> -->
              
              <!-- 내용 컬럼 (우측) -->
              <div class="card-content-wrapper">
                <!-- ID 숨김 지시 반영 -->
                <div class="card-item card-item--title">{{ lec.title }}</div>
                <div class="card-item card-item--sli">{{ lec.SLI }}</div>
                <div class="card-item card-item--date">{{ lec.date }}</div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; 
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  lectures: {
    type: Array,
    required: true
  }
});

const emits = defineEmits(['start-edit', 'save-lecture', 'cancel-edit', 'delete-lecture']);

const emitStartEditing = (lec) => { emits('start-edit', lec); };
const emitSaveLecture = (lec) => { emits('save-lecture', lec); };
const emitCancelEditing = (lec) => { emits('cancel-edit', lec); };
const emitDeleteLecture = (lec) => { emits('delete-lecture', lec); };

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
@use '@/assets/styles/_style.scss' as var;

// LectureTable.vue 고유의 PC 스타일 (_style.scss의 공통 스타일 외)
// 이는 PC 템플릿에만 적용됩니다.
.lecture-poster-thumb {
    max-width: 80px;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 4px;
}
// 모바일 스타일은 _style.scss에서 공통으로 관리됩니다.
</style>