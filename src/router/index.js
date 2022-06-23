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
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/categoria/:category',
    name: 'category',
    component: () => import('../views/Home.vue'),
  },
  {
  path: '/configuracion',
  name: 'Configuracion',
  component: () => import('../views/config.vue'),
  meta: {isProtect : true}
  },
  {
    path: '/favoritos',
    name: 'Favoritos',
    component: () => import('../views/favorites.vue'),
    meta: {isProtect : true}
  },
  {
    path: '/carrito',
    name: 'Carrito',
    component: () => import('../views/cart.vue'),
  },
  {
    path: '/pagoInformacion/:uuid',
    name: 'Checkout',
    component: () => import('../views/paymentInfo.vue'),
    meta: {isProtect : true}
  },
  {
    path: '/envioInformacion/:uuid',
    name: 'Shipping',
    component: () => import('../views/shippingInfo.vue'),
    meta: {isProtect : true}
  },
  {
    path: '/pago/:uuid',
    name: 'Payment',
    component: () => import('../views/confirmPayment.vue'),
    meta: {isProtect : true}
  },
  {
    path: '/compra-exitosa/:uuid',
    name: 'Bought',
    component: () => import('../views/bought.vue'),
    meta: {isProtect : true}
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
  {
    path: '/:pathMatch(.*)/:pathMatch2(.*)?',
    name: 'NotFound',
    component: () => import('../views/notFound.vue'),
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
    next({name:'NotFound'}) // pagina no existe
  }  else {
    const isAdmin = to.matched.some(item => item.meta.isAdmin);
      if (isAdmin  && store.state.roll  === 'user') {
        next({name:'NotFound'}) // PAGINA DE NO EXISTE
      } else {
        next()
      }    
  }
})

export default router
