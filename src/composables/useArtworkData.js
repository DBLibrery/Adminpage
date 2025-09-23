import { ref, onMounted, computed } from 'vue'; // ✨ computed를 임포트 추가!

export function useArtworkData() {
  const artworks = ref([]);
  const loading = ref(true);
  const error = ref(null);

  const IMG_BASE_URL = 'https://github.com/youngsungallery/IMG_DB/blob/main/youngsungallery/art/';

  onMounted(async () => {
    try {
      const response = await fetch('/data/artworks.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();

      data.sort((a, b) => {
        const getNum = (code) => parseInt(String(code).replace('YS', ''));
        return getNum(b.code) - getNum(a.code);
      });

      artworks.value = data.map(item => ({
        ...item,
        year: item.year ? Number(item.year) : null,
        buyPrice: item.buyPrice ? Number(item.buyPrice) : null,
        sellPrice: item.sellPrice ? Number(item.sellPrice) : null,
        isEditing: false, 
        editedData: { 
          ...item,
          year: item.year ? Number(item.year) : null,
          buyPrice: item.buyPrice ? Number(item.buyPrice) : null,
          sellPrice: item.sellPrice ? Number(item.sellPrice) : null,
        },
        originalDataCopy: { 
          ...item,
          year: item.year ? Number(item.year) : null,
          buyPrice: item.buyPrice ? Number(item.buyPrice) : null,
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

  // ✨ generateNewArtworkCode 함수를 제거하고 nextArtworkCode computed 속성으로 변경 ✨
  const nextArtworkCode = computed(() => { // ✨ 이름을 nextArtworkCode로 바꾸고 computed로 감싸줘!
    const currentMaxNum = artworks.value.reduce((max, item) => {
      const match = String(item.code).match(/^YS(\d+)$/);
      return match ? Math.max(max, parseInt(match[1])) : max;
    }, 0);
    return `YS${currentMaxNum + 1}`;
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
    artwork.editedData.buyPrice = artwork.editedData.buyPrice ? Number(artwork.editedData.buyPrice) : null;
    artwork.editedData.sellPrice = artwork.editedData.sellPrice ? Number(artwork.editedData.sellPrice) : null;

    Object.assign(artwork, artwork.editedData);
    artwork.isEditing = false;
    alert(`'${artwork.title}' 작품 정보가 프론트엔드에 저장되었습니다!`);
    console.log('작품 저장됨 (프론트엔드):', artwork);
    artwork.originalDataCopy = { ...artwork };
  };

  const cancelEditingArtwork = (artwork) => {
    artwork.editedData = { ...artwork.originalDataCopy };
    artwork.isEditing = false;
    console.log('편집 취소됨:', artwork);
  };

  const deleteArtwork = (artwork) => {
    if (confirm(`정말로 '${artwork.title}' 작품을 삭제하시겠습니까?`)) {
      artworks.value = artworks.value.filter(item => item.code !== artwork.code);
      alert(`'${artwork.title}' 작품을 삭제합니다! (프론트엔드에서만 반영)`);
    }
  };

  const downloadJson = () => {
    const dataToDownload = artworks.value.map(item => {
      const { isEditing, editedData, originalDataCopy, ...rest } = item;
      return rest;
    });

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'artworks_updated.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('수정된 작품 목록 JSON 파일이 다운로드됩니다!');
  };

  return {
    artworks,
    loading,
    error,
    IMG_BASE_URL,
    // generateNewArtworkCode, // ✨ 이건 제거!
    nextArtworkCode, // ✨ 이 computed 속성을 반환해 줘!
    addArtwork,
    startEditingArtwork,
    saveEditedArtwork,
    cancelEditingArtwork,
    deleteArtwork,
    downloadJson
  };
}