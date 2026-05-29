import { createRouter, createWebHistory } from 'vue-router'
import Engine from '../views/Engine.vue'

const routes = [
  {
    path: '/',
    name: 'Engine',
    component: Engine
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
