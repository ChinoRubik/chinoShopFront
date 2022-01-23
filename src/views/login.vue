<template>
  <div class="flex justify-center mt-36">
    <div class="shadow-lg p-10 rounded-lg bg-white">
      <h1 class="text-left text-2xl">Bienvenido a mi ChinoShop</h1>
      <form @submit.prevent="login(user)">
        <vs-input placeholder="Email" class="my-5 w-100" type="email" v-model="user.email"/>

        <!-- <vs-input v-model="value2" placeholder="Usuario" /> -->

        <vs-input type="password"  placeholder="Password" class="mb-5" v-model="user.password" />
        <vs-button gradient type="submit"> Iniciar</vs-button>
      </form>
      <p class="mt-3">¿Aún no estás registrado? <router-link to="register" class="hover:text-blue-400 pl-1">Crear una cuenta</router-link></p>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
// import authService from "../services/auth";

export default {
  data() {
    return{
      user:{
        email:"",
        password:""
      }
    }
  },

  created() {
 
  },

  methods: {

    ...mapActions(['login']),
    
  }
};
</script>

<style>
.vs-input{
    width: 100% !important;
}
.vs-button {
  width: 100%;
}
</style>