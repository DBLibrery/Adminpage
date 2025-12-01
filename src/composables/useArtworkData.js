// src/composables/useArtworkData.js
import { ref, onMounted, computed } from 'vue';

export function useArtworkData() {
  const artworks = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const IMG_BASE_URL = 'https://github.com/youngsungallery/IMG_DB/blob/main/youngsungallery/art/';
  const IMG_DISPLAY_BASE_URL = 'https://raw.githubusercontent.com/youngsungallery/IMG_DB/main/youngsungallery/art/';

  const parseFlexiblePrice = (value) => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    if (typeof value === 'string') {
      if (/^\d+(\.\d+)?$/.test(value.trim())) { 
          return Number(value);
      }
      return value;
    }
    if (typeof value === 'number') {
        return value;
    }
    return value;
  };

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

  // downloadJson 단일 함수
  const downloadJson = () => {
    // 1. 현재 artworks.value 데이터에서 비공개 필드(buyPrice, sellPrice, owner) 제거
    const publicArtworks = artworks.value.map(item => {
      // isEditing, editedData, originalDataCopy 같은 UI/로직용 임시 필드도 제외
      const { buyPrice, sellPrice, owner, isEditing, editedData, originalDataCopy, ...publicData } = item;
      return publicData;
    });

    // 2. 필터링된 공개용 데이터를 JSON 문자열로 변환 (들여쓰기 2칸으로 보기 좋게)
    const jsonString = JSON.stringify(publicArtworks, null, 2);

    // 3. 'artworks.json' 이라는 이름으로 다운로드
    downloadFile(jsonString, 'artworks.json', 'application/json');
    alert('\'artworks.json\' 파일이 성공적으로 다운로드되었습니다! 이 파일을 GitHub에 업로드해 주세요.');

    // ⭐️⭐️⭐️ 여기입니다! GitHub 업로드 페이지 열기 ⭐️⭐️⭐️
    // youngsungallery/website 저장소의 public/data 폴더로 파일을 업로드하는 페이지를 엽니다.
    // 이 URL은 youngsungallery.com 웹사이트 저장소의 업로드 페이지여야 합니다.
    const githubUploadUrl = 'https://github.com/DBLibrery/Adminpage/upload/main/public/data'; 
    window.open(githubUploadUrl, '_blank'); // 새 탭으로 열기
  };


  onMounted(async () => {
    try {
      const response = await fetch(import.meta.env.BASE_URL + 'data/artworks.json'); 
      if (!response.ok) {
        throw new Error(`작품 정보를 불러오는데 실패했습니다: ${response.status}`);
      }
      let data = await response.json();

      data.sort((a, b) => {
        const getNum = (code) => parseInt(String(code).replace('YS', ''));
        return getNum(b.code) - getNum(a.code);
      });

      artworks.value = data.map(item => ({
        ...item,
        year: item.year ? Number(item.year) : null,
        buyPrice: parseFlexiblePrice(item.buyPrice),
        sellPrice: item.sellPrice ? Number(item.sellPrice) : null,
        isEditing: false, 
        editedData: { 
          ...item,
          year: item.year ? Number(item.year) : null,
          buyPrice: parseFlexiblePrice(item.buyPrice),
          sellPrice: item.sellPrice ? Number(item.sellPrice) : null,
        },
        originalDataCopy: { 
          ...item,
          year: item.year ? Number(item.year) : null,
          buyPrice: parseFlexiblePrice(item.buyPrice),
          sellPrice: item.sellPrice ? Number(item.sellPrice) : null,
        }
      }));
    } catch (e) {
      error.value = e;
      console.error("작품 정보를 불러오는데 실패했습니다:", e);
    } finally {
      loading.value = false;
    }
  });


  const nextArtworkCode = computed(() => {
    const currentMaxNum = artworks.value.reduce((max, item) => {
      const match = String(item.code).match(/^YS(\d+)$/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    return `YS${(currentMaxNum + 1).toString().padStart(3, '0')}`;
  });

  const addArtwork = (newArtData) => {
    if (artworks.value.some(item => item.code === newArtData.code)) {
      alert(`코드 '${newArtData.code}'는 이미 존재합니다. 다른 코드를 사용해 주세요.`);
      return false;
    }

    const newArt = {
      ...newArtData,
      isEditing: false,
      editedData: { ...newArtData },
      originalDataCopy: { ...newArtData }
    };

    artworks.value.unshift(newArt);
    alert(`'${newArt.title}' 작품이 목록에 추가되었습니다! (코드: ${newArt.code})`);
    console.log('새 작품 추가됨:', newArt);
    return true;
  };

  const startEditingArtwork = (artwork) => {
    artwork.originalDataCopy = { ...artwork };
    artwork.editedData = { ...artwork };
    artwork.isEditing = true;
  };

  const saveEditedArtwork = (artwork) => {
    artwork.editedData.year = artwork.editedData.year ? Number(artwork.editedData.year) : null;
    artwork.editedData.buyPrice = parseFlexiblePrice(artwork.editedData.buyPrice);
    artwork.editedData.sellPrice = artwork.editedData.sellPrice ? Number(artwork.editedData.sellPrice) : null;

    const { isEditing, originalDataCopy, ...actualEditedData } = artwork.editedData;
    Object.assign(artwork, actualEditedData);

    artwork.isEditing = false;
    alert(`'${artwork.title}' 작품 정보가 프론트엔드에 저장되었습니다!`);
    console.log('작품 저장됨 (프론트엔드):', artwork);
    artwork.originalDataCopy = { ...artwork };
  };

  const cancelEditingArtwork = (artwork) => {
    Object.assign(artwork, artwork.originalDataCopy);
    artwork.isEditing = false;
    console.log('편집 취소됨:', artwork);
  };

  const deleteArtwork = (artwork) => {
    if (confirm(`정말로 '${artwork.title}' 작품을 삭제하시겠습니까?`)) {
      artworks.value = artworks.value.filter(item => item.code !== artwork.code);
      alert(`'${artwork.title}' 작품을 삭제합니다! (프론트엔드에서만 반영)`);
    }
  };

  return {
    artworks,
    loading,
    error,
    IMG_BASE_URL,
    IMG_DISPLAY_BASE_URL,
    nextArtworkCode,
    addArtwork,
    startEditingArtwork,
    saveEditedArtwork,
    cancelEditingArtwork,
    deleteArtwork,
    downloadJson // 단일 다운로드 함수만 반환
  };
}