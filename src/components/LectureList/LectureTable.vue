<!-- src/components/LectureList/LectureTable.vue -->
<template>
  <div class="lecture-table-container">
    <table>
      <thead>
        <tr>
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
          <tr v-for="lec in lectures" :key="lec.title + lec.SLI + lec.date">
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
          <tr v-for="lec in lectures" :key="lec.title + lec.SLI + lec.date">
            <td class="mobile-card-row">
              <div v-if="lec.image" class="poster-col">
                <img :src="lec.image" :alt="lec.title" class="lecture-poster-thumb" />
              </div>
              
              <div class="card-content-wrapper">
                <div class="card-item card-item--title">
                    <span>{{ lec.title }}</span> <!-- 모바일에서는 수정 불가하므로 input 제거 -->
                </div>
                <div class="card-item card-item--sli">
                    <span>{{ lec.SLI }}</span> <!-- 모바일에서는 수정 불가하므로 input 제거 -->
                </div>
                <div class="card-item card-item--date">
                    <span>{{ lec.date }}</span> <!-- 모바일에서는 수정 불가하므로 input 제거 -->
                </div>
                <!-- ✨ 모바일에서는 관리 버튼 자체를 완전히 제거했습니다 ✨ -->
                <!-- <div class="card-actions">
                  ... 버튼들 ...
                </div> -->
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

const props = defineProps({
  lectures: {
    type: Array,
    required: true
  }
});

const emits = defineEmits(['start-edit', 'save-lecture', 'cancel-edit']);

const emitStartEditing = (lec) => { emits('start-edit', lec); };
const emitSaveLecture = (lec) => { emits('save-lecture', lec); };
const emitCancelEditing = (lec) => { emits('cancel-edit', lec); };

const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768; // 768px을 기준으로 모바일 판단
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_style.scss' as var;

// LectureTable.vue 컴포넌트 내에서만 사용되는 고유 스타일
.lecture-poster-thumb {
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

// 모바일 카드 내부의 고유한 텍스트 스타일
.card-item--title { font-weight: bold; color: #333; }
.card-item--sli { color: #555; }
.card-item--date { color: #666; font-size: 0.85em; }

// 이 외의 모든 공용/반복 스타일은 _style.scss에서 관리됩니다.
</style>