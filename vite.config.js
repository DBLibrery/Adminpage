import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages 배포를 위한 기본 URL 설정
  // '/Adminpage/' 형태로 반드시 저장소 이름과 일치해야 합니다.
  base: '/Adminpage/', 
  
  // 프로젝트에서 사용할 Vite 플러그인 목록
  plugins: [
    vue(),
    vueDevTools(),
  ],

  // 경로 별칭 설정 (주로 @/src 경로를 더 짧게 사용하기 위함)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // 빌드 관련 설정
  build: {
    // 빌드된 결과물이 저장될 폴더 이름 (기본적으로 'dist' 폴더에 생성됨)
    outDir: 'dist', 
  },
})