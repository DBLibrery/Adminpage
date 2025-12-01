// src/composables/useExhibitionData.js (전체 코드)
import { ref, onMounted } from 'vue';

export function useExhibitionData() {
  const exhibitions = ref([]);
  const loading = ref(true);
  const error = ref(null);

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

    // GitHub 업로드 페이지 열기 (youngsungallery/website 저장소의 public/data 폴더로 연결)
    const githubUploadUrl = 'https://github.com/youngsungallery/website/upload/main/public/data'; 
    window.open(githubUploadUrl, '_blank');
  };

  onMounted(async () => {
    try {
      // ⭐️⭐️⭐️ 여기를 수정합니다! 관리사이트 내부 경로에서 불러오도록 변경 ⭐️⭐️⭐️
      const response = await fetch(import.meta.env.BASE_URL + 'data/exhibitions.json'); 
      if (!response.ok) {
        throw new Error(`전시 정보를 불러오는데 실패했습니다: ${response.status}`);
      }
      const data = await response.json();
      exhibitions.value = data.map(item => ({ ...item, isEditing: false, editedData: { ...item } }));
    } catch (e) {
      error.value = e;
      console.error("전시 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });

  const addExhibition = (newExhibitionData) => {
    const newExhibition = { ...newExhibitionData, id: Date.now(), isEditing: false, editedData: { ...newExhibitionData } };
    exhibitions.value.unshift(newExhibition);
    alert('새 전시 정보가 추가되었습니다!');
  };

  const startEditingExhibition = (exhibition) => {
    exhibition.editedData = { ...exhibition };
    exhibition.isEditing = true;
  };

  const saveEditedExhibition = (exhibition) => {
    Object.assign(exhibition, exhibition.editedData);
    exhibition.isEditing = false;
    alert('전시 정보가 저장되었습니다!');
  };

  const cancelEditingExhibition = (exhibition) => {
    exhibition.isEditing = false;
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
  };
}