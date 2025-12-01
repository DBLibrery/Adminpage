// src/composables/useExhibitionData.js
import { ref, onMounted } from 'vue';

export function useExhibitionData() {
  const exhibitions = ref([]);
  const loading = ref(true);
  const error = ref(null);

  // ⭐️⭐️⭐️ 이미지 기본 경로 변수들은 이제 삭제합니다.
  // JSON 파일에 이미지의 전체 경로가 직접 저장되어 있다고 가정합니다. ⭐️⭐️⭐️


  // 파일 다운로드 헬퍼 함수
  const downloadFile = (data, filename, type) => {
    const blob = new Blob([data], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 전시 데이터를 JSON으로 다운로드하는 함수
  const downloadExhibitionsJson = () => {
    const jsonString = JSON.stringify(exhibitions.value, null, 2); 
    downloadFile(jsonString, 'exhibitions.json', 'application/json');
    alert('\'exhibitions.json\' 파일이 성공적으로 다운로드되었습니다! 이 파일을 youngsungallery/website 저장소의 public/data 폴더에 업로드해 주세요.');

    // GitHub 업로드 페이지 열기 (본사이트 저장소의 public/data 폴더로 연결)
    const githubUploadUrl = 'https://github.com/youngsungallery/website/upload/main/public/data'; 
    window.open(githubUploadUrl, '_blank');
  };

  // 컴포넌트 마운트 시 JSON 데이터 불러오기
  onMounted(async () => {
    try {
      // 관리사이트 내부 경로에서 exhibitions.json 파일 불러오기
      const response = await fetch(import.meta.env.BASE_URL + 'data/exhibitions.json'); 
      if (!response.ok) {
        throw new Error(`전시 정보를 불러오는데 실패했습니다: ${response.status}`);
      }
      const data = await response.json();
      exhibitions.value = data.map(item => ({
        ...item,
        isEditing: false,
        editedData: { ...item },
        // ⭐️⭐️⭐️ _tempImageFilename 임시 필드는 더 이상 필요 없습니다. ⭐️⭐️⭐️
      }));
    } catch (e) {
      error.value = e;
      console.error("전시 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });

  // 새 전시 추가 함수
  const addExhibition = (newExhibitionData) => {
    // ⭐️⭐️⭐️ 이미지 경로를 별도로 가공하지 않고 그대로 사용합니다. ⭐️⭐️⭐️
    // newExhibitionData.image에 이미 전체 경로가 들어있다고 가정
    const newExhibition = {
      ...newExhibitionData,
      id: Date.now(), // 고유 ID 부여
      isEditing: false,
      editedData: { ...newExhibitionData }
    };
    exhibitions.value.unshift(newExhibition);
    alert('새 전시 정보가 추가되었습니다!');
  };

  // 전시 수정 모드 진입 함수
  const startEditingExhibition = (exhibition) => {
    exhibition.editedData = { ...exhibition };
    exhibition.isEditing = true;
  };

  // 수정된 전시 정보 저장 함수
  const saveEditedExhibition = (exhibition) => {
    // ⭐️⭐️⭐️ 이미지 경로를 별도로 가공하지 않고 editedData.image를 그대로 사용합니다. ⭐️⭐️⭐️
    Object.assign(exhibition, exhibition.editedData); // editedData 내용으로 원본 전시 객체 업데이트
    exhibition.isEditing = false;
    alert('전시 정보가 저장되었습니다!');
  };

  // 전시 수정 취소 함수
  const cancelEditingExhibition = (exhibition) => {
    exhibition.isEditing = false;
  };

  // 전시 삭제 함수
  const deleteExhibition = (id) => {
    if (confirm('정말로 이 전시 정보를 삭제하시겠습니까?')) {
      exhibitions.value = exhibitions.value.filter(ex => ex.id !== id);
      alert('전시 정보가 삭제되었습니다!');
    }
  };

  return {
    exhibitions,
    loading,
    error,
    addExhibition,
    startEditingExhibition,
    saveEditedExhibition,
    cancelEditingExhibition,
    deleteExhibition,
    downloadExhibitionsJson,
    // ⭐️⭐️⭐️ IMG_EXHIBITION_DISPLAY_BASE_URL은 더 이상 필요 없으므로 반환하지 않습니다. ⭐️⭐️⭐️
  };
}