// src/composables/useLectureData.js
import { ref, onMounted } from 'vue';

// ✨ 특강 이미지 Base URL 정의 ✨
const LECTURE_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/youngsungallery/IMG_DB/main/youngsungallery/exh/';


export function useLectureData() {
  const lectures = ref([]); // 특강 데이터 배열
  const loading = ref(true);   // 데이터 로딩 중 여부
  const error = ref(null);     // 에러 발생 시 에러 객체

  // Helper function: 전체 URL에서 파일명(.png 확장자 없이)을 추출 (전시와 동일)
  const extractFilenameWithoutExtension = (url) => {
    if (!url) return '';
    let cleanUrl = url.split('?')[0];

    if (cleanUrl.includes('raw.githubusercontent.com')) {
      const parts = cleanUrl.split('/');
      let filenameWithExtension = parts[parts.length - 1];
      if (filenameWithExtension.endsWith('.png')) {
        return filenameWithExtension.slice(0, -4);
      }
      return filenameWithExtension;
    }

    if (cleanUrl.includes('/blob/')) {
      const blobPath = cleanUrl.split('/blob/')[1];
      const parts = blobPath.split('/');
      let filenameWithExtension = parts[parts.length - 1];
      if (filenameWithExtension.endsWith('.png')) {
        return filenameWithExtension.slice(0, -4);
      }
      return filenameWithExtension;
    }
    
    if (cleanUrl.endsWith('.png')) {
      return cleanUrl.slice(0, -4);
    }
    return cleanUrl; 
  };

  // Helper function: 파일명으로 완성된 이미지 URL 생성 (전시와 동일)
  const generateFullImageUrl = (imageFilename) => {
    if (!imageFilename) return '';
    if (imageFilename.endsWith('.png')) { // 혹시 파일명에 이미 확장자가 포함된 경우
        return `${LECTURE_IMAGE_BASE_URL}${imageFilename}`;
    }
    return `${LECTURE_IMAGE_BASE_URL}${imageFilename}.png`;
  };


  // 데이터 불러오기 로직
  onMounted(async () => {
    try {
      const response = await fetch('/data/lectures.json'); // 특강 JSON 파일 경로
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      lectures.value = data.map(item => {
        let resolvedImageFilename = '';
        if (item.imageFile) { // imageFile 필드가 있으면 우선 사용
          resolvedImageFilename = item.imageFile;
        } else if (item.image) { // imageFile이 없고 image 필드가 있으면 image에서 파일명 추출
          resolvedImageFilename = extractFilenameWithoutExtension(item.image);
        } else {
          resolvedImageFilename = '';
        }

        const fullImageUrl = generateFullImageUrl(resolvedImageFilename); // 이미지 필드까지 생성
        return {
          ...item,
          imageFile: resolvedImageFilename, // ✨ imageFile 필드에 파일명만 저장 ✨
          image: fullImageUrl, // ✨ image 필드에 완성된 URL 채우기 ✨
          isEditing: false, 
          // editedData와 originalDataCopy에도 imageFile과 image 필드 모두 업데이트
          editedData: { 
            ...item, 
            imageFile: resolvedImageFilename, 
            image: fullImageUrl
          }, 
          originalDataCopy: { 
            ...item, 
            imageFile: resolvedImageFilename, 
            image: fullImageUrl
          }
        };
      });
    } catch (e) {
      error.value = e;
      console.error("특강 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });

  const addLecture = (newLecData) => {
    const newImageFile = newLecData.imageFile || '';
    const newImageUrl = generateFullImageUrl(newImageFile); // 새 특강의 image URL 생성

    const newLec = {
      ...newLecData,
      imageFile: newImageFile, // ✨ imageFile 사용 ✨
      image: newImageUrl,     // ✨ image 필드에 완성된 URL 채우기 ✨
      isEditing: false,
      editedData: { ...newLecData, imageFile: newImageFile, image: newImageUrl },
      originalDataCopy: { ...newLecData, imageFile: newImageFile, image: newImageUrl }
    };

    lectures.value.unshift(newLec); // 목록 상단에 추가 (최신 항목이 맨 위)
    alert(`'${newLec.title}' 특강이 목록에 추가되었습니다!`);
    console.log('새 특강 추가됨:', newLec);
    console.log('새 특강 이미지 URL 확인:', newLec.image); 
    return true;
  };

  const startEditingLecture = (lec) => {
    lec.originalDataCopy = { ...lec };
    lec.editedData = { ...lec, imageFile: lec.imageFile, image: lec.image }; 
    lec.isEditing = true;
  };

  const saveEditedLecture = (lec) => {
    const updatedImageFile = lec.editedData.imageFile || ''; 
    const updatedImageUrl = generateFullImageUrl(updatedImageFile); 
    
    lec.title = lec.editedData.title;
    lec.SLI = lec.editedData.SLI; // SLI 필드 저장
    lec.date = lec.editedData.date;
    lec.imageFile = updatedImageFile; // imageFile (파일명) 업데이트
    lec.image = updatedImageUrl;     // ✨ image (완성된 URL) 업데이트 ✨

    // 기존 image 필드가 객체에 남아있었을 경우 제거할 필요 없음 (이제 활용하므로)
    
    lec.isEditing = false;
    alert(`'${lec.title}' 특강 정보가 프론트엔드에 저장되었습니다!`);
    console.log('특강 저장됨 (프론트엔드):', lec);
    console.log('수정된 특강 이미지 URL 확인:', lec.image); 
    lec.originalDataCopy = { ...lec }; 
  };

  const cancelEditingLecture = (lec) => {
    lec.editedData = { ...lec.originalDataCopy };
    lec.isEditing = false;
    console.log('편집 취소됨:', lec);
  };

  const downloadJson = () => {
    const dataToDownload = lectures.value.map(item => {
      const { isEditing, editedData, originalDataCopy, image, ...rest } = item; 
      return {
        ...rest,
        imageFile: item.imageFile || '' 
      };
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

  return {
    lectures,
    loading,
    error,
    addLecture,
    startEditingLecture,
    saveEditedLecture,
    cancelEditingLecture,
    downloadJson
  };
}