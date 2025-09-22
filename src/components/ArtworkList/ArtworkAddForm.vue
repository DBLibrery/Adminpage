<!-- src/components/ArtworkAddForm.vue -->
<template>
  <!-- `add-new-form` 클래스는 _style.scss에 정의된 공용 스타일을 사용합니다. -->
  <div class="add-new-form">
    <h4>새 작품 추가</h4>
    <div class="form-row">
      <label>코드</label>
      <!-- initialCode props를 통해 받은 코드를 disabled로 표시 -->
      <input type="text" v-model="newArtwork.code" placeholder="예: YS123 (자동 생성)" disabled />
    </div>
    <div class="form-row">
      <label>제목</label>
      <input type="text" v-model="newArtwork.title" placeholder="작품 제목" />
    </div>
    <div class="form-row">
      <label>작가</label>
      <input type="text" v-model="newArtwork.artist" placeholder="작가 이름" />
    </div>
    <div class="form-row">
      <label>기법</label>
      <input type="text" v-model="newArtwork.technique" placeholder="예: 캔버스에 유채" />
    </div>
    <div class="form-row">
      <label>규격</label>
      <input type="text" v-model="newArtwork.size" placeholder="예: 61 X 50.5cm" />
    </div>
    <div class="form-row">
      <label>연도</label>
      <input type="number" v-model="newArtwork.year" placeholder="예: 2022" />
    </div>
    <div class="form-row">
      <label>구입가</label>
      <input type="number" v-model="newArtwork.buyPrice" placeholder="구입 가격 (숫자)" />
    </div>
    <div class="form-row">
      <label>판매가</label>
      <input type="number" v-model="newArtwork.sellPrice" placeholder="판매 가격 (숫자)" />
    </div>
    <div class="form-row">
      <label>입고일</label>
      <input type="text" v-model="newArtwork.stockDate" placeholder="예: 2024-01-15" />
    </div>
    <div class="form-row">
      <label>세트명</label>
      <input type="text" v-model="newArtwork.setName" placeholder="세트명 (선택 사항)" />
    </div>

    <div class="form-actions">
      <!-- 'save-button', 'cancel-button' 클래스 또한 _style.scss에 정의되어 있습니다. -->
      <button class="save-button" @click="addArtwork">추가</button>
      <button class="cancel-button" @click="cancel">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// 부모 컴포넌트로부터 초기 코드 (예: YS123)를 받습니다.
const props = defineProps({
  initialCode: {
    type: String,
    default: ''
  }
});

// 부모 컴포넌트로 이벤트를 보냅니다.
// 'add-artwork': 새 작품 데이터와 함께 전송
// 'cancel': 폼 취소 시 전송
const emits = defineEmits(['add-artwork', 'cancel']);

// 새 작품 데이터를 위한 반응형 객체
const newArtwork = ref({
  code: '', // initialCode props를 통해 초기화됨
  title: '',
  artist: '',
  technique: '',
  size: '',
  year: null,
  buyPrice: null,
  sellPrice: null,
  stockDate: '',
  setName: '',
});

// initialCode props가 변경될 때마다 newArtwork.code를 업데이트
// { immediate: true }를 사용하여 컴포넌트 마운트 시 즉시 실행되도록 합니다.
watch(() => props.initialCode, (newInitialCode) => {
  newArtwork.value.code = newInitialCode;
}, { immediate: true });

// '추가' 버튼 클릭 시 실행
const addArtwork = () => {
  // 필수 필드 유효성 검사
  if (!newArtwork.value.title || !newArtwork.value.artist || !newArtwork.value.code) {
    alert('코드, 제목, 작가는 필수 입력 사항입니다!');
    return;
  }
  
  // 숫자 필드는 확실하게 Number 타입으로 변환
  const artworkToAdd = {
    ...newArtwork.value,
    year: newArtwork.value.year ? Number(newArtwork.value.year) : null,
    buyPrice: newArtwork.value.buyPrice ? Number(newArtwork.value.buyPrice) : null,
    sellPrice: newArtwork.value.sellPrice ? Number(newArtwork.value.sellPrice) : null,
  };
  
  emits('add-artwork', artworkToAdd); // 부모 컴포넌트에 새 작품 데이터 전송
  resetForm(); // 폼 초기화
};

// '취소' 버튼 클릭 시 실행
const cancel = () => {
  resetForm(); // 폼 초기화
  emits('cancel'); // 부모 컴포넌트에 취소 이벤트 전송
};

// 폼 데이터를 초기 상태로 리셋하는 함수
const resetForm = () => {
  newArtwork.value = { 
    code: props.initialCode, // initialCode로 다시 코드 필드를 설정하여 다음 추가에 대비
    title: '', artist: '', technique: '', size: '', year: null, 
    buyPrice: null, sellPrice: null, stockDate: '', setName: '' 
  };
};
</script>

<style lang="scss" scoped>
// _style.scss에서 공용 스타일을 가져와서 사용합니다.
// scoped 키워드 덕분에 이 컴포넌트 안에서만 스타일이 유효합니다.
@import '@/assets/styles/_style.scss';

// 만약 ArtworkAddForm.vue 에만 필요한 특별한 스타일이 있다면 여기에 추가할 수 있습니다.
// 하지만 현재는 _style.scss의 공용 스타일로 충분합니다.
</style>