<template>
  <div id="app">
    <div id="nav flex">
      <div class="container mx-auto">
        <vs-navbar
          target-scroll="#padding-scroll-content"
          padding-scroll
          center-collapsed
          v-model="activeNav"
          v-if="($route.path.split('/')[1] !== 'pagoInformacion') &&  ($route.path.split('/')[1] !== 'envioInformacion') && ($route.path.split('/')[1] !== 'pago') && ($route.path.split('/')[1] !== 'compra-exitosa')"
          class="bg-gray-200"
        >
          <template #left>
            <router-link :to="{name: 'Home'}" class="hover:no-underline">

              <h1 class="text-4xl ml-3">ChinoShop</h1>
            </router-link>
          </template>

          <router-link :to="{name: 'Home'}">
            <i class="fa fa-home mr-2 text-2xl"></i>
            <span  role="link" class="pr-4 text-xl hover:cursor-pointer">Home</span>
          </router-link>

        <b-dropdown variant="outline" class="my-dropdown mt-2 mr-4">
          <template #button-content>
            <span class="text-xl color-drop hover:underline hover:text-blue-600">Categorías</span>
          </template>
          <b-dropdown-item :to="{name: 'category', params: {category: item.category}}" v-for="(item, index) in categories" :key="index">
            {{capitalize(item.category)}}
          </b-dropdown-item>
        </b-dropdown>

          <router-link :to="{name: 'Administrador'}" v-if="roll === 'admin'" class="mt-2 block-round">
            <span role="link" class="text-xl hover:cursor-pointer">Administrador</span>
          </router-link>



          <template #right>
            <div class="">
              <a href="/carrito"> 
                  <span class="bg-black font-bold text-white spanNumber rounded text-sm" >{{totalAmount}}</span>
                <img src="./assets/shopping-cart.png" class="w-8 mr-3" v-if="token"/>
                <img src="./assets/shopping-cart.png" class="w-8 mr-3" v-else/>
              </a>  
            </div>                          
            <div>
              <b-dropdown no-caret variant="link" toggle-class="text-decoration-none" right>
                <template #button-content>
                  <i class="fas fa-bars text-3xl text-gray-700"></i>
                </template>
                <b-dropdown-item :to="{name: 'Configuracion'}" v-if="token">
                <i class="fas fa-user text-lg mr-2 text-gray-500"></i>
                  Configuración
                  </b-dropdown-item>
                <b-dropdown-item :to="{name: 'Favoritos'}" v-if="token">
                  <i class="fas fa-heart text-lg mr-2 text-gray-500"></i>
                  Favoritos
                </b-dropdown-item>
                <b-dropdown-item @click="logout" v-if="token">
                <i class="fa fa-sign-out text-lg mr-2 text-gray-500"></i>
                  Log out
                </b-dropdown-item>
                <b-dropdown-item  @click="redirect" v-if="!token">
                  <i class="fa fa-sign-in text-lg mr-2 text-gray-500"></i>
                  Sign in
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </template>
        </vs-navbar>
        <div id="padding-scroll-content" class="square"></div>
      </div>

     
    </div>
    <div class="routerView">
          <router-view/>  
    </div>

    <footer class="footer mt-5" v-if="$route.path.split('/')[1] !== 'envioInformacion' && $route.path.split('/')[1] !== 'pagoInformacion' && ($route.path.split('/')[1] !== 'pago') && ($route.path.split('/')[1] !== 'compra-exitosa')" >
      <div class="flex justify-between flex-wrap container mx-auto py-5">
        <div class="col-12 col-md-4 pb-4">
          <h4 class="mb-4 text-2xl">Redes sociales</h4>
            <a href="https://www.facebook.com/nomarDev/" target="_blank" class="aSocial"><i class="aSocialIcon fab fa-facebook-square text-3xl"></i></a>
            <a href="https://www.instagram.com/naitsirc_nomar/" target="_blank" class="aSocial"><i class="aSocialIcon fab fa-instagram-square text-3xl ml-3"></i> </a>
        </div>        
        <div class="col-12 col-md-4 py-4 py-md-0">
          <h4 class="mb-4 text-2xl">Politicas</h4>
          <ul class="text-center">
            <li class="my-2">
              <a href=""  class="aSocial">Términos y condiciones</a>
            </li>
            <li class="my-2">
              <a href=""  class="aSocial">Política y privacidad</a>
            </li>
            <li class="my-2">
              <a href=""  class="aSocial">Contacto</a>
            </li>
          </ul>
        </div>

        <div class="col-12 col-md-4 py-4 py-md-0">
          <h4 class="mb-4 text-2xl">Newsletter</h4>
          <p v-if="!token"> ¿Aún no te has registrado?</p>
          <vs-button  flat @click="redirect" class=" " v-if="!token">Sign in</vs-button>
          <p v-else>Bienvenido <strong></strong></p>
        </div>
      </div>
      
    </footer>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import service from './services/adminProducts';

export default {
  data() {
    return {
      activeNav: "home",
      categories: []
    };
  },
  computed: {
    ...mapState(["token","roll", "totalAmount", "isPayment"]),
  },

  methods: {
    ...mapActions(["readToken", "logout"]),

    redirect() {
      if(this.$route.path !== '/login') {
        this.$router.push({name:'Login'})
      }
    },

    getCategories() {
      service.getCategories().then((response) => {
        this.categories = response.data.rows
      })
    },
    capitalize(word) {
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    },
  },
  created() {
    this.readToken();
    this.getCategories()
  },
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
body {
  background-color: #f8f8f8;
}

.spanNumber{
  padding-left: 4px;
  padding-right: 4px;
  padding-top:1px ;
  padding-bottom:1px ;
  position: absolute;
  top: 2px;
}

.footer{
  height: auto;
  color: #444;
  background-color: rgb(233, 233, 233);
}

.aSocial {
  color: #444;

}
.aSocial:hover {
  color:black
}

.aSocialIcon:hover {
  transform: scale(1.2);
  transition: all 500ms;
  color: #026299;
}

.routerView {
  min-height: 650px !important;
}
.color-drop {
  color: #2C3E50;
}
.block-round {
  display: block;
  text-align: center;
  border: 2px solid #444;
  padding: 0.5em;
  border-radius: 1em;
}


</style>
