import Vue from 'vue'
import VueRouter from 'vue-router'
 import store from '../store/index'
import login from '../views/login.vue'
import addProduct from '../views/admin/addProducts.vue'
import addCategory from '../views/admin/addCategory.vue'

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
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home.vue'),
  },
  {
  path: '/configuracion',
  name: 'Configuracion',
  component: () => import('../views/config.vue'),
  meta: {isProtect : true}
  },
  {
    path: '/carrito',
    name: 'Carrito',
    component: () => import('../views/cart.vue'),
    },
  {
    path: '/admin',
    name: 'Administrador',
    component: () => import('../views/admin/adminRouter.vue'),
    meta: {isProtect : true, isAdmin: true}
  },
  {
    path: '/admin/agrega-producto/:uuid?',
    name: 'agregaProducto',
    component: addProduct,
    meta: {isProtect : true, isAdmin: true}
  },
  {
    path: '/admin/agrega-categoria',
    name: 'agregaCategoria',
    component: addCategory,
    meta: {isProtect : true, isAdmin: true}
  },
  {
    path: '/admin/elimina-categoria',
    name: 'eliminaCategoria',
    component: () => import('../views/admin/deleteCategory.vue'),
    meta: {isProtect : true, isAdmin: true}
  },
  
  {
    path: '/detalle/:uuid',
    name: 'Detalle',
    component: () => import('../views/detail.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const isProtected = to.matched.some(item => item.meta.isProtect);

  if(isProtected && store.state.token === null ) {
    next({name:'Home'}) // pagina no existe
  }  else {
    const isAdmin = to.matched.some(item => item.meta.isAdmin);
      if (isAdmin  && store.state.roll  === 'user') {
        next({name:'Home'}) // PAGINA DE NO EXISTE
      } else {
        next()
      }    
  }
})

export default router
