<!-- src/components/ExhibitionAddForm.vue -->
<template>
  <div class="add-new-form">
    <h4>새 전시 추가</h4>
    <div class="form-row">
      <label>ID</label>
      <!-- initialId props를 통해 받은 ID를 disabled로 표시 -->
      <input type="number" v-model="newExhibition.id" placeholder="예: 123 (자동 생성)" disabled />
    </div>
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
    <div class="form-row">
      <label>이미지 URL</label>
      <input type="text" v-model="newExhibition.image" placeholder="포스터 이미지 URL (예: https://...)" />
    </div>
    <div class="form-actions">
      <button class="save-button" @click="addExhibition">추가</button>
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
// 'add-exhibition': 새 전시 데이터와 함께 전송
// 'cancel': 폼 취소 시 전송
const emits = defineEmits(['add-exhibition', 'cancel']);

// 새 전시 데이터를 위한 반응형 객체
const newExhibition = ref({
  id: null, // initialId props를 통해 초기화됨
  title: '',
  date: '',
  desc: '영선갤러리',
  image: '',
});

// initialId props가 변경될 때마다 newExhibition.id를 업데이트
// { immediate: true }를 사용하여 컴포넌트 마운트 시 즉시 실행되도록 합니다.
watch(() => props.initialId, (newInitialId) => {
  newExhibition.value.id = newInitialId;
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
const addExhibition = () => {
  // 필수 필드 유효성 검사
  if (!newExhibition.value.title || !newExhibition.value.date) {
    alert('제목과 기간은 필수 입력 사항입니다!');
    return;
  }

  // 새 전시 이미지 URL 정규화
  newExhibition.value.image = ensureRawTrue(newExhibition.value.image);
  
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

// 폼 데이터를 초기 상태로 리셋하는 함수
const resetForm = () => {
  newExhibition.value = { 
    id: props.initialId, 
    title: '', date: '', desc: '영선갤러리', image: '' 
  };
};
</script>

<style lang="scss" scoped>
// 이 컴포넌트만의 스타일, 또는 _style.scss에 정의된 공용 스타일을 사용합니다.
// 'var' 네임스페이스를 사용합니다.
// ArtworkListPanel.vue, ExhibitionListPanel.vue, LectureListPanel.vue 등 Panel 파일들은
// @use '@/assets/styles/_style.scss' as var; 이 라인만 있으면 됩니다.
// SidebarMenu.vue, ManagedHomepages.vue 도 이 라인만 있으면 됩니다.
// (여기까지는 스타일을 직접 이 파일에 넣는 것이 아니라, _style.scss에서 가져오는 것임)
@use '@/assets/styles/_style.scss' as var;
</style>