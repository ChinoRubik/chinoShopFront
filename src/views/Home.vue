<template>

  <div class="container-lg mx-auto p-5 mt-4">
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
      <h1 class="text-3xl mb-3">Productos jaja</h1>
      <div class="flex justify-evenly flex-wrap">
        <div v-for="item, index in products" :key="item.uuid" class="mb-8 col-12 col-md-6 col-lg-4">
          <div class="text-center" :ref="`spinner${index}`">
            <b-spinner variant="primary" class="mt-5"></b-spinner>
          </div>
          <div>
            <vs-card type="2" :ref="`cartButton${item.uuid}`" class="hidden">
              <template #title>
                <h3 class="font-bold">{{item.name}}</h3>
              </template>
              <template #img class="w-100">

                  <a :href="`detalle/${item.uuid}`"> <img :src="item.image" alt="image" @load="onLoaded(index, `cartButton${item.uuid}`)"></a>

              </template>
              <template #text>
                  <div v-if="item.discount !== 0 && theresStock(item) !== 0" class="flex flex-wrap mb-4"> 
                        <div class="w-100"><span class="font-bold" v-if="item.discount !== 0">${{ item.price - (item.price / 100) * item.discount}}.00</span> <del class="text-gray-300">${{item.price}}.00</del></div>
                    </div>
                    <span class="w-100 font-bold" v-if="item.discount === 0 && theresStock(item) !==0"> ${{item.price}}.00</span>
              </template>
              <template #interactions>
                <div class="flex justify-between w-100">
                  <div class="flex fle" >
                    <span class="text-white bg-red-600 font-bold rounded-xl px-2 absolute -rotate-45 mt-4 ml-n1 block" v-if="item.is_new && theresStock(item) >= 1">
                      <i class="fas fa-star text-yellow-400 mr-1 mt-1 leading-3"></i>
                      Nuevo
                    </span>
                    <span class="text-white bg-black font-bold rounded-xl p-1 m-2 absolute flex" v-if="theresStock(item) === 0">
                      Sin inventario
                    </span>
                  </div>
                  <div class="flex">
                    <vs-button danger icon @click="toggleFavorite(item.uuid, userData.uuid)" :key="changed">
                      <i class="fas fa-heart text-xl" v-if="item.isFavorite"></i>
                      <i class="far fa-heart text-xl" v-if="!item.isFavorite"></i>
                    </vs-button>
                    <vs-button class="btn-chat" shadow primary @click="addToCart(item, `cartButton${item.uuid}`)" v-if="theresStock(item) >= 1">
                        <i class="fas fa-shopping-cart text-lg"></i>
                    </vs-button>
                  </div>
                </div>
              </template>
            </vs-card>
          </div>                              
        </div>
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
      totalStock: 0,
      changed: false
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
        this.getCart();
        this.getFavorites();
      });
    }
    
  },

  methods: {
    ...mapActions(['settingRoll', 'settingTotalAmount']),

    theresStock(product) {
      let stock = 0;
      const my_split = product.stock.split('},')
      for(var i = 0; i<my_split.length; i++) {
        // console.log(my_split[i])
          if(my_split.length > 1 && i !== my_split.length-1 ) {
              stock += parseInt(JSON.parse(my_split[i]+'}').stock);
          } else{
              stock += parseInt(JSON.parse(my_split[i]).stock);
          }
      }
      // console.log(stock, 'no hay stock')
      return(stock)
    },

    addToCart(product, ref) {
      const loading = this.$vs.loading({
        target: this.$refs[ref][0],
        scale: 1.5,
        type: 'circles',
        color: '#fff',
      })
      if(this.token === null) {
        const obj = {
          product_uuid: product.uuid,
          amount: 1,
          size: this.getSizeAvaible(product)
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
          size: this.getSizeAvaible(product),
          product_uuid: product.uuid,
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
      setTimeout(() => {
        loading.close()
      }, 500)
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

    getSizeAvaible(product) {
      const stock = []
      const my_split = product.stock.split('},')
      for(var i = 0; i<my_split.length; i++) {
          if(my_split.length > 1 && i !== my_split.length-1 ) {
              stock.push(JSON.parse(my_split[i]+'}'));
          } else{
              stock.push(JSON.parse(my_split[i]));
          }
      }
      let sizeToReturn = ''
      for (var j = 0; j < stock.length; j++) {
        if(parseInt(stock[j].stock) !== 0) {
          sizeToReturn = stock[j].size;
          break;
        }
      }
      return sizeToReturn
    },

    onLoaded(indexSpinner, indexCard) {
      this.$refs[`spinner${indexSpinner}`][0].classList.add('hidden')
      this.$refs[indexCard][0].$el.classList.remove('hidden')
    },

    getFavorites() {
      adminProducts.getFavorites(this.userData.uuid).then((res) => {
        res.data.rows.map((item) => {
          this.products.map((product) => {
            if (product.uuid === item.product_uuid) {
              product.isFavorite = true
              this.changed = !this.changed
            }
          })
        })
      })
    },

    toggleFavorite(product_uuid, user_uuid) {

      if (this.token === null) {
        this.$vs.notification({
            icon: `<i class="fas fa-sign-in-alt"></i>`,
            color: 'warn',
            position: 'top-right',
            title: 'Ojo',
            text: `Inicia sesión para agregar a favoritos`,
            classNotification: 'notificationWarn',
            duration: 10000
        });
        this.$router.push({name:'Login'});
      } else {
        let existsLike = false
        let uuid = ''
        adminProducts.getFavorites(user_uuid).then((res) => {
          res.data.rows.map((item) =>  {
            if (item.product_uuid === product_uuid) {
              existsLike = true
              uuid = item.uuid
            }
          });

          if (existsLike) {
            this.products.map((product) => {
              if (product.uuid === product_uuid) {
                product.isFavorite = false
                this.changed = !this.changed
              }
            });            
            adminProducts.deleteFromFavorites(uuid).then(() => {})
          } else {
            const obj = {
              user_uuid: user_uuid,
              product_uuid: product_uuid
            }
            this.products.map((product) => {
              if (product.uuid === product_uuid) {
                product.isFavorite = true
                this.changed = !this.changed
              }
            });
            adminProducts.addToFavorites(obj).then(() => {})
          }
        });
      }
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