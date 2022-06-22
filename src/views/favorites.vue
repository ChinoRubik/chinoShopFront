<template>
  <div class="mt-32 container">
    <h1 class="text-3xl font-bold text-center">Favoritos</h1>
    <div v-if="loaded">
        <div class="text-xl mt-4 text-gray-500" v-if="favoritesProducts.length === 0">No tienes ningún favorito</div>
        <div v-else class="mt-3">
            <div v-for="item in favoritesProducts" :key="item.uuid" class="d-flex flex-wrap mb-5 card-favorites">
                <img :src="item.image" alt="image" class="col-12 col-lg-4 img-card-favorites">
        
                <div class="mt-3 col-12 col-lg-8">
                    <h4 class="font-bold text-left">{{item.name}}</h4>
                    <p class="mt-2 text-left mb-4"> {{item.description}}</p> 

                    <div v-if="item.discount !== 0" class="flex flex-wrap mb-4"> 
                        <div  class="text-lg">
                            <strong class="text-left"> <del>${{item.price}}.00 MXM</del></strong><span class="ml-2" v-if="item.discount !== 0">${{ item.price - (item.price / 100) * item.discount}}.00 MXM</span>
                        </div>
                    </div>
                    <span v-else > <strong class="block w-100 text-left mb-2 text-lg mt-4"> ${{item.price}} MXM</strong></span>
                    <a class="text-left block cursor-pointer" @click.prevent="deleteFromFavorites(item.favorite_uuid)">Eliminar de favoritos</a>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import adminProducts from "../services/adminProducts";
import serviceAuth from "../services/auth";

export default {
  data() {
    return {
      userData: {},
      favoritesProducts: [],
      loaded: false
    };
  },

  created() {
    this.getUserData();
  },

  methods: {
    getUserData() {
      serviceAuth.dashboard().then((res) => {
        this.userData = res.data.data.user;

        this.getFavorites();

      });
    },
    getFavorites() {
      const loading = this.$vs.loading()
      adminProducts.getFavorites(this.userData.uuid).then((res) => {
          res.data.rows.map((item) => {
              adminProducts.getProduct(item.product_uuid).then((resProduct) => {
                  adminProducts.getImages(item.product_uuid).then((resImages) => {
                    resProduct.data.rows[0].image = resImages.data.rows[0].url
                     resProduct.data.rows[0].favorite_uuid = item.uuid;
                    this.favoritesProducts.push(resProduct.data.rows[0])
                    this.loaded = true;
                });
              });
          });
          if (res.data.rows.length === 0) {
            this.loaded = true;
          }
          loading.close();
      });
    },

    deleteFromFavorites(favorite_uuid) {
        adminProducts.deleteFromFavorites(favorite_uuid).then(() => {
          this.$vs.notification({
            icon: `<i class="fas fa-sign-in-alt"></i>`,
            color: 'primary',
            position: 'top-center',
            title: 'Listo',
            text: `Se ha eliminado de tus favoritos`,
            classNotification: 'notificationWarn',
            duration: 6000
          });
          this.favoritesProducts = this.favoritesProducts.filter((item) => item.favorite_uuid !== favorite_uuid)
        });
    }
  },
};
</script>

<style>
.card-favorites {
  padding: 1em;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
}
.img-card-favorites {
  display: block;
  border-radius:30px;
  height: 300px;
  object-fit: cover;
}

</style>