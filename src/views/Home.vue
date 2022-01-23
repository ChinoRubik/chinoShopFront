<template>

  <div class="flex justify-between container mx-auto	  ">
<!-- 
    <div class="bg-white rounded-lg w-1/4 m-10">
      <ul>
        <li><a href="">Gorras</a></li>
        <li><a href="">Sudaderas </a></li>
        <li><a href="">Playeras</a></li>
        <li><a href="">Chamarras</a></li>
        <li><a href="">Todos los productos</a></li>

      </ul>
    </div> -->

    <div class="w-100  mt-20">
      <h1 class="text-3xl mb-5">Productos</h1>
      <vs-card type="2" v-for="item in products" :key="item.uuid" class="w-1/4 float-left mb-4">
          <template #title>
            <h3 class="font-bold">{{item.name}}</h3>
          </template>
          <template #img>
            <a :href="`detalle/${item.uuid}`"> <img :src="`${config.api_route}auth/getImages/${getOneImage(item.image)}`" alt=""></a>
         
          </template>
          <template #text>
            <p>
              {{item.description}}
            </p>
          </template>
          <template #interactions>
            <vs-button danger icon>
              <i class="far fa-heart text-xl"></i>
            </vs-button>
            <vs-button class="btn-chat" shadow primary>
                <i class="fas fa-shopping-cart text-lg"></i>
            </vs-button>
          </template>
    </vs-card>


    </div>

  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import adminProducts from '../services/adminProducts'
import config from '../services/config'
import serviceAuth from '../services/auth';

export default {
  data() {
    return {
      config,
      active: 'home',
      products: [],
      userData: {}
    }
  },

  computed: {
    ...mapState(['token'])
  },

  beforeCreate() {
    adminProducts.getProducts().then((res) => {
      res.data.rows.map((item) => {
        this.products.push(item)
      });
    });
    serviceAuth.dashboard().then(res => {
      this.userData = res.data.data.user;
      this.settingRoll(res.data.data.user.roll);
    })
  },

  methods: {
    ...mapActions(['settingRoll']),

    getOneImage(path) {
      return path.split(',')[0]
    }
  }
}
</script>

<style>
.vs-sidebar-content, .open {
  /* position: absolute; */
  /* height: auto; */
  /* top: 80px; */
  display: block;
  /* z-index: 0; */
}

.vs-sidebar {
  /* height: 200px; */
}
.vs-card-content.type-2 .vs-card__text{
  width: 100%;
}
</style>