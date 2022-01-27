<template>
  <div id="app">
    <div id="nav flex">
      <!-- <router-link to="/login">Login</router-link> |
      <router-link to="/">Home</router-link> -->
      <!-- <button @click="logout">Cerrar sesion</button> -->

      <div class="container mx-auto px-5 mb-16" >
        <vs-navbar
          target-scroll="#padding-scroll-content"
          padding-scroll
          center-collapsed
          v-model="activeNav"
        >
          <template #left>
            <h1>ChinoShop</h1>
          </template>
          <!-- <vs-navbar-item :active="activeNav == 'home'" id="home"> -->
            <router-link :to="{name: 'Home'}" class="mx-5">Home</router-link>
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
          <router-link :to="{name: 'Administrador'}" v-if="roll === 'admin'" > Administrador</router-link>

          <!-- </vs-navbar-item> -->
          <template #right class="">
            <div class="">
              <a href="/carrito"> 
                  <span class="bg-black font-bold text-white spanNumber rounded text-sm" >{{totalAmount}}</span>
                <img src="./assets/shopping-cart.png" class="w-8 mr-14" v-if="token"/>
                <img src="./assets/shopping-cart.png" class="w-8 mr-14" v-else/>

              </a>  
            </div>                          
            <a href="/configuracion" class="mr-10" v-if="token"> Configuración</a>
            <vs-button success flat @click="redirect" class=" " v-if="!token">Sign in</vs-button>
            <vs-button  flat @click="logout" class="" v-if="token">Log out</vs-button>
          </template>
        </vs-navbar>
        <div id="padding-scroll-content" class="square"></div>
      </div>

     
    </div>
    <router-view />  
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
    ...mapState(["token","roll", "totalAmount"]),
  },

  methods: {
    ...mapActions(["readToken", "logout"]),

    redirect() {
      this.$router.push({name:'Login'})
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


</style>
