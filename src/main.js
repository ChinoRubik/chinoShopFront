import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' 
import 'vue-select/dist/vue-select.css';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import './index.css'


Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Vuesax, {})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
