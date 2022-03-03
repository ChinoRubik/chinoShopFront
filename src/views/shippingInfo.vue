<template>
  <div class="flex flex-wrap container">
    <div class="col-7">
      <Breadcrumb :activeArray="activeArray" :key="hasChanged"></Breadcrumb>
      <div class="px-3">
        <h4 class="">Envios</h4>

        <div>
          <div class="flex flex-wrap">
            <div class="p-4 border w-100 flex justify-between"><span class="text-gray-400 font-bold">Contacto</span> <span>{{user.email}}</span>  
              <router-link :to="{name: 'Configuracion'}" custom v-slot="{ navigate }">
                <span @click="navigate" @keypress.enter="navigate" role="link" class="pr-4 hover:cursor-pointer text-blue-400 hover:underline">Cambiar</span>
              </router-link>
            </div> 
            <div class="p-4 border w-100 flex justify-between"><span class="text-gray-400 font-bold">Enviar a</span> <span class="px-3">{{address.street}}, {{address.number}}, {{address.colony}}
              , {{address.cp}} {{address.city}}, {{address.state}} {{address.country}}</span>  
              <router-link  :to="{name: 'Checkout', params: { uuid: this.$route.params.uuid}}" custom v-slot="{ navigate }">
                <span @click="navigate" @keypress.enter="navigate" role="link" class="pr-4 hover:cursor-pointer text-blue-400 hover:underline">Cambiar</span>
              </router-link>
            </div>

          </div>
        </div>
        <b-button variant="outline-primary mt-3 block float-left" @click="submitted">Continuar a Pago</b-button
        >
      </div>
    </div>
    <SideCart class="bg-gray-100 col-5 p-5"></SideCart>
  </div>
</template>

<script>
import SideCart from "../components/sideCart.vue";
import adminProducts from "../services/adminProducts";
import authService from "../services/auth";
import Breadcrumb from "../components/breadcrumb.vue";
import countriesLib from '../libs/countries.json'
import statesLib from '../libs/states.json'

export default {
  data() {
    return {
      activeArray: [false, false],
      user: {},
      address: {},
      hasChanged: false,
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
          this.$router.push({name: 'NotFound'})
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

    getCountry(id) {
      let country = '';
      countriesLib.countries.map((item) => {
        if(item.id === id)
        country = item.name
      })
      return country
    },

    getState(id) {
      let state = '';
      statesLib.states.map((item) => {
        if(item.id === id)
        state = item.name
      })
      return state
    },

    submitted() {
      this.hasChanged = !this.hasChanged;
      this.activeArray[1] = true;
      this.$router.push({name: 'Payment', params:{uuid: this.$route.params.uuid}})

    }
  },
};
</script>

