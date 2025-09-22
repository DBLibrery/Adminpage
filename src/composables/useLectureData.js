// src/composables/useLectureData.js
import { ref, onMounted } from 'vue';

export function useLectureData() {
  const lectures = ref([]); // 특강 데이터 배열
  const loading = ref(true);   // 데이터 로딩 중 여부
  const error = ref(null);     // 에러 발생 시 에러 객체

  // 데이터 불러오기 로직
  onMounted(async () => {
    try {
      const response = await fetch('/data/lectures.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // 각 아이템에 편집 관련 상태 초기화
      lectures.value = data.map(item => ({
        ...item,
        isEditing: false, // 편집 모드 여부
        editedData: { ...item }, // 편집 중인 데이터
        originalDataCopy: { ...item } // 원본 데이터 (취소 시 되돌리기 위해)
      }));
    } catch (e) {
      error.value = e;
      console.error("특강 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });

  // 새 특강 ID를 생성하는 함수 (가장 높은 ID + 1)
  const generateNewLectureId = () => {
    const maxId = lectures.value.reduce((max, item) => Math.max(max, item.id), 0);
    return maxId + 1;
  };

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

  // 새 특강을 추가하는 함수
  const addLecture = (newLecData) => {
    // ID 중복 검사 (새로 생성하는 ID는 일반적으로 Unique하지만, 혹시 모를 상황 대비)
    if (lectures.value.some(item => item.id === newLecData.id)) {
      alert(`ID '${newLecData.id}'는 이미 존재합니다. 다른 ID를 사용해 주세요.`);
      return false;
    }

    const newLec = {
      ...newLecData,
      image: ensureRawTrue(newLecData.image), // 이미지 URL 정규화
      isEditing: false,
      editedData: { ...newLecData },
      originalDataCopy: { ...newLecData }
    };

    lectures.value.unshift(newLec); // 목록 상단에 추가
    alert(`'${newLec.title}' 특강이 목록에 추가되었습니다! (ID: ${newLec.id})`);
    console.log('새 특강 추가됨:', newLec);
    return true;
  };

  // 특강 정보 수정을 시작하는 함수
  const startEditingLecture = (lec) => {
    lec.originalDataCopy = { ...lec };
    lec.editedData = { ...lec };
    lec.isEditing = true;
  };

  // 특강 정보를 저장하는 함수
  const saveEditedLecture = (lec) => {
    // 이미지 URL 저장 전에 정규화
    lec.editedData.image = ensureRawTrue(lec.editedData.image);

    Object.assign(lec, lec.editedData);
    lec.isEditing = false;
    alert(`'${lec.title}' 특강 정보가 프론트엔드에 저장되었습니다!`);
    console.log('특강 저장됨 (프론트엔드):', lec);
    lec.originalDataCopy = { ...lec };
  };

  // 특강 수정 취소하는 함수
  const cancelEditingLecture = (lec) => {
    lec.editedData = { ...lec.originalDataCopy };
    lec.isEditing = false;
    console.log('편집 취소됨:', lec);
  };

  // 특강을 삭제하는 함수
  const deleteLecture = (lec) => {
    if (confirm(`정말로 '${lec.title}' 특강을 삭제하시겠습니까?`)) {
      lectures.value = lectures.value.filter(item => item.id !== lec.id);
      alert(`'${lec.title}' 특강을 삭제합니다! (프론트엔드에서만 반영)`);
    }
  };

  // 현재 목록을 JSON 파일로 다운로드하는 함수
  const downloadJson = () => {
    const dataToDownload = lectures.value.map(item => {
      const { isEditing, editedData, originalDataCopy, ...rest } = item;
      // 다운로드 시에도 이미지 URL이 정규화되도록 (필요하다면)
      rest.image = ensureRawTrue(rest.image); 
      return rest;
    });

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'lectures_updated.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('수정된 특강 목록 JSON 파일이 다운로드됩니다!');
  };

  // 외부에서 사용할 수 있도록 노출할 반응형 데이터와 함수들
  return {
    lectures,
    loading,
    error,
    generateNewLectureId,
    addLecture,
    startEditingLecture,
    saveEditedLecture,
    cancelEditingLecture,
    deleteLecture,
    downloadJson
  };
}