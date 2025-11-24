import { fileURLToPath, URL } from 'node:url' // 파일 경로 유틸리티

import { defineConfig } from 'vite' // Vite 설정 도우미
import vue from '@vitejs/plugin-vue' // Vue 3 플러그인
import vueDevTools from 'vite-plugin-vue-devtools' // Vue DevTools 플러그인

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 배포를 위한 기본 URL 설정
  // 'DBLibrery.github.io/Adminpage/' 형식의 URL에 맞춰 저장소 이름을 base 경로로 지정
  base: '/Adminpage/', 
  
  // 프로젝트에서 사용할 Vite 플러그인 목록
  plugins: [
    vue(),        // Vue 컴포넌트 처리
    vueDevTools(),// Vue 개발자 도구 지원 (개발 환경에서만 활성화될 수 있음)
  ],

  // 경로 별칭 설정 (주로 @/src 경로를 더 짧게 사용하기 위함)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // @를 src 폴더로 매핑
    },
  },

  // 빌드 관련 설정
  build: {
    // 빌드된 결과물이 저장될 폴더 이름 (기본적으로 'dist' 폴더에 생성됨)
    outDir: 'dist', 
  },
})