import { mapActions } from 'vuex';
<template>
  <div class="flex justify-center mt-30">
    <div class="shadow-lg p-10 rounded-lg bg-white">
      <h1 class="text-left text-2xl">Registrarse</h1>

      <form @submit.prevent="submitted">
        <vs-input v-model="user.name" placeholder="Nombres" class="my-5 w-100" type="text" />
        <vs-input v-model="user.lastname" placeholder="Apellidos" class="my-5 w-100" type="text" />
        <vs-input v-model="user.email" placeholder="Email" class="my-5 w-100" type="email" />
        <vs-input v-model="user.password" placeholder="Password" class="my-5 w-100" type="password" />

        <vs-input type="password" v-model="repeat_password" placeholder="Repite Password" class="mb-5"/>
        <vs-button type="submit" gradient>Registrarse</vs-button>
      </form>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {

  data(){
      return{
        user: {
            name:'prueba',
            lastname:'prueba',
            email:'q@q.com',
            password:'12345678',
        },
        repeat_password:'12345678'

      }
  },

  methods: {
      ...mapActions(['register']),


      submitted() {
          if (this.repeat_password == this.user.password) {
              this.register(this.user)
          } else {
              console.log('La contraseña no coincide')
          }
      }
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