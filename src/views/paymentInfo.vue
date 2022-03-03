<template>

  <div class="flex  flex-wrap container">
            <div class="col-7">
              <div class="px-3">
                  <Breadcrumb :activeArray="activeArray" :key="hasChanged"></Breadcrumb>
                  <h4 class="">Información de contacto</h4>

                  <label class="text-left block mb-1">Correo electrónico: </label>
                <b-form-input v-model="user.email" disabled placeholder="Correo electrónico" class="mb-3"></b-form-input>
                
                <div class="flex justify-between">
                  <div>
                      <label class="text-left block mb-1">Nombre: </label>
                      <b-form-input v-model="user.name" placeholder="Nombre" class="mb-3" disabled></b-form-input>
                  </div>

                  <div>
                    <label class="text-left block mb-1">Apellido: </label>
                    <b-form-input v-model="user.lastname" placeholder="Apellido" class="mb-3" disabled></b-form-input>
                  </div>
                </div>
                
                <h4 class="">Dirección de envío</h4>

                <label class="text-left block mb-1">País: </label>
                  <b-form-select v-model="countrySelected" :options="optionsCountry" class="mb-3"></b-form-select>

                <label class="text-left block mb-1">Calle: </label>
                <b-form-input v-model="adddess.street" placeholder="Calle" class="mb-3"></b-form-input>

                  <label class="text-left block mb-1">Número Exterior y Número Interior: </label>
                <b-form-input v-model="adddess.number" placeholder="Número Exterior y Número Interior" class="mb-3"></b-form-input>

                <label class="text-left block mb-1">Colonia: </label>
                <b-form-input v-model="adddess.colony" placeholder="Colonia" class="mb-3"></b-form-input>

                  <div class="flex justify-between">
                    <div class="col-4">
                        <label class="text-left block mb-1">Código postal: </label>
                        <b-form-input v-model="adddess.cp" placeholder="Código postal" class="mb-3" type="number"></b-form-input>
                    </div>

                    <div class="col-4">
                      <label class="text-left block mb-1">Ciudad: </label>
                      <b-form-input v-model="adddess.city" placeholder="Ciudad" class="mb-3"></b-form-input>
                    </div>

                    <div class="col-4">
                      <label class="text-left block mb-1">Estado: </label>
                      <b-form-select v-model="adddess.state" :options="optionsState" class="mb-3"></b-form-select>
                    </div>
                </div>
                  <label class="text-left block mb-1 ">Teléfono: </label>
                  <b-form-input v-model="adddess.phone" placeholder="Teléfono" class="mb-3" type="number"></b-form-input>

                    <b-button variant="outline-primary mb-5 block float-left" @click="submitted">Continuar a envíos</b-button>

              </div>
            </div>
            <SideCart class="bg-gray-100 col-5 p-5"></SideCart>
        </div>
</template>

<script>
import authService from '../services/auth'
import countriesLib from '../libs/countries.json'
import statesLib from '../libs/states.json'
import SideCart from '../components/sideCart.vue';
import Breadcrumb from '../components/breadcrumb.vue';
import adminProducts from '../services/adminProducts';

export default {

  data() {
    return {
      optionsCountry: [],
      countrySelected: null,
      optionsState: [],
      adddess: {
        country: null,
        street: null,
        number: null,
        colony: null,
        cp: null,
        city: null,
        phone: null,
        state: null
      },
      user: {},
      activeArray: [true, true],
      addressFlag: false,
      hasChanged: false,
    }
  },

  components: {
    SideCart,
    Breadcrumb
  },

  created() { 
    this.existsUuidSale();
    this.getUserData();
    this.orderCountriesLib();
    this.orderCitiesCountriesLib();
    this.optionsState.push({value: null, text: 'Estado'})
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
        if(res.data.rows.length  === 1) {
          this.adddess = res.data.rows[0];
          this.countrySelected = this.getCountryByName(this.adddess.country);
          this.adddess.state = this.getStateByState(this.adddess.state);
          this.activeArray[0] = false;
          this.hasChanged = !this.hasChanged;
        } else {
          this.addressFlag = true;
        }
      })
    },

    getUserData() {
      authService.dashboard().then((res) => {
        if(res.status ===200) {
          this.user = res.data.data.user;
        }
      });
    },

    orderCountriesLib() {
      this.optionsCountry.push({value: null, text: 'Selecciona un país'})
      countriesLib.countries.map((item) => {
        this.optionsCountry.push({value: item.id, text: item.name})
      })
    },

    orderCitiesCountriesLib(id_country) {
      this.optionsState = []
      this.optionsState.push({value: null, text: 'Estado'})

      statesLib.states.map((item) => {
        if(id_country === item.id_country) {
          this.optionsState.push({value: item.id, text: item.name})
        }
      })
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

    getCountryByName(country) {
      let countryS = '';
      countriesLib.countries.map((item) => {
        if(item.name === country)
        countryS = item.id
      })
      return countryS
    },

    getStateByState(state) {
      let stateS = '';
      statesLib.states.map((item) => {
        if(item.name === state)
        stateS = item.id
      })
      return stateS
    },

    submitted() {

      this.adddess.country = this.getCountry(this.countrySelected);
      this.adddess.state = this.getState(this.adddess.state);

      if(this.adddess.country === null || this.adddess.country === '') {
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Requerido',
            text: 'El país es requerido'
          })
      } else if(this.adddess.street === null || this.adddess.street === '') {
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Requerido',
            text: 'La calle es requerida'
          })
      } else if(this.adddess.number === null || this.adddess.number === '') {
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Requerido',
            text: 'El número es requerido'
          })
      } else if(this.adddess.colony === null || this.adddess.colony === '') {
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Requerido',
            text: 'La colonia es requerida'
          })
      } else if(this.adddess.cp === null || this.adddess.cp === '') {
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Requerido',
            text: 'El código postal es requerido'
          })
      } else if(this.adddess.city === null || this.adddess.city === '') {
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Requerido',
            text: 'La ciudad es requerida'
          })
      } else if(this.adddess.phone === null || this.adddess.phone === '') {
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Requerido',
            text: 'El télefono es requerido'
          })
      } else if(this.adddess.state === null || this.adddess.state === '') {
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'danger',
            position: 'top-right',
            title:'Requerido',
            text: 'El Estado es requerido'
          })
      } else {
          this.adddess.sale_uuid = this.$route.params.uuid;
          this.$vs.notification({
            icon: '<i class="fas fa-times-circle"></i>',
            color: 'success',
            position: 'top-right',
            title:'Guardado',
            text: 'OK'
          })
          console.log(this.adddess)
          if(!this.addressFlag) {
            adminProducts.updateAddress(this.$route.params.uuid, this.adddess).then((res) => {
              console.log(res)
            })
          } else {
            adminProducts.addAddress(this.adddess).then((res) => {
              console.log(res)
            })
          }
    
          this.$router.push({name: 'Shipping', params:{uuid: this.$route.params.uuid}})
      }
    },
  },

  watch: {
    countrySelected(val) {
      if(val !== null) {
        this.orderCitiesCountriesLib(val);
      }
    }
  }
};
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

