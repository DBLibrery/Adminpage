// src/composables/useLectureData.js (전체 코드)
import { ref, onMounted } from 'vue';

export function useLectureData() {
  const lectures = ref([]);
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

  const downloadLecturesJson = () => {
    const jsonString = JSON.stringify(lectures.value, null, 2);
    downloadFile(jsonString, 'lectures.json', 'application/json');
    alert('\'lectures.json\' 파일이 성공적으로 다운로드되었습니다! 이 파일을 youngsungallery/website 저장소의 public/data 폴더에 업로드해 주세요.');

    // GitHub 업로드 페이지 열기 (youngsungallery/website 저장소의 public/data 폴더로 연결)
    const githubUploadUrl = 'https://github.com/youngsungallery/website/upload/main/public/data'; 
    window.open(githubUploadUrl, '_blank');
  };

  onMounted(async () => {
    try {
      // ⭐️⭐️⭐️ 여기를 수정합니다! 관리사이트 내부 경로에서 불러오도록 변경 ⭐️⭐️⭐️
      const response = await fetch(import.meta.env.BASE_URL + 'data/lectures.json'); 
      if (!response.ok) {
        throw new Error(`특강 정보를 불러오는데 실패했습니다: ${response.status}`);
      }
      const data = await response.json();
      lectures.value = data.map(item => ({ ...item, isEditing: false, editedData: { ...item } }));
    } catch (e) {
      error.value = e;
      console.error("특강 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });

  const addLecture = (newLectureData) => {
    const newLecture = { ...newLectureData, id: Date.now(), isEditing: false, editedData: { ...newLectureData } };
    lectures.value.unshift(newLecture);
    alert('새 특강 정보가 추가되었습니다!');
  };

  const startEditingLecture = (lecture) => {
    lecture.editedData = { ...lecture };
    lecture.isEditing = true;
  };

  const saveEditedLecture = (lecture) => {
    Object.assign(lecture, lecture.editedData);
    lecture.isEditing = false;
    alert('특강 정보가 저장되었습니다!');
  };

  const cancelEditingLecture = (lecture) => {
    lecture.isEditing = false;
  };

  const deleteLecture = (id) => {
    if (confirm('정말로 이 특강 정보를 삭제하시겠습니까?')) {
      lectures.value = lectures.value.filter(lec => lec.id !== id);
      alert('특강 정보가 삭제되었습니다!');
    }
  };

  return {
    lectures,
    loading,
    error,
    addLecture,
    startEditingLecture,
    saveEditedLecture,
    cancelEditingLecture,
    deleteLecture,
    downloadLecturesJson,
  };
}