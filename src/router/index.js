import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store/index'
import login from '../views/login.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: login
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register.vue'),
    meta: {isProtect : true}

  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home.vue'),
    meta: {isProtect : true}
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isProtected = to.matched.some(item => item.meta.isProtect);

  if(isProtected && localStorage.getItem('token') === null) {

    next({name:'Login'})
  } else {
    next()
  }
})

export default router
