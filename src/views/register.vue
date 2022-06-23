<template>
  <div class="flex justify-center mt-32">
    <div class="shadow-lg p-10 rounded-lg bg-white">
      <h1 class="text-left text-2xl">Registrarse</h1>

      <form @submit.prevent="submitted">
        <vs-input v-model="user.name" placeholder="Nombres" class="my-5 w-100" type="text" />
        <vs-input v-model="user.lastname" placeholder="Apellidos" class="my-5 w-100" type="text" />
        <vs-input v-model="user.email" placeholder="Email" class="my-5 w-100" type="email" />
        <vs-input v-model="user.password" placeholder="Password" class="my-5 w-100" type="password" />
        <span class="text-white p-1 bg-green-400 rounded mb-2 block" v-if="user.password === repeat_password && (user.password !== '' && repeat_password !== '')">Las contraseñas coinciden</span>
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
            name:'',
            lastname:'',
            email:'',
            password:'',
        },
        repeat_password:''

      }
  },

  methods: {
      ...mapActions(['register']),


      submitted() {

        if (this.user.name.length === 0 || this.user.lastname.length === 0 || this.user.email.length === 0 || this.user.password === 0) {
          this.$vs.notification({
            icon: '<i class="fas fa-sign-in-alt"></i>',
            color: 'danger',
            position: 'top-right',
            title: 'Error',
            text: 'Los campos no están completos'
          })
        } else if (this.user.password.length < 8) {
          this.$vs.notification({
            icon: '<i class="fas fa-sign-in-alt"></i>',
            color: 'danger',
            position: 'top-right',
            title: 'Error',
            text: 'La contraseña es demasiado corta'
          })
        } else if (this.repeat_password !== this.user.password) {
            this.$vs.notification({
              icon: '<i class="fas fa-sign-in-alt"></i>',
              color: 'danger',
              position: 'top-right',
              title: 'Error',
              text: 'Las contraseñas no coinciden '
            })
          } else {
            this.register(this.user)
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