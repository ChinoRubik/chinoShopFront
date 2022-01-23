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
        <vs-button type="submit" gradient>Guardar</vs-button>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth';

export default {
  data() {
    return {
      user: {
        name: "",
        lastname: "",
        email: "",
        password: "",
      },
    };
  },

  created() {
      authService.dashboard().then((res) => {
          this.user = res.data.data.user
      })
  }
};
</script>