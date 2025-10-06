<!-- src/components/ExhibitionAddForm.vue -->
<template>
  <div class="add-new-form">
    <h4>새 전시</h4>
    <!-- ID 입력 필드 제거 유지 -->
    <div class="form-row">
      <label>제목</label>
      <input type="text" v-model="newExhibition.title" placeholder="전시 제목" />
    </div>
    <div class="form-row">
      <label>기간</label>
      <input type="text" v-model="newExhibition.date" placeholder="예: 2025.07.01. ~ 2025.09.30." />
    </div>
    <div class="form-row">
      <label>설명</label>
      <textarea v-model="newExhibition.desc" placeholder="영선갤러리"></textarea>
    </div>
    <!-- ✨ '포스터 파일명' 입력 필드를 다시 추가했습니다! ✨ -->
    <div class="form-row">
      <label>포스터 파일명</label>
      <input type="text" v-model="newExhibition.imageFile" placeholder="예: exh_main_2025_11_01" />
    </div>
    
    <div class="form-actions">
      <button class="save-button" @click="addExhibition">추가</button>
      <button class="cancel-button" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; 

const emits = defineEmits(['add-exhibition', 'cancel']);

// 새 전시 데이터를 위한 반응형 객체 (imageFile 속성 다시 추가)
const newExhibition = ref({
  title: '',
  date: '',
  desc: '영선갤러리',
  imageFile: '', // ✨ imageFile 속성을 다시 추가합니다 ✨
});

// '추가' 버튼 클릭 시 실행
const addExhibition = () => {
  // 필수 필드 유효성 검사 (imageFile은 필수가 아니므로 포함하지 않음)
  if (!newExhibition.value.title || !newExhibition.value.date) {
    alert('제목과 기간은 필수 입력 사항입니다!');
    return;
  }
  
  const exhibitionToAdd = {
    ...newExhibition.value
  };
  
  emits('add-exhibition', exhibitionToAdd); // 부모 컴포넌트에 새 전시 데이터 전송
  resetForm(); // 폼 초기화
};

// '취소' 버튼 클릭 시 실행
const cancel = () => {
  resetForm(); // 폼 초기화
  emits('cancel'); // 부모 컴포넌트에 취소 이벤트 전송
};

// 폼 데이터를 초기 상태로 리셋하는 함수 (imageFile 속성 초기화 추가)
const resetForm = () => {
  newExhibition.value = { 
    title: '', date: '', desc: '영선갤러리', 
    imageFile: '' // ✨ imageFile 초기화 추가 ✨
  };
};
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_style.scss' as var;
</style>