<!-- src/components/ExhibitionList/ExhibitionTable.vue -->
<template>
  <div class="exhibition-table-container">
    <table>
      <thead>
        <tr>
          <th>포스터</th>
          <th>제목</th>
          <th>기간</th>
          <th>설명</th>
          <th v-if="!isMobile">관리</th> <!-- PC 버전에서만 보이는 관리 헤더 -->
        </tr>
      </thead>
      <tbody>
        <!-- PC 버전 레이아웃 -->
        <template v-if="!isMobile">
          <tr v-for="exh in exhibitions" :key="exh.title + exh.date + exh.desc">
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
              </template>
              <template v-else>
                <button class="save-button" @click="emitSaveExhibition(exh)">저장</button>
                <button class="cancel-button" @click="emitCancelEditing(exh)">취소</button>
              </template>
            </td>
          </tr>
        </template>

        <!-- 모바일 버전 레이아웃 (카드형 + 이미지 왼쪽/내용 오른쪽) -->
        <template v-else>
          <tr v-for="exh in exhibitions" :key="exh.title + exh.date + exh.desc">
            <td class="mobile-card-row">
              <!-- 이미지 컬럼 (좌측) - 이미지가 없으면 전체 숨기고 문구 표시 -->
              <div v-if="exh.image" class="poster-col">
                <img :src="exh.image" :alt="exh.title" class="exhibition-poster-thumb" />
              </div>
              <div v-else class="poster-col">
                <span class="no-image-text">이미지 없음</span>
              </div>
              
              <!-- 내용 컬럼 (우측) -->
              <div class="card-content-wrapper">
                <div class="card-item card-item--title">
                    <span>{{ exh.title }}</span> <!-- 모바일에서는 수정 불가하므로 input 제거 -->
                </div>
                <div class="card-item card-item--date">
                    <span>{{ exh.date }}</span> <!-- 모바일에서는 수정 불가하므로 input 제거 -->
                </div>
                <div class="card-item card-item--desc" v-if="exh.desc">
                    <span>{{ exh.desc }}</span> <!-- 모바일에서는 수정 불가하므로 textarea 제거 -->
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
  exhibitions: {
    type: Array,
    required: true
  }
});

const emits = defineEmits(['start-edit', 'save-exhibition', 'cancel-edit']);

const emitStartEditing = (exh) => { emits('start-edit', exh); };
const emitSaveExhibition = (exh) => { emits('save-exhibition', exh); };
const emitCancelEditing = (exh) => { emits('cancel-edit', exh); };

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