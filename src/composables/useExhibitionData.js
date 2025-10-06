// src/composables/useExhibitionData.js
import { ref, onMounted } from 'vue';

const EXHIBITION_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/youngsungallery/IMG_DB/main/youngsungallery/exh/';

export function useExhibitionData() {
  const exhibitions = ref([]); 
  const loading = ref(true);    
  const error = ref(null);      

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

  const generateFullImageUrl = (imageFilename) => {
    if (!imageFilename) return '';
    // 파일명에 '.png'가 이미 포함되어 있으면 중복으로 붙이지 않도록 확인
    if (imageFilename.endsWith('.png')) {
        return `${EXHIBITION_IMAGE_BASE_URL}${imageFilename}`;
    }
    return `${EXHIBITION_IMAGE_BASE_URL}${imageFilename}.png`;
  };


  onMounted(async () => {
    try {
      const response = await fetch('/data/exhibitions.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      exhibitions.value = data.map(item => {
        let resolvedImageFilename = '';
        if (item.imageFile) {
          resolvedImageFilename = item.imageFile;
        } else if (item.image) {
          resolvedImageFilename = extractFilenameWithoutExtension(item.image);
        } else {
          resolvedImageFilename = '';
        }

        const fullImageUrl = generateFullImageUrl(resolvedImageFilename); // 이미지 필드까지 생성
        return {
          ...item,
          imageFile: resolvedImageFilename, 
          image: fullImageUrl, // ✨ item.image 필드에 완성된 URL 채우기 ✨
          isEditing: false, 
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
      console.error("전시 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });

  const addExhibition = (newExhData) => {
    const newImageFile = newExhData.imageFile || '';
    const newImageUrl = generateFullImageUrl(newImageFile); // 새 전시의 image URL 생성

    const newExh = {
      ...newExhData,
      imageFile: newImageFile, // ✨ imageFile 사용 ✨
      image: newImageUrl,     // ✨ image 필드에 완성된 URL 채우기 ✨
      isEditing: false,
      // ✨ editedData와 originalDataCopy도 imageFile과 image로 초기화 ✨
      editedData: { 
        ...newExhData, 
        imageFile: newImageFile, 
        image: newImageUrl 
      },
      originalDataCopy: { 
        ...newExhData, 
        imageFile: newImageFile, 
        image: newImageUrl 
      }
    };

    exhibitions.value.unshift(newExh); 
    alert(`'${newExh.title}' 전시가 목록에 추가되었습니다!`);
    console.log('새 전시 추가됨:', newExh);

    // ✨ 콘솔에 추가된 전시의 이미지 URL을 출력해서 확인! ✨
    console.log('새 전시 이미지 URL 확인:', newExh.image); 

    return true;
  };

  const startEditingExhibition = (exh) => {
    exh.originalDataCopy = { ...exh };
    exh.editedData = { ...exh, imageFile: exh.imageFile, image: exh.image }; 
    exh.isEditing = true;
  };

  const saveEditedExhibition = (exh) => {
    const updatedImageFile = exh.editedData.imageFile || ''; 
    const updatedImageUrl = generateFullImageUrl(updatedImageFile); // 수정된 이미지 URL 생성
    
    exh.title = exh.editedData.title;
    exh.date = exh.editedData.date;
    exh.desc = exh.editedData.desc;
    exh.imageFile = updatedImageFile; // imageFile (파일명) 업데이트
    exh.image = updatedImageUrl;     // ✨ image (완성된 URL) 업데이트 ✨

    if (Object.prototype.hasOwnProperty.call(exh, 'image')) {
      delete exh.image; // 기존 image 필드는 imageFile로 통일되면서 이 로직은 불필요할 수 있지만, 만일을 위해.
    }
    
    exh.isEditing = false;
    alert(`'${exh.title}' 전시 정보가 프론트엔드에 저장되었습니다!`);
    console.log('전시 저장됨 (프론트엔드):', exh);
    console.log('수정된 전시 이미지 URL 확인:', exh.image); // ✨ 콘솔에 이미지 URL 출력해서 확인! ✨
    exh.originalDataCopy = { ...exh }; 
  };

  const cancelEditingExhibition = (exh) => {
    exh.editedData = { ...exh.originalDataCopy };
    exh.isEditing = false;
    console.log('편집 취소됨:', exh);
  };

  const downloadJson = () => {
    const dataToDownload = exhibitions.value.map(item => {
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
    a.download = 'exhibitions_updated.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('수정된 전시 목록 JSON 파일이 다운로드됩니다!');
  };

  return {
    exhibitions,
    loading,
    error,
    addExhibition,
    startEditingExhibition,
    saveEditedExhibition,
    cancelEditingExhibition,
    downloadJson
  };
}