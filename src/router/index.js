import { createRouter, createWebHistory } from '@ionic/vue-router';
import LeaderManual from '@/pages/leaderManual.vue'
import Login from '@/pages/login.vue'
import store from '@/store'

const authGuard = (to, from, next) => {
  // check state
  const isLoggedIn = store.state.loggedIn

  if (!isLoggedIn)
    // check local storage
    store.dispatch('checkStorageForStudent')
      .then(student => {
        const isAuthenticated = !!student
        if (isAuthenticated) next()
        else next('/')
      })
      .catch(() => next('/'))
  else
    next()
}

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/leader-manual',
    name: 'LeaderManual',
    beforeEnter: authGuard,
    component: LeaderManual
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
