// src/components/ConnectionManager/useConnectionData.js
import { ref } from 'vue';

export function useConnectionData() {
  // 아직 아무 로직 없음
  const message = ref('포스터 연결 데이터 컴포저블이 여기에 들어올 예정입니다.');
  return { message };
}