<template>
  <div class="flex flex-wrap container">
    <div class="col-7">
      <Breadcrumb :activeArray="activeArray"></Breadcrumb>
      <div class="px-3">
        <h4 class="">Pagos</h4>
        
        <b-list-group>
     
   
            <b-list-group-item class="text-left p-0" ref="groupItem0" button  @click="selectRadio(0)">
                <span class="block p-4">Paypal</span>
                <b-collapse id="collapse-1" class="pb-n4" v-model="active[0]" :key="changed">
                    <b-card class="text-center">
                        <span class="w-100 block mb-2 text-gray-500">Conecta con PayPal para continuar</span>    
                        <b-button class="buttonPaypal"><img src="./../assets/payPal.svg" alt=""></b-button>
                    </b-card>
                </b-collapse>
            </b-list-group-item>
            <b-list-group-item class="text-left p-0" ref="groupItem1" button @click="selectRadio(1)">
                <span class="block p-4">Pago con tarjeta de crédito y débito</span>
                <b-collapse id="collapse-2" class="mt-2" v-model="active[1]">
                    <b-card class="text-gray-500">Después de hacer clic en “Pagar ahora”, se te redirigirá a Pago con tarjeta de crédito y débito para completar tu compra de forma segura.</b-card>
                </b-collapse>
            </b-list-group-item>

        </b-list-group>

        <b-button variant="outline-primary mt-3 block float-left" @click="submitted">Pagar ahora</b-button
        >
      </div>
    </div>
    <SideCart class="bg-gray-100 col-5 p-5" v-on:getTotalFromSide="getTotal" v-on:getProductsFromSide="getProducts"></SideCart>
  </div>
</template>

<script>
import SideCart from "../components/sideCart.vue";
import adminProducts from "../services/adminProducts";
import authService from "../services/auth";
import Breadcrumb from "../components/breadcrumb.vue";


export default {
  data() {
    return {
      activeArray: [false, false],
      user: {},
      address: {},
      active: [false, false],
      changed: false,
      total: 0,
      products: null
    };
  },

  components: {
    SideCart,
    Breadcrumb,
  },
  created() {
    this.existsUuidSale();
    this.getUserData();
    this.getAddress();
  },

  methods: {
    existsUuidSale() {
      adminProducts.getSaleByUuid(this.$route.params.uuid).then((res) => {
        if(res.data.rows.length === 0) {
          this.$router.push({name: 'NotFound', params:{pathMatch2: this.$route.params.uuid, pathMatch: 'pago'}})
        }
      })
    },

    getAddress() {
      adminProducts.getAddress(this.$route.params.uuid).then((res) => {
        if (res.data.rows.length === 1) {
          this.address = res.data.rows[0];
        } 
      });
    },

    getUserData() {
      authService.dashboard().then((res) => {
        if(res.status ===200) {
          this.user = res.data.data.user;
        }
      });
    },

    selectRadio(index) {

      this.changed = !this.changed;

      if(index === 0) {
        this.active[index] = !this.active[index]
        this.active[1] = false;
        this.$refs.groupItem1.classList.remove('backGroundBlue');
        if(this.$refs.groupItem0.classList.contains('backGroundBlue')){
          this.$refs.groupItem0.classList.remove('backGroundBlue');
        } else {
          this.$refs.groupItem0.classList.add('backGroundBlue');
        }

      } else {

        this.active[index] = !this.active[index]
        this.active[0] = false;
        this.$refs.groupItem0.classList.remove('backGroundBlue');
        if(this.$refs.groupItem1.classList.contains('backGroundBlue')){
          this.$refs.groupItem1.classList.remove('backGroundBlue');
        } else {
          this.$refs.groupItem1.classList.add('backGroundBlue');
        }
      }
     
    },

    getTotal(data) {
      this.total = data;
    },

    getProducts(data) {
      this.products = data;
    },
    submitted() {
      let selectedPayment = 0
      this.active.map((item) => {
        if(item === false) {
          selectedPayment += 1;
        }
      })

      if(selectedPayment === 2) {
        this.$vs.notification({
          icon: '<i class="fas fa-times-circle"></i>',
          color: 'danger',
          position: 'top-right',
          title:'Selecciona un pago',
          text: 'Escoge una forma de pago'
        })

      } else {

        this.products.map((item) => {
          console.log(item)
          let stock = []
          const my_split = item.stock.split('},')
          for(var i = 0; i<my_split.length; i++) {
            if(my_split.length > 1 && i !== my_split.length-1 ) {
              stock.push(JSON.parse(my_split[i]+'}'))
            } else{
              stock.push(JSON.parse(my_split[i]))
            }
          }
          stock.map((itemStock) => {
            if (itemStock.size === item.size) {
              itemStock.stock -= item.amount
            }
          })
          let newStock  = []
          stock.map((item) => {
            newStock.push(JSON.stringify(item))
          })
          const obj = {
            stock: newStock.toString()
          }
          adminProducts.updateProduct(obj, item.product_uuid)
        })
        const objUpdated = {
          isDone: true,
          total: this.total
        } 

        adminProducts.updateSale(this.$route.params.uuid, objUpdated).then(() => {
          adminProducts.deleteAllCart(this.user.uuid).then((res) => {
            if (res.status === 200) {
              this.$router.push({name: 'Bought', params: { uuid: this.$route.params.uuid }})
            }
            console.log(res)
          })
        })

      }

    }
  },
};
</script>

<style>
.buttonPaypal {
    background-color: #ffc439 !important;
}
.buttonPaypal:hover {
    background-color: #ffc439c7 !important;
}
.custom-control-label {
  width: 100%;
  padding: 15px;
  cursor: pointer;
}
input[type="radio"]{
  /* display: block; */
  /* top: 25px !important */
  /* padding: 15px; */
  /* margin-top: 5rem !important; */
}
.custom-radio {
  /* top: 10px !important */
}
.custom-control-label::before{
  display: block;
  top: 1rem !important;
}
.custom-control-label::after {
  top: 1rem !important;
}
.backGroundBlue {
  background-color: #007bff !important; 
  color: white !important
}
</style>