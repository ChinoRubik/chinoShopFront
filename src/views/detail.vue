<template>
  <div class="w-2/3 container mx-auto mt-32 ">
    <div class="flex ">  
        <div class="w-2/6">
            <carousel class="carousel " :perPage="1" >
            <slide v-for="item in images" :key="item"> <img :src="`${config.api_route}auth/getImages/${item}`" class="slide rounded-xl shadow-xl mx-5 mb-10" /></slide>
            </carousel>
        </div>
        <div class="bg-white w-4/6 px-10 py-2 rounded-xl shadow-lg">

            <h2 class="font-bold text-2xl text-left">{{product.name}}</h2>
            <p class="text-left text-gray-500 mb-5 text-md"> {{ getCategory(product.category_uuid) }}</p>
            <p class="font-bold text-2xl text-left mb-5"> $ {{product.price}} MXM</p>
            <form class="flex mb-5">
                <div class="select mr-5">
                    <label class="text-left block">Talla:</label>
                    <vs-select placeholder="Talla" v-model="size" >
                        <vs-option label="Chico" value="s"> Chico</vs-option>
                        <vs-option label="Mediano" value="m"> Mediano</vs-option>
                        <vs-option label="Grande" value="l"> Grande</vs-option>
                    </vs-select>
                </div>
                <div  class="inputNumber">
                    <label class="text-left block">Cantidad:</label>
                    <vs-input v-model="amount" type="number"/>
                </div>

            </form>                
            <vs-button @click="submitted(product.uuid)" success class="block w-1/2 buttonAdd">Agregar al carrito</vs-button>
            <p for="descripcion" class="font-bold text-2xl text-left mt-10">Descripción:</p>
            <p class="text-left text-gray-500 mb-5 text-md">{{product.description}}</p>

            <p for="descripcion" class="font-bold text-2xl text-left mt-10">Cambios y devoluciones:</p>
            <p class="text-justify my-2 ">Al hacer tu compra en línea tienes 30 días naturales a partir de que se genere tu pedido para solicitar un cambio.
                Por el momento no realizamos devoluciones. Para más información consulta nuestros términos y condiciones
            </p>
        </div>
    </div>
  </div>
</template>

<script>
import serviceAuth from "../services/auth";
import adminProducts from "../services/adminProducts";
import { Carousel, Slide } from "vue-carousel";
import config from "../services/config";
import {mapActions, mapState} from 'vuex'

export default {
  data() {
      return {
          config,
          product:{},
          images: [],
          categories: [],
          size: '',
          amount: 1,
          userData: {}
      }
  },

  computed: {
    ...mapState(["token"]),
  },

  components: {
    Carousel,
    Slide,
  },

  created() {
    adminProducts.getProduct(this.$route.params.uuid).then((res) => {
      this.product = res.data.rows[0]
      this.getImages(this.product.image)
    });

    adminProducts.getCategories().then((res) => {
        this.categories = res.data.rows;
    });

    if(this.token === null) {
      console.log('no logueado')
    } else {
      serviceAuth.dashboard().then(res => {
      this.userData = res.data.data.user;
      });
    }
  },

  methods: {
      ...mapActions(['settingTotalAmount']),


      getImages(images) {
          this.images = images.split(',')
      },

      getCategory(uuid) {
        let category = ''
        this.categories.map((item) => {
            
            if(uuid === item.uuid) {
                category = item.category
            }
        })
        return category
      },

      submitted(product_uuid) {
          if(this.token === null) {
            const obj = {
              product_uuid: product_uuid,
              amount: parseInt(this.amount),
              size: this.size
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
                product_uuid: product_uuid,
                user_uuid: this.userData.uuid,
                size: this.size,
                amount: this.amount
            }
            adminProducts.addToCart(obj).then((res) => {
              if(res.status === 200) {
                  this.$vs.notification({
                      color: 'success',
                      position: 'buttom-right',
                      title:'Producto agregado',
                      text: 'El producto ha sido agregado al carrito'
                  })
                  this.getCart()
              }
            })
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
          total+= parseInt(item.amount,10)
        });
        this.settingTotalAmount(total)
    }
  }
};
</script>

<style>
.VueCarousel-pagination{
    margin-top: -4rem;
    background-color: transparent;
}


.slide{
    width: 80%;
    height: 400px;
    object-fit: cover;
}

.buttonAdd{
    width: 30%;
}

.inputNumber{
    width: 10%;
}

.select{
    width: 20%;
}
</style>