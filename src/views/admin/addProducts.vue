<template>
 <div class="flex justify-center mt-32">
    <div class="shadow-lg px-10 py-5 rounded-lg bg-white">
      <h1 class="text-left text-2xl">agrega producto</h1>

      <form >
        <vs-input v-model="product.name" placeholder="Nombre producto" class="my-5 w-100" type="text" />
        <vs-input v-model="product.price" placeholder="precio" class="my-5 w-100" type="number" />
        <vs-select placeholder="Categorias" v-model="product.category_uuid" class="w-100">
            <vs-option :label="val.label" :value="val.value" v-for="(val,index) in categories" :key="index">
                {{val.label}} 
            </vs-option>
        </vs-select>
        <textarea v-model="product.description" placeholder="descripcion" class="my-5  block" type="password" ></textarea>
        <vs-select placeholder="Talla" v-model="product.size" class="w-100">
            <vs-option label="Chico" value="s"> Chico</vs-option>
            <vs-option label="Mediano" value="m"> Mediano</vs-option>
            <vs-option label="Grande" value="l"> Grande</vs-option>
        </vs-select>
        <vs-checkbox v-model="product.is_new" class="my-5">¿Es nuevo? </vs-checkbox>
        <vs-input v-model="product.discount" placeholder="descuento" class="my-5 w-100" type="number" />
        <vs-input v-model="product.stock" placeholder="stock" class="my-5 " type="number" />
        <!-- <label for="file" class="block text-left w-100"> Sube una imagen: </label> -->
        <!-- <input id="file" type="file" class="my-5 block"> -->
        <div class="mb-8">
            <div class="py-1 bg-green-600 text-white rounded-xl w-3/4 font-bold" v-if="product.image !== ''">Imagenes subidas   
            <i class="far fa-check-circle"></i>
      </div>
            <vs-button border @click.prevent="activeModal=!activeModal" >

            Sube una imagen
            </vs-button>
        </div>
   
        <vs-dialog width="300px" not-center v-model="activeModal">
            <template #header>
                <h4 class="text-xl mb-4">
                    Ingresa una imagen o mas imagenes
                </h4>
            </template>

            <form class="con-content mb-5"  enctype="multipart/form-data">
                <input type="file" ref="myFile" name="image" multiple/>
            </form>

            <template #footer>
                <div class="con-footer">
                    <vs-button @click.prevent="addImages" transparent>
                    Ok
                    </vs-button>
                    <vs-button @click="activeModal=false" dark transparent>
                    Cancel
                    </vs-button>
                </div>
            </template>
        </vs-dialog>
        <vs-button type="submit" @click.prevent="submitted" gradient>Agrega producto</vs-button>
      </form>
    </div>
  </div>
</template>

<script>
import adminProducts from '../../services/adminProducts';
import Product from '../../models/product'

export default {
     data:() => ({
        activeModal:false,
        categories: [],
        file: '',
        product: new Product('','','','','',false,'','','')
      }),

      created() {
          adminProducts.getCategories().then((res) => {
            res.data.rows.map((item) => {
                const obj = {value: item.uuid, label: this.capitalize(item.category) }
                this.categories.push(obj)       
              })
          })
      },

      methods: {
        capitalize(word) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        },

        submitted() {

            adminProducts.addProduct(this.product).then((res) => {
                if (res.status ===200) {
                    this.product = new Product('','','','','',false,'','','')
                    this.$router.push({name: 'Home'})
                    this.$vs.notification({
                        color: 'success',
                        position: 'top-right',
                        title:'Producto agregado',
                        text: 'El producto ha sido agregado correctamente'
                    })
                }
            });
        },

        addImages() {
            this.activeModal = false;
            var file = this.$refs.myFile.files;
            const form  = new FormData();
            for(var i = 0; i < file.length ; i++) {
                form.append('image',file[i],file[i].name)
            }
            adminProducts.addImage(form).then((res) => {
                this.product.image = res.data.path 
            })
        }
      }
}
</script>

<style>
    textarea {
        width: 100%;
        border-radius: 12px;
        padding: 10px;
        background-color: #F4F7F8;
    }
    textarea::placeholder {
        color: #C0C7CD;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-size: 0.8rem ;
        
    }
    textarea:focus {
        outline: none;
    }

</style>