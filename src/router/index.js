import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Login from '../views/Auth/login.vue'
import register from '../views/Auth/register.vue'
import dashboard from '../views/dashboard.vue'
import profile from '../views/profile/index.vue'
import forgetPassword from '../views/Auth/forgetPassword.vue'

// const store = useStore()
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
      },
  {
    path: '/register',
    name: 'register',
    component: register,
  },
  {
    path: '/forgot-password',
    name: 'forgetPassword',
    component: forgetPassword,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    beforeEnter: (to, from, next) => {
      if (!store.getters.isLoggedIn) {
        next('/login')  
      } else {
        next()  
      }
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: profile,
    beforeEnter: (to, from, next) => {
      if (!store.getters.isLoggedIn) {
        next('/login')  
      } else {
        next()  
      }
    }
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
