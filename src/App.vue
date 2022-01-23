<template>
  <div id="app">
    <div id="nav flex">
      <!-- <router-link to="/login">Login</router-link> |
      <router-link to="/">Home</router-link> -->
      <!-- <button @click="logout">Cerrar sesion</button> -->

      <div class="container mx-auto px-5 mb-16" v-if="token">
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
            <router-link :to="{name: 'Configuracion'}" class="mr-10"> Configuración</router-link>
            <vs-button flat @click="logout" class="block mr-50"
              >Log out</vs-button
            >
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
    ...mapState(["token","roll"]),
  },

  methods: {
    ...mapActions(["readToken", "logout"]),
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


</style>
