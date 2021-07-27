import { createRouter, createWebHistory } from '@ionic/vue-router';
import LeaderManual from '../pages/leaderManual.vue'

const routes = [
  {
    path: '/',
    redirect: '/leader-manual'
  },
  {
    path: '/leader-manual',
    name: 'LeaderManual',
    component: LeaderManual
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
