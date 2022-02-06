<template>
  <div class="w-2/3 container mx-auto mt-32 ">
    <div class="">  
        <h1 class="text-3xl font-bold text-center">Tu Carrito</h1>
        <div v-if="totalAmount === 0" class="text-xl mt-5 text-gray-500">
            No tienes nada en el carrito aún
        </div>

        <div v-else class="mt-5">
          <vs-card type="3" v-for="item in cartUpdated" :key="item.uuid" class="mb-5">
            <template #img >
                <img :src="item.image" alt="image" >
            </template>
            <template #interactions>
                <vs-button danger icon>
                    <i class='bx bx-heart'></i>
                </vs-button>
            </template>
            <template #title>
                <h3 class="font-bold">{{item.name}}</h3>
            </template>
 
            <template #text>
                <div class="flex justify-between mt-10">
                   <p class="leading-10">Talla: <span class="font-bold">{{item.size}}</span></p>
                   <div class="flex ">
                        <p class="leading-10">Cantidad:</p>
                        <vs-input v-model="item.amount" type="number" class="ml-4 inputNumber" min="1"/>
                   </div>
                   <p class="leading-10">Precio: $ <span class="font-bold">{{item.price * item.amount}} MXM</span></p>
                   
                    <vs-button danger flat @click.prevent="deleteFromCart(item.product_uuid, item.size)" class="buttonDelete">Quitar del carrito</vs-button>

                </div>
            </template>
          </vs-card>
        
          <div class="w-100 mt-10 text-right">
              <p class="font-bold">Sub total</p>
              <p>$ <span class="font-bold">{{getTotal()}}</span> MXM</p>
              <p>Costo de envío se muestran en el checkout</p>
              <p>El Importe final será cobrado en Pesos Mexicanos (MXN)</p>

              <vs-button success @click="proccedPayment"   class="buttonSuccess ">Continuar</vs-button>
              <!-- <vs-button    class="buttonSuccess ">Actualizar</vs-button> -->

          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import serviceAuth from '../services/auth';
import adminProducts from '../services/adminProducts'
import config from '../services/config'


export default {
  data() {
      return {
          config,
          userData: {},
          cart: [],
          xd: [],
          cartUpdated: [],
          imagesPath:[],
          products: []
      }
  },

  computed: {
    ...mapState(["totalAmount","token"]),
  },

  created() {

    if(this.token === null) {
      console.log('no logueado')
      adminProducts.getProducts().then((res) => {
        res.data.rows.map((item) => {
          this.products.push(item)
        });
      this.getCartPublic();
      })

    } else {
      this.getUserData();
    }
  },
  
  methods: {

    ...mapActions(['settingTotalAmount']),

    getUserData() {
        serviceAuth.dashboard().then(res => {
        this.userData = res.data.data.user;
        this.getCart()
    });
    },

    getCart() {
        adminProducts.getCart(this.userData.uuid).then((res) => {
        this.cart = res.data.rows;
            console.log(this.cart)

        this.concateProducts()
        });
    },

    getCartPublic() {
      let list = Object.assign([],JSON.parse((localStorage.getItem('cartTemp'))) ) 
      for(var i =0 ;i<list.length ;i++) {
        
          this.products.map((item) => {
            if(item.uuid === list[i].product_uuid) {
              list[i].category_uuid = item.category_uuid;    
              list[i].description = item.description;
              list[i].discount = item.discount;
              list[i].image = item.image;
              list[i].is_new = item.is_new;
              list[i].name = item.name;
              list[i].price = item.price;
              list[i].stock = item.stock;        
            }
          })
      }

      this.cart = list
      this.cart.map((item) => {
        adminProducts.getImages(item.product_uuid).then((res) => {
            item.image = res.data.rows[0].url
        });
      })
      this.concateProducts()
    },

    getTotal() {
        let total = 0
        this.cartUpdated.map((item) => {
            total+= item.amount * item.price;
        })
        return total
    },

    concateProducts() {
      
      for(var i = 0 ; i < this.cart.length; i++) {
        let not_exists = true;
        if( i===0 ) {
         this.cartUpdated.push(this.cart[i])
         continue
        }
         for(var j = 0 ; j < this.cartUpdated.length; j++) {
            if(this.cartUpdated[j].product_uuid === this.cart[i].product_uuid && this.cartUpdated[j].size === this.cart[i].size) {
              not_exists = false
            }
         }

        if(not_exists) {
          this.cartUpdated.push(this.cart[i])
        } else {
          this.cartUpdated.map((item) => {
            if(item.product_uuid === this.cart[i].product_uuid && item.size === this.cart[i].size) {
              item.amount+=this.cart[i].amount;
            }
          })
        }
      }
    },

    deleteFromCart(product_uuid, size) {

      if(this.token === null) {

        const rest = []
        this.cartUpdated.map((item) => {
          if(item.product_uuid === product_uuid && item.size == size) {
            amountToDelete+=item.amount
          } else{
            rest.push(item)
          }
        }) 
        this.cartUpdated = rest;
        localStorage.setItem('cartTemp',JSON.stringify(rest))
        let list = Object.assign([],JSON.parse((localStorage.getItem('cartTemp')))) 
        let amountToDelete = 0

        list.map((item) => {
          amountToDelete+= item.amount
        })
        this.settingTotalAmount(amountToDelete)
        this.$vs.notification({
                icon: `<i class="fas fa-trash-alt"></i>`,
                color: 'success',
                position: 'top-center',
                title: 'Eliminado',
                text: `Ha sido eliminado del carrito`
              })
      } else {
        adminProducts.deleteFromCart(product_uuid, size).then((res) => {
          if(res.status === 200) {
            this.$vs.notification({
                icon: `<i class="fas fa-trash-alt"></i>`,
                color: 'success',
                position: 'top-center',
                title: 'Eliminado',
                text: `Ha sido eliminado del carrito`
              })
            const rest = []
            this.cartUpdated.map((item) => {
              if(item.product_uuid === product_uuid && item.size == size) {
                console.log()
              } else{
                rest.push(item)
              }
            }) 
            this.cartUpdated = rest;
            this.getCartNumber()
          }

        })
      }

    },
    
    getCartNumber() {
      adminProducts.getCart(this.userData.uuid).then((res) => {
        let total = 0
        res.data.rows.map((item) => {
          total+=item.amount
        })
        this.settingTotalAmount(total)
      });
    },

    proccedPayment() {

      if(this.token === null) {
        this.$vs.notification({
            icon: `<i class="fas fa-sign-in-alt"></i>`,
            color: 'warn',
            position: 'top-right',
            title: 'Cuidado',
            text: `Te has olvidado de iniciar sesión para poder comprar`,
            classNotification: 'notificationWarn',
            duration: 10000

        })
        this.$router.push({name:'Login'})
      } else {
        console.log(this.cartUpdated)

      }
    }

  },


}
</script>

<style>
.vs-card-content.type-3 .vs-card{
  height: auto;
  max-width: 100%;
  width: 100%;
}
.vs-card__img {
    width: 30%;
}

.vs-card__text{
    width: 70%;
}

.inputNumber{
    width: 30%;
}

.buttonDelete, .buttonSuccess{
    width: 20%;
}

.buttonSuccess{
    float: right;
    margin-top:18px ;
}
.vs-notification__content__text p{
  font-size: 17px;
}

.vs-notification__content__header h4{
  font-size: 17px;
  font-weight: bold;
}
</style>