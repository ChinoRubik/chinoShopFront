<template>
    <div> 
        <div v-for="item in dataPayment" :key="item.uuid">
            <div class="my-3 flex justify-between">
                <div>
                <span class="bg-black font-bold text-white spanNumberR rounded-full text-sm block relative" >{{item.amount}}</span>
                <img :src="item.image" alt="" class="imgCart rounded border">
                </div>
                <div class="p-3">
                <strong class="w-100 block">{{item.name}}</strong>
                <span class="text-gray-500">{{item.size}}</span>
                </div>
                <div class="p-3">
                    <div v-if="item.discount !== 0" class="flex flex-wrap"> 
                        <strong class="w-100"> <del>${{item.price}}.00</del></strong>
                        <span class="w-100" v-if="item.discount !== 0">${{ item.price - (item.price / 100) * item.discount}}.00</span>
                    </div>
                    <strong v-else> ${{item.price}}</strong>

                </div>
            </div>
            </div>
                <hr class="mt-3">
                <div>
                <div class="flex justify-between">
                    <p>Subtotal</p>
                    <strong>${{subTotal}}.00</strong>
                </div>

                <div class="flex justify-between">
                    <p>Descuento</p>
                    <strong>- ${{totalDiscount}}.00</strong>
                </div>

                <div class="flex justify-between">
                    <p>Envíos</p>
                    <strong>${{shipping}}.00</strong>
                </div>
                </div>
                <hr class="mt-3">
                <div>
                <div class="flex justify-between">
                    <div class="">
                    <span class="text-lg w-100 block text-left">Total</span>
                    <span class="text-gray-400 text-sm">Incluye impuestos</span>

                    </div>
                    <strong>${{total}}.00</strong>
                </div>
            </div>
    </div> 

</template>

<script>
import adminProducts from '../services/adminProducts'
import authService from '../services/auth'

export default {
  data() {
      return {
          total: 0,
          shipping: 120,
          totalDiscount: 0,
          subTotal: 0,
          user: {},
          dataPayment: {}
      }
  },

  computed: {
  },

  created() {
    this.getUserData();

  },

  methods: { 

    getPayment() {
        adminProducts.getSaleByUuid(this.$route.params.uuid).then((res) => {
       
           this.dataPayment = JSON.parse(res.data.rows[0].list)
           this.getTotal();

       })
    },

    getUserData() {
      authService.dashboard().then((res) => {
        if(res.status ===200) {
          this.user = res.data.data.user;
          this.getPayment();
        }
      });
    },

    getTotal() {
        
      this.dataPayment.map((item) => {
          if (item.discount !== 0) {
              this.totalDiscount += ((item.price / 100) * item.discount) * item.amount;
          }
          this.total += item.price * item.amount
          this.subTotal += item.price * item.amount;
      })
      this.total+= this.shipping;
      this.total-= this.totalDiscount;
      this.$emit('getTotalFromSide', this.total)
      this.$emit('getProductsFromSide', this.dataPayment)
    },


  }
}
</script>

<style>
.imgCart {
  width: 90px;
  height: 90px;
  object-fit: cover;
}

.spanNumberR{
  padding-left: 4px;
  padding-right: 4px;
  padding-top:1px ;
  padding-bottom:1px ;
  /* position: absolute; */
  float: left;
  margin-right: -10px;
  z-index: 5;
}
</style>

