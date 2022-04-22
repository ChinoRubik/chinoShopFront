<template>
  <div class="flex justify-center mt-32">
    <div class="shadow-lg p-10 rounded-lg bg-white">
      <h1 class="text-left text-2xl mb-5">Configuración</h1>

      <form @click.prevent="submitted">
        <label for="name" class="w-100 text-left block " v-if="user.name != ''">Nombre: </label>
        <vs-input
          v-model="user.name"
          placeholder="Nombres"
          class="mb-5 w-100"
          type="text"
          id="name"
        />
        <label for="lastname" class="w-100 text-left block " v-if="user.lastname != ''">Apellidos: </label>
        <vs-input
          v-model="user.lastname"
          placeholder="Apellidos"
          class="mb-5 w-100"
          type="text"
          id="lastname"

        />
        <label for="email" class="w-100 text-left block " v-if="user.email != ''">Email: </label>

        <vs-input
          v-model="user.email"
          placeholder="Email"
          class="mb-5 w-100"
          type="email"
          id="email"
          disabled
        />
        <!-- <vs-input
          v-model="user.password"
          placeholder="Password"
          class="my-5 w-100"
          type="password"
        /> -->
        <vs-button gradient >Guardar</vs-button>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth';
import userServices from '../services/userServices'

export default {
  data() {
    return {
      user: {
        uuid: '',
        name: "",
        lastname: "",
        email: "",
      },
    };
  },

  created() {
      authService.dashboard().then((res) => {
          this.user.uuid = res.data.data.user.uuid
          this.user.name = res.data.data.user.name
          this.user.lastname = res.data.data.user.lastname
          this.user.email = res.data.data.user.email
      })
  },

  methods: {
    submitted() {
      const loading = this.$vs.loading()
      userServices.updateUser(this.user, this.user.uuid).then((res) => {
        if (res.status === 200) {
          this.$vs.notification({
            color: 'success',
            position: 'buttom-right',
            title:'Los datos han sido actualizados',
            text: 'Los cambios se reflejarerán en el proximo inicio de sesión',
            duration: 7000
          })
          loading.close();
        }
      })
    }
  }
};
</script>
<style>
.vs-notification__content__text p{
  font-size: 17px;
}
.vs-notification__content__header h4{
  font-size: 17px;
  font-weight: bold;
}
</style>