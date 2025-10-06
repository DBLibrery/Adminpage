<!-- src/components/LectureList/LectureAddForm.vue -->
<template>
  <div class="add-new-form">
    <h4>새 특강</h4>
    <!-- ID 입력 필드 제거 유지 -->
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
    <!-- ✨ '이미지 URL' 대신 '포스터 파일명' 입력 필드를 추가합니다! ✨ -->
    <div class="form-row">
      <label>포스터 파일명</label>
      <input type="text" v-model="newLecture.imageFile" placeholder="예: spc_2025_11_08" />
    </div>
    
    <div class="form-actions">
      <button class="save-button" @click="addLecture">추가</button>
      <button class="cancel-button" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; 

const emits = defineEmits(['add-lecture', 'cancel']);

// 새 특강 데이터를 위한 반응형 객체 (imageFile 속성 사용)
const newLecture = ref({
  title: '',
  SLI: '',
  date: '',
  imageFile: '', // ✨ imageFile 속성 추가 ✨
});

// '추가' 버튼 클릭 시 실행
const addLecture = () => {
  if (!newLecture.value.title || !newLecture.value.SLI || !newLecture.value.date) {
    alert('제목, 강사, 일시는 필수 입력 사항입니다!');
    return;
  }
  
  const lectureToAdd = {
    ...newLecture.value
  };
  
  emits('add-lecture', lectureToAdd); 
  resetForm(); 
};

// '취소' 버튼 클릭 시 실행
const cancel = () => {
  resetForm(); 
  emits('cancel'); 
};

// 폼 데이터를 초기 상태로 리셋하는 함수
const resetForm = () => {
  newLecture.value = { 
    title: '', SLI: '', date: '', 
    imageFile: '' // ✨ imageFile 초기화 ✨
  };
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_style.scss' as var;
</style>