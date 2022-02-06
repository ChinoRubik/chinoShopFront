<template>

  <div class="container mx-auto p-5 ">
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

    <div class="w-100  mt-10">
      <h1 class="text-3xl mb-5">Productos
</h1>
      <div class="flex justify-evenly flex-wrap">
        <vs-card type="2" v-for="item in products" :key="item.uuid" class="mb-8 w-100 sm:w-80">
            <template #title>
              <h3 class="font-bold">{{item.name}}</h3>
            </template>
            <template #img class="w-100">
              <a :href="`detalle/${item.uuid}`"> <img :src="item.image" alt="image"></a>
          
            </template>
            <template #text>
              <p>
                {{item.description}}
              </p>
            </template>
            <template #interactions>
              <div clasS="flex -rotate-45">
                <span class="text-white bg-red-600 font-bold rounded-xl px-2 absolute flex isNew" v-if="item.is_new">
                  <i class="fas fa-star text-yellow-400 mr-1 mt-1 leading-3"></i>
                  <p class="">Nuevo</p>
                </span>
              </div>

              <div class="flex">
                <vs-button danger icon>
                  <i class="far fa-heart text-xl"></i>
                </vs-button>
                <vs-button class="btn-chat" shadow primary @click="addToCart(item.uuid, item.size)">
                    <i class="fas fa-shopping-cart text-lg"></i>
                </vs-button>
              </div>
            </template>
      </vs-card>
    </div>


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
      userData: {},
    }
  },

  computed: {
    ...mapState(['token'])
  },

  created() {
    adminProducts.getProducts().then((res) => {
      res.data.rows.map((item) => {
        adminProducts.getImages(item.uuid).then((res) => {
          item.image = res.data.rows[0].url;
        });
        this.products.push(item)
      });
    });

    if(this.token === null) {
      
      if(!localStorage.getItem('cartTemp')) {
        localStorage.setItem('cartTemp', JSON.stringify([]))
      }
    } else {
      serviceAuth.dashboard().then(res => {
        this.userData = res.data.data.user;
        this.settingRoll(res.data.data.user.roll);
        this.addToCartPrevent();
        this.getCart()
      });
    }
  },

  methods: {
    ...mapActions(['settingRoll', 'settingTotalAmount']),

    addToCart(product_uuid, sizes) {

      if(this.token === null) {
        const obj = {
          product_uuid: product_uuid,
          amount: 1,
          size: this.getSize(sizes)
        }
        let list = JSON.parse(localStorage.getItem('cartTemp'))
        list.push(obj)
        localStorage.setItem('cartTemp', JSON.stringify(list))
        this.$vs.notification({
            color: 'success',
            position: 'buttom-right',
            title:'Producto agregado',
            text: 'El producto ha sido agregado al carrito'
        })
        this.getCartPublic()
      } else {
      const obj = {
        size: this.getSize(sizes),
        product_uuid: product_uuid,
        user_uuid: this.userData.uuid
      }
      adminProducts.addToCart(obj).then((res) => {
        if(res.status === 200) {
          this.$vs.notification({
              color: 'success',
              position: 'buttom-right',
              title:'Producto agregado',
              text: 'El producto ha sido agregado al carrito'
          })

          this.getCart();
        } else {
          this.$vs.notification({
              color: 'danger',
              position: 'buttom-right',
              title:'Error',
              text: 'Hubo un error al agregar al carrito'
          })
        }
      });
      }


    },

    getCart() {
      adminProducts.getCart(this.userData.uuid).then((res) => {
        let total = 0
        res.data.rows.map((item) => {
          total+=item.amount
        })
        this.settingTotalAmount(total)
      });
    },

    getCartPublic() {
        const list =JSON.parse(localStorage.getItem('cartTemp'))
        let total = 0
        list.map((item) => {
          total+= item.amount
        });
        this.settingTotalAmount(total)
    },

    addToCartPrevent() {
      let list = Object.assign([],JSON.parse((localStorage.getItem('cartTemp')))) 

      list.map((item) => {
        const obj = {
          product_uuid: item.product_uuid,
          user_uuid: this.userData.uuid,
          amount: item.amount,
          size: item.size
        }
        adminProducts.addToCart(obj).then(() => {
        })
      })
      localStorage.removeItem('cartTemp')
    },

    getSize(sizes) {
      return sizes.split(',')[0]
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
.vs-card-content{
  /* width: 100%; */
}

.vs-card, .vs-card-content.type-2 .vs-card__text{
  height: auto;
  max-width: 100%;
  width: 100%;
}

.vs-card__img {
    width: 100%;
}

.vs-card__interactions {
  padding: 5px 5px 0px 0px;
  width: 100%;
  justify-content: space-between;
}


</style>