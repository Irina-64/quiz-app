import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import MainPage from './components/MainPage.vue'
import TestPage from './components/TestPage.vue'
import EditTestPage from './components/EditTestPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/test', component: TestPage },
  { path: '/edit', component: EditTestPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App)
  .use(router)
  .mount('#app')