// src/composables/useExhibitionData.js (전체 코드)
import { ref, onMounted } from 'vue';

export function useExhibitionData() {
  const exhibitions = ref([]);
  const loading = ref(true);
  const error = ref(null);

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

  const downloadExhibitionsJson = () => {
    const jsonString = JSON.stringify(exhibitions.value, null, 2); 
    downloadFile(jsonString, 'exhibitions.json', 'application/json');
    alert('\'exhibitions.json\' 파일이 성공적으로 다운로드되었습니다! 이 파일을 youngsungallery/website 저장소의 public/data 폴더에 업로드해 주세요.');

    const githubUploadUrl = 'https://github.com/youngsungallery/website/upload/main/public/data'; 
    window.open(githubUploadUrl, '_blank');
  };

  onMounted(async () => {
    try {
      const response = await fetch(import.meta.env.BASE_URL + 'data/exhibitions.json'); 
      if (!response.ok) {
        throw new Error(`전시 정보를 불러오는데 실패했습니다: ${response.status}`);
      }
      const data = await response.json();
      exhibitions.value = data.map(item => ({
        ...item,
        isEditing: false,
        editedData: { ...item },
        // ⭐️⭐️⭐️ 편집 모드에서 파일명만 보여주기 위한 임시 필드 (원본 image는 전체 JSON 저장 URL) ⭐️⭐️⭐️
        _tempImageFilename: item.image ? item.image.split('/').pop() : '' 
      }));
    } catch (e) {
      error.value = e;
      console.error("전시 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });

  const addExhibition = (newExhibitionData) => {
    // ⭐️⭐️⭐️ 입력된 파일명에 JSON 저장용 기본 경로를 붙여 전체 URL로 만듭니다 ⭐️⭐️⭐️
    const processedImage = newExhibitionData._tempImageFilename ? IMG_EXHIBITION_JSON_BASE_URL + newExhibitionData._tempImageFilename : '';

    const newExhibition = {
      ...newExhibitionData,
      id: Date.now(),
      image: processedImage, // JSON에 저장될 URL (blob 형태)
      isEditing: false,
      editedData: {
        ...newExhibitionData,
        image: processedImage // editedData에도 전체 경로로 저장
      }
    };
    exhibitions.value.unshift(newExhibition);
    alert('새 전시 정보가 추가되었습니다!');
  };

  const startEditingExhibition = (exhibition) => {
    exhibition.editedData = { ...exhibition };
    // ⭐️⭐️⭐️ 편집 모드 진입 시, JSON 저장 URL에서 파일명만 추출하여 editedData에 할당 ⭐️⭐️⭐️
    exhibition.editedData.image = exhibition.image ? exhibition.image.split('/').pop() : '';
    exhibition.isEditing = true;
  };

  const saveEditedExhibition = (exhibition) => {
    // ⭐️⭐️⭐️ editedData의 파일명에 JSON 저장용 기본 경로를 붙여 전체 URL로 만듭니다 ⭐️⭐️⭐️
    const processedImage = exhibition.editedData.image ? IMG_EXHIBITION_JSON_BASE_URL + exhibition.editedData.image : '';
    
    // 원본 exhibition 객체에 업데이트
    const { editedData, _tempImageFilename, ...rest } = exhibition; // editedData와 _tempImageFilename 분리
    Object.assign(exhibition, rest, { image: processedImage }); // 이미지 필드를 변환된 값으로 업데이트

    exhibition.isEditing = false;
    alert('전시 정보가 저장되었습니다!');
  };

  const cancelEditingExhibition = (exhibition) => {
    exhibition.isEditing = false;
    // (여기서는 특별한 롤백 로직 없이 isEditing만 false로)
  };

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
    IMG_EXHIBITION_DISPLAY_BASE_URL // ⭐️⭐️⭐️ 실제 이미지 표시용 URL 노출 ⭐️⭐️⭐️
  };
}