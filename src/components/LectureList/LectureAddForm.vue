<!-- src/components/LectureList/LectureAddForm.vue -->
<template>
  <div class="add-new-form">
    <h4>새 특강 추가</h4>
    <div class="form-row">
      <label>ID</label>
      <!-- initialId props를 통해 받은 ID를 disabled로 표시 -->
      <input type="number" v-model="newLecture.id" placeholder="예: 123 (자동 생성)" disabled />
    </div>
    <div class="form-row">
      <label>제목</label>
      <input type="text" v-model="newLecture.title" placeholder="특강 제목" />
    </div>
    <div class="form-row">
      <label>강사 (SLI)</label>
      <input type="text" v-model="newLecture.SLI" placeholder="예: 김정환 작가" />
    </div>
    <div class="form-row">
      <label>일시</label>
      <input type="text" v-model="newLecture.date" placeholder="예: 2025.03.10." />
    </div>
    <div class="form-row">
      <label>이미지 URL</label>
      <input type="text" v-model="newLecture.image" placeholder="포스터 이미지 URL (선택 사항)" />
    </div>
    <div class="form-actions">
      <button class="save-button" @click="addLecture">추가</button>
      <button class="cancel-button" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// 부모 컴포넌트로부터 초기 ID를 props로 받습니다.
const props = defineProps({
  initialId: {
    type: Number,
    default: null
  }
});

// 부모 컴포넌트로 이벤트를 보냅니다.
// 'add-lecture': 새 특강 데이터와 함께 전송
// 'cancel': 폼 취소 시 전송
const emits = defineEmits(['add-lecture', 'cancel']);

// 새 특강 데이터를 위한 반응형 객체
const newLecture = ref({
  id: null, // initialId props를 통해 초기화됨
  title: '',
  SLI: '',
  date: '',
  image: '',
});

// initialId props가 변경될 때마다 newLecture.id를 업데이트
// { immediate: true }를 사용하여 컴포넌트 마운트 시 즉시 실행되도록 합니다.
watch(() => props.initialId, (newInitialId) => {
  newLecture.value.id = newInitialId;
}, { immediate: true });

// 이미지 URL에 ?raw=true가 붙도록 정규화하는 헬퍼 함수
const ensureRawTrue = (imageUrl) => {
  if (!imageUrl) return ''; 
  if (imageUrl.includes('?raw=')) { 
    return imageUrl;
  }
  if (imageUrl.includes('github.com') && imageUrl.includes('blob')) {
    return imageUrl + '?raw=true';
  }
  return imageUrl; 
};

// '추가' 버튼 클릭 시 실행
const addLecture = () => {
  // 필수 필드 유효성 검사
  if (!newLecture.value.title || !newLecture.value.SLI || !newLecture.value.date) {
    alert('제목, 강사, 일시는 필수 입력 사항입니다!');
    return;
  }

  // 새 특강 이미지 URL 정규화
  newLecture.value.image = ensureRawTrue(newLecture.value.image);
  
  const lectureToAdd = {
    ...newLecture.value
  };
  
  emits('add-lecture', lectureToAdd); // 부모 컴포넌트에 새 특강 데이터 전송
  resetForm(); // 폼 초기화
};

// '취소' 버튼 클릭 시 실행
const cancel = () => {
  resetForm(); // 폼 초기화
  emits('cancel'); // 부모 컴포넌트에 취소 이벤트 전송
};

// 폼 데이터를 초기 상태로 리셋하는 함수
const resetForm = () => {
  newLecture.value = { 
    id: props.initialId, 
    title: '', SLI: '', date: '', image: '' 
  };
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_style.scss';
</style>