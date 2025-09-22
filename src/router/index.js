// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue' // 우리가 만든 HomeView 컴포넌트 불러오기

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',          // 웹사이트의 기본 경로 (예: http://localhost:5173/)
      name: 'home',       // 이 라우트의 이름 (나중에 링크 걸 때 사용)
      component: HomeView // 이 경로에 접속하면 HomeView 컴포넌트를 보여줘!
    }
    // 나중에 다른 관리 페이지 (예: /exhibitions, /lectures)를 여기에 추가할 거야.
  ]
})

export default router