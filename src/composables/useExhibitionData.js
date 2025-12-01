// src/composables/useExhibitionData.js
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
        // ⭐️⭐️⭐️ JSON에 id 필드가 없으므로 임의로 생성 (또는 title, date 조합으로 key 사용) ⭐️⭐️⭐️
        id: item.title + item.date, // 고유한 id가 없다면 key로 사용할 조합 생성
        isEditing: false,
        editedData: { ...item },
      }));
    } catch (e) {
      error.value = e;
      console.error("전시 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });

  const addExhibition = (newExhibitionData) => {
    const newExhibition = {
      ...newExhibitionData,
      // ⭐️⭐️⭐️ JSON에 id 필드가 없으므로 임의로 생성 ⭐️⭐️⭐️
      id: newExhibitionData.title + newExhibitionData.date, 
      isEditing: false,
      editedData: { ...newExhibitionData }
    };
    exhibitions.value.unshift(newExhibition);
    alert('새 전시 정보가 추가되었습니다!');
  };

  const startEditingExhibition = (exhibition) => {
    exhibition.editedData = { ...exhibition };
    exhibition.isEditing = true;
  };

  const saveEditedExhibition = (exhibition) => {
    // ⭐️⭐️⭐️ editedData로 원본 exhibition 객체 업데이트 ⭐️⭐️⭐️
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