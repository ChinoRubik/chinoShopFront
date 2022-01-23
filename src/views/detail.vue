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
            <form action="" class="flex mb-5">
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
            <vs-button type="submit" success class="block w-1/2 buttonAdd">Agregar al carrito</vs-button>
            <p for="descripcion" class="font-bold text-2xl text-left mt-10">Descripción:</p>
            <p class="text-left text-gray-500 mb-5 text-md">{{product.description}}</p>
        </div>
    </div>
  </div>
</template>

<script>
import adminProducts from "../services/adminProducts";
import { Carousel, Slide } from "vue-carousel";
import config from "../services/config";

export default {
  data() {
      return {
          config,
          product:{},
          images: [],
          categories: [],
          size: '',
          amount: 1
      }
  },

  components: {
    Carousel,
    Slide,
  },

  created() {
    adminProducts.getProduct(this.$route.params.uuid).then((res) => {
      this.product = res.data.rows[0]
      this.getImages(this.product.image)
      console.log(this.product)
    });

    adminProducts.getCategories().then((res) => {
        this.categories = res.data.rows;
    });
  },

  methods: {
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