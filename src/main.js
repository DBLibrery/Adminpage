// src/main.js
import { createApp } from 'vue' // Vue 앱을 생성하는 함수 불러오기
import App from './App.vue'      // 우리 앱의 가장 최상위 컴포넌트인 App.vue 불러오기
import router from './router'    // 새로 만든 라우터 인스턴스 불러오기

const app = createApp(App) // App.vue를 기반으로 Vue 앱 생성

app.use(router) // 생성된 Vue 앱에 라우터 연결!

app.mount('#app') // Vue 앱을 HTML의 #app 엘리먼트에 마운트 (연결하여 보여주기)