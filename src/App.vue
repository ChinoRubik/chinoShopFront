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
        >
          <template #left>
            <h1>ChinoShop</h1>
          </template>
          <!-- <vs-navbar-item :active="activeNav == 'home'" id="home"> -->
            <!-- <router-link :to="{name: 'Home'}" class="mx-5">Home</router-link> -->
            <router-link :to="{name: 'Home'}" custom v-slot="{ navigate }">
              <span @click="navigate" @keypress.enter="navigate" role="link" class="pr-4 hover:cursor-pointer">Home</span>
          </router-link>
          <!-- </vs-navbar-item> -->
          <!-- <vs-navbar-item :active="activeNav == 'docs'" id="docs">
            Sudaderas
          </vs-navbar-item>
          <vs-navbar-item :active="activeNav == 'components'" id="components">
            Playeras
          </vs-navbar-item>
          <vs-navbar-item :active="activeNav == 'license'" id="license">
            Chamarras 
          </vs-navbar-item> -->
          <!-- <vs-navbar-item :active="activeNav == 'administrador'" id="administrador"  v-if="roll === 'admin'"> -->
          <!-- <router-link :to="{name: 'Administrador'}" v-if="roll === 'admin'" > Administrador</router-link> -->
          <router-link :to="{name: 'Administrador'}" custom v-slot="{ navigate }" v-if="roll === 'admin'" >
              <span @click="navigate" @keypress.enter="navigate" role="link" class="pr-4 hover:cursor-pointer">Administrador</span>
          </router-link>
          <!-- </vs-navbar-item> -->
          <template #right class="">
            <div class="">
              <a href="/carrito"> 
                  <span class="bg-black font-bold text-white spanNumber rounded text-sm" >{{totalAmount}}</span>
                <img src="./assets/shopping-cart.png" class="w-8 mr-14" v-if="token"/>
                <img src="./assets/shopping-cart.png" class="w-8 mr-14" v-else/>

              </a>  
            </div>                          
            <a href="/configuracion" class="mr-10" v-if="token"> <i class="fas fa-user text-3xl"></i></a>
            <vs-button success flat @click="redirect" v-if="!token">Sign in</vs-button>
            <vs-button  flat @click="logout" class="" v-if="token">Log out</vs-button>
          </template>
        </vs-navbar>
      
        <div id="padding-scroll-content" class="square"></div>
      </div>

     
    </div>
    <router-view />  

    <footer class="footer mt-5" v-if="$route.path.split('/')[1] !== 'pagoInformacion' && ($route.path.split('/')[1] !== 'pago') && ($route.path.split('/')[1] !== 'compra-exitosa')" >
      <div class="flex justify-between flex-wrap container mx-auto py-5">
        <div>
          <h4 class="mb-4">Redes sociales</h4>
            <a href="" class="aSocial"><i class="aSocialIcon fab fa-facebook-square text-3xl"></i></a>
            <a href="" class="aSocial"><i class="aSocialIcon fab fa-instagram-square text-3xl ml-3"></i> </a>
          </div>        
        <div>
          <h4 class="mb-4">Politicas</h4>
          <ul class="text-left">
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

        <div>
          <h4 class="mb-4">Newsletter</h4>
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

export default {
  data() {
    return {
      activeNav: "home",
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
    }
  },
  created() {
    this.readToken();
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
  top: -2px;
  
}

.footer{
  height: 300px;
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

</style>
