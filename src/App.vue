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
          <vs-navbar-item :active="activeNav == 'guide'" id="guide">
            Gorras
          </vs-navbar-item>
          <vs-navbar-item :active="activeNav == 'docs'" id="docs">
            Sudaderas
          </vs-navbar-item>
          <vs-navbar-item :active="activeNav == 'components'" id="components">
            Playeras
          </vs-navbar-item>
          <vs-navbar-item :active="activeNav == 'license'" id="license">
            Chamarras 
          </vs-navbar-item>
          <template #right class="">
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
      activeNav: "guide",
    };
  },

  computed: {
    ...mapState(["token"]),
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
