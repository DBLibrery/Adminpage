<!-- src/components/ExhibitionList/ExhibitionTable.vue -->
<template>
  <div class="exhibition-table-container">
    <table>
      <thead>
        <tr>
          <!-- PC 버전에서만 보이는 헤더 -->
          <th v-if="!isMobile">ID</th> 
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
        </template>

        <!-- 모바일 버전 레이아웃 (카드형 + 이미지 왼쪽/내용 오른쪽) -->
        <template v-else>
          <tr v-for="exh in exhibitions" :key="exh.id">
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
                <!-- ID 숨김 지시 반영 -->
                <div class="card-item card-item--title">{{ exh.title }}</div>
                <div class="card-item card-item--date">{{ exh.date }}</div>
                <div class="card-item card-item--desc" v-if="exh.desc">{{ exh.desc }}</div>
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
  exhibitions: {
    type: Array,
    required: true
  }
});

const emits = defineEmits(['start-edit', 'save-exhibition', 'cancel-edit', 'delete-exhibition']);

const emitStartEditing = (exh) => { emits('start-edit', exh); };
const emitSaveExhibition = (exh) => { emits('save-exhibition', exh); };
const emitCancelEditing = (exh) => { emits('cancel-edit', exh); };
const emitDeleteExhibition = (exh) => { emits('delete-exhibition', exh); };

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

// ExhibitionTable.vue 고유의 PC 스타일 (_style.scss의 공통 스타일 외)
// 이는 PC 템플릿에만 적용됩니다.
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
// 모바일 스타일은 _style.scss에서 공통으로 관리됩니다.
</style>