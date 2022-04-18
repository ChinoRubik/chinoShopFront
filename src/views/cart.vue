<template>
  <div class="w-2/3 container mx-auto mt-32 mb-5">
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
              <vs-button danger icon @click="toggleFavorite(item.product_uuid, userData.uuid)" :key="changed">
                  <i class="fas fa-heart text-xl" v-if="item.isFavorite"></i>
                  <i class="far fa-heart text-xl" v-if="!item.isFavorite"></i>
                </vs-button>
            </template>
            <template #title>
                <h3 class="font-bold">{{item.name}}</h3>
            </template>
 
            <template #text>
                <div class="flex justify-between mt-10">
                  <div>
                    <span class="leading-10">Talla:</span>
                    <v-select v-model="item.size" :options="getSizesAvaible(item)" />
                  </div>
                   <div class="flex ">
                        <p class="leading-10">Cantidad:</p>
                        <vs-input v-model="item.amount" type="number" class="ml-4 inputNumber" min="1"/>
                   </div>
                    <div v-if="item.discount !== 0" class="flex flex-wrap mb-4"> 
                      <span class="w-100">Precio: </span>
                      <div><strong class="text-left"> <del>${{item.price}}.00 MXM</del></strong><span class="ml-2" v-if="item.discount !== 0">${{ item.price - (item.price / 100) * item.discount}}.00 MXM</span></div>
                    </div>
                    <span v-else >Precio: <strong class="block w-100 text-left mb-4"> ${{item.price}} MXM</strong></span>
                   <!-- <p class="leading-10">Precio: $ <span class="font-bold">{{item.price * item.amount}} MXM</span></p> -->
                   
                    <vs-button danger flat @click="activeModalMethod(item)" class="buttonDelete">Quitar del carrito</vs-button>

                </div>
            </template>
          </vs-card>
        
          <div class=" text-right flex justify-end" v-show="showButtom">
            <div>
              <p class="font-bold">Sub total</p>
              <p>$ <span class="font-bold">{{getTotal()}}.00</span> MXM</p>
              <p>Costo de envío se muestran en el checkout</p>
              <p>El Importe final será cobrado en Pesos Mexicanos (MXN)</p>
              <vs-button success @click="proccedPayment" class="buttonSuccess float-right">Continuar</vs-button>
            </div>
          </div>
        </div>
    </div>
    <vs-dialog width="200px" not-center v-model="activeModal">
        <template #header>
          <h4 class="not-margin">
            Estas seguro que quieres eliminar del carrito a <strong>{{itemToDelete.name}}</strong>
          </h4>
        </template>

        <template #footer>
          <div class="con-footer">
            <vs-button @click="deleteFromCart(itemToDelete.product_uuid, itemToDelete.size)"  success>
              Si
            </vs-button>
            <vs-button @click="activeModal=false" danger>
              No
            </vs-button>
          </div>
        </template>
    </vs-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import serviceAuth from '../services/auth';
import adminProducts from '../services/adminProducts'
import vSelect from 'vue-select'

export default {
  data() {
      return {
          userData: {},
          cart: [],
          xd: [],
          cartUpdated: [],
          imagesPath:[],
          products: [],
          showButtom: false,
          activeModal: false,
          itemToDelete: {},
          changed: false,
          loadedPage: []
      }
  },
  components: {
    vSelect
  },

  computed: {
    ...mapState(["totalAmount","token"]),
  },

  created() {
    const loading = this.$vs.loading()
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
    loading.close();
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
        this.cart.map((item) => {
          adminProducts.getImages(item.product_uuid).then((res) => {
              item.image = res.data.rows[0].url
          });
        })  
        this.concateProducts();
        this.getFavorites();
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
            if(item.discount !== 0) {
              total +=  item.price * item.amount;
              total -=  (item.price/100 * item.discount) * item.amount;
            } else {
              total +=  item.price * item.amount;
            }
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
      this.showButtom = true;
    },

    deleteFromCart(product_uuid, size) {
      this.activeModal = false;
      const loading = this.$vs.loading()

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
      loading.close()
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

        //Hay stock
        let theresStockFlag = true;
        this.cartUpdated.map((item) => {
          if(!this.thereStock(item)) {
            this.$vs.notification({
              icon: `<i class="fas fa-exclamation-circle"></i>`,
              color: 'danger',
              position: 'top-right',
              title: 'Ups!',
              text: `No tenemos suficiente STOCK para ${item.name} en la talla ${item.size}`,
            });
            theresStockFlag = false
          }
        });

        if(theresStockFlag) {
          adminProducts.getSale(this.userData.uuid).then((res) => {
            let isIncompleteSale = false
            res.data.rows.map((item) => {
              if(item.isDone === 0) {
                isIncompleteSale = true
                console.log('impossibbble')
              }
            });

            if(res.data.rows.length !== 0 && isIncompleteSale) { 
    
              let uuidSale = null;
              res.data.rows.map((item) => {
                if(item.isDone === 0) {
                  uuidSale = item.uuid;
                }
              });
              const objUpdated = {
                list: JSON.stringify(this.cartUpdated)
              }
              adminProducts.updateSale(uuidSale, objUpdated);  
              this.$router.push({name: 'Checkout', params: {uuid: uuidSale}})
            } else {
              const obj = {
                list: JSON.stringify(this.cartUpdated),
                user_uuid: this.userData.uuid,
                total: 0
              }

              adminProducts.addSale(obj).then((res) => {
                if(res.status === 200) {
                  this.$router.push({name: 'Checkout', params: {uuid: res.data.uuid}})
                }
              })
            }
          })
        }
      }
    },

    thereStock(product) {
      let stock = []
      let isThereStock = true;
      const my_split = product.stock.split('},')
        for(var i = 0; i<my_split.length; i++) {
            if(my_split.length > 1 && i !== my_split.length-1 ) {
              stock.push(JSON.parse(my_split[i]+'}'))
            } else{
              stock.push(JSON.parse(my_split[i]))
            }
        }
      
      stock.map((item) => {
        if(product.size === item.size) {
          if(parseInt(product.amount) > parseInt(item.stock)) {
            isThereStock = false;
          } else {
            isThereStock = true;
          }
        }
      })
      return isThereStock;
    },

    activeModalMethod(item) {
      this.activeModal = true;
      this.itemToDelete = item;
    },

    getFavorites() {
      adminProducts.getFavorites(this.userData.uuid).then((res) => {
        res.data.rows.map((item) => {
          this.cartUpdated.map((product) => {
            if (product.product_uuid === item.product_uuid) {
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
            this.cartUpdated.map((product) => {
              if (product.product_uuid === product_uuid) {
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
            this.cartUpdated.map((product) => {
              if (product.product_uuid === product_uuid) {
                product.isFavorite = true
                this.changed = !this.changed
              }
            });
            adminProducts.addToFavorites(obj).then(() => {})
          }
        });
      }
    },

    getSizesAvaible(item) {
      const sizes = []
      const my_split = item.stock.split('},')
        for(var i = 0; i<my_split.length; i++) {
            if(my_split.length > 1 && i !== my_split.length-1 ) {
              if(parseInt(JSON.parse(my_split[i]+'}').stock) !== 0) {
                sizes.push(JSON.parse(my_split[i]+'}').size)
              }
            } else {
              if(parseInt(JSON.parse(my_split[i]).stock) !== 0) {
                sizes.push(JSON.parse(my_split[i]).size)
              }
            }
        }
      return sizes
    }
  }

  // watch: {
  //   cartUpdated: {
  //     handler: function (val) {
  //       console.log('a thing changed' , val, 'this is old', this.loadedPage)

  //       if (val === this.loadedPage) {
  //         console.log('somos iguales')
  //       } else {
  //         console.log('no somos iguales')
  //       }
  //       this.loadedPage = Object.values(val)
  //     },
  //     deep: true
  //   }

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
    width: 200px;
}
.vs-notification__content__text p{
  font-size: 17px;
}

.vs-notification__content__header h4{
  font-size: 17px;
  font-weight: bold;
}
</style>