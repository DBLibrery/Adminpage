// src/composables/useExhibitionData.js
import { ref, onMounted } from 'vue';

export function useExhibitionData() {
  const exhibitions = ref([]);
  const loading = ref(true);
  const error = ref(null);

  // ⭐️⭐️⭐️ 여기! 두 변수를 const로 정의했습니다. ⭐️⭐️⭐️
  // JSON 파일에 저장될 때 사용될 이미지 기본 경로 (GitHub blob 링크)
  const IMG_EXHIBITION_JSON_BASE_URL = 'https://github.com/youngsungallery/IMG_DB/blob/main/youngsungallery/exh/';
  // 실제 웹사이트에서 이미지를 표시할 때 사용될 경로 (GitHub raw.githubusercontent 링크)
  const IMG_EXHIBITION_DISPLAY_BASE_URL = 'https://raw.githubusercontent.com/youngsungallery/IMG_DB/main/youngsungallery/exh/';

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
        // JSON에 저장된 전체 이미지 URL에서 파일명만 추출하여 임시 필드에 저장
        // (UI에서 파일명만 입력/표시하기 위함)
        _tempImageFilename: item.image ? item.image.split('/').pop() : '' 
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
    // 입력된 파일명에 JSON 저장용 기본 경로를 붙여 전체 이미지 URL로 만듭니다.
    const processedImage = newExhibitionData._tempImageFilename ? IMG_EXHIBITION_JSON_BASE_URL + newExhibitionData._tempImageFilename : '';

    const newExhibition = {
      ...newExhibitionData,
      id: Date.now(), // 고유 ID 부여
      image: processedImage, // 전체 경로로 저장
      isEditing: false,
      editedData: {
        ...newExhibitionData,
        image: processedImage // editedData에도 전체 경로로 저장
      }
    };
    exhibitions.value.unshift(newExhibition);
    alert('새 전시 정보가 추가되었습니다!');
  };

  // 전시 수정 모드 진입 함수
  const startEditingExhibition = (exhibition) => {
    exhibition.editedData = { ...exhibition };
    // 편집 모드 진입 시, JSON 저장 URL에서 파일명만 추출하여 editedData.image에 할당
    exhibition.editedData.image = exhibition.image ? exhibition.image.split('/').pop() : '';
    exhibition.isEditing = true;
  };

  // 수정된 전시 정보 저장 함수
  const saveEditedExhibition = (exhibition) => {
    // editedData에 있는 파일명에 JSON 저장용 기본 경로를 붙여 전체 이미지 URL로 만듭니다.
    const processedImage = exhibition.editedData.image ? IMG_EXHIBITION_JSON_BASE_URL + exhibition.editedData.image : '';
    
    // 원본 exhibition 객체에 업데이트 (editedData와 _tempImageFilename 임시 필드는 제외)
    const { editedData, _tempImageFilename, ...rest } = exhibition; 
    Object.assign(exhibition, rest, { image: processedImage }); // image 필드는 변환된 값으로 업데이트

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
    IMG_EXHIBITION_DISPLAY_BASE_URL // ⭐️⭐️⭐️ return 문에서 노출! ⭐️⭐️⭐️
  };
}