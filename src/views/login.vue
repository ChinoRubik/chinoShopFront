<template>
  <div class="flex justify-center mt-36">
    <div class="shadow-lg p-10 rounded-lg bg-white">
      <h1 class="text-left text-2xl">Bienvenido a mi ChinoShop</h1>
      <form @submit.prevent="login(user)">
        <vs-input placeholder="Email" class="my-5 w-100" type="email" v-model="user.email" required/>

        <!-- <vs-input v-model="value2" placeholder="Usuario" /> -->

        <vs-input type="password"  placeholder="Password" class="mb-5" v-model="user.password" required/>
        <vs-button gradient type="submit"> Iniciar</vs-button>
      </form>
      <p class="mt-3">¿Aún no estás registrado? <router-link to="register" class="hover:text-blue-400 pl-1">Crear una cuenta</router-link></p>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import authService from "../services/auth";

export default {
  data() {
    return{
      user:{
        email:"",
        password:""
      }
    }
  },

  methods: {

    ...mapActions(['settingToken']),

    login(user) {
      authService.login(user).then((res) => {
      
        if(res.status === 200) {
          let name = ''
      
          this.settingToken( res.data.data.token)
          localStorage.setItem('token', res.data.data.token)
            authService.dashboard().then((res) => {
            name = res.data.data.user.name
            this.$vs.notification({
              icon: '<i class="fas fa-sign-in-alt"></i>',
              color: 'success',
              position: 'top-right',
              title:`Bienvenido ${name}`,
              text: 'Has iniciado sesión exitosamente'
          })
          })
          this.$router.push({name:'Home'})

        }

        if(res.status === 400) {
           this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Error',
            text: 'El email o contraseña son incorrectos'
          })
        }
      })
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
.vs-notification__content__text p{
  font-size: 17px;
}

.vs-notification__content__header h4{
  font-size: 17px;
  font-weight: bold;
}
</style>