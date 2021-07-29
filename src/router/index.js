import { createRouter, createWebHistory } from '@ionic/vue-router';
import LeaderManual from '@/pages/leaderManual.vue'
import Login from '@/pages/login.vue'
import store from '@/store'

const loginRoute = '/login'

const authGuard = (to, from, next) => {
  // check state
  const isLoggedIn = store.state.loggedIn

  if (!isLoggedIn)
    // check local storage
    store.dispatch('checkStorageForStudent')
      .then(student => {
        const isAuthenticated = !!student
        if (isAuthenticated) next()
        else next({path: loginRoute, query: {redirect: to.fullPath}})
      })
      .catch(() => next({path: loginRoute, query: {redirect: to.fullPath}}))
  else
    next()
}

const routes = [
  {
    path: loginRoute,
    component: Login,
  },
  {
    path: '/',
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
