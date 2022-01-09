<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{token}}
  </div>
</template>

<script>
import {mapState} from 'vuex'
import auth_service from '../services/auth'

export default {
  computed: {
    ...mapState(['token'])
  },

  created() {
    auth_service.dashboard(this.token).then((res) => {
      console.log(res)
    })

  }
}
</script>