import { ref, onMounted, computed } from 'vue'; // ✨ computed 임포트 추가!

export function useArtworkData() {
  const artworks = ref([]);
  const loading = ref(true);
  const error = ref(null);

  // ✨ 기존 GitHub blob URL은 파일 탐색용이므로 그대로 두고
  const IMG_BASE_URL = 'https://github.com/youngsungallery/IMG_DB/blob/main/youngsungallery/art/';
  // ✨ 이미지를 웹에서 직접 보여줄 때 사용할 raw GitHub URL을 새로 정의했어.
  const IMG_DISPLAY_BASE_URL = 'https://raw.githubusercontent.com/youngsungallery/IMG_DB/main/youngsungallery/art/';


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
  const nextArtworkCode = computed(() => {
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

  // ✨ 기존 downloadJson 함수 이름을 downloadInternalJson으로 변경
  const downloadInternalJson = () => {
    const dataToDownload = artworks.value.map(item => {
      // isEditing, editedData, originalDataCopy는 내부 Vue 상태이므로 제거
      const { isEditing, editedData, originalDataCopy, ...rest } = item;
      return rest; // 나머지 모든 필드를 포함
    });

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'artworks_internal.json'; // 파일명 변경
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('수정된 내부용 작품 목록 JSON 파일이 다운로드됩니다!');
  };

  // ✨ 외부용 JSON 다운로드 함수 추가 및 필드 제외 조건 명확화 ✨
  const downloadExternalJson = () => {
    const dataToDownload = artworks.value.map(item => {
      // 외부 노출용 필드만 선택 (구입가, 판매가, 입고일, 내부 상태 등 제외)
      const { 
        code, title, artist, technique, size, year, setName,
        // buyPrice, sellPrice, stockDate 필드는 제외됨
      } = item;

      // 작품 코드 기반으로 외부용 이미지 URL 생성 (확장자는 가정: .jpg)
      const imageUrl = `${IMG_DISPLAY_BASE_URL}${code}.jpg`; 

      return {
        code,
        title,
        artist,
        technique,
        size,
        year,
        setName: setName || null,     // 세트명이 없을 수도 있으니 null 처리
        imageUrl,                     // 외부용 이미지 URL 추가
      };
    });

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'artworks_external.json'; // 파일명 변경
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('외부용 작품 목록 JSON 파일이 다운로드됩니다!');
  };

  return {
    artworks,
    loading,
    error,
    IMG_BASE_URL,           // 기존 이미지 기본 URL (Blob)
    IMG_DISPLAY_BASE_URL,   // ✨ 새로 추가된 이미지를 웹에 표시할 URL (RAW)
    nextArtworkCode,        // ✨ computed 속성으로 변경된 새 작품 코드
    addArtwork,
    startEditingArtwork,
    saveEditedArtwork,
    cancelEditingArtwork,
    deleteArtwork,
    downloadInternalJson,   // ✨ 이름 변경된 내부용 다운로드 함수
    downloadExternalJson    // ✨ 새로 추가된 외부용 다운로드 함수
  };
}