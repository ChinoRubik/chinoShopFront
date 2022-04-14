<template>
 <div class="flex justify-center mt-32">
    <div class="shadow-lg px-10 py-5 rounded-lg bg-white">
      <h1 class="text-left text-2xl" v-if="updateProduct">Actualiza producto</h1>
      <h1 class="text-center text-2xl mb-4" v-else>Agrega producto</h1>

      <form class="flex flex-wrap">
        <div class="col-12 col-md-6">
            <label for="name" class="text-left block text-gray-400">Nombre producto:</label>
            <vs-input v-model="product.name" placeholder="Nombre producto" class="w-100" type="text"/>
            
            <label for="price" class="text-left block mt-3 text-gray-400">Precio:</label>
            <vs-input v-model="product.price" placeholder="Precio" class="w-100" type="number" />

            <label for="categories" class="text-gray-400 text-left block mt-3">Categoria:</label>
            <v-select v-model="product.category_uuid" :options="categories" id="categories"/>

            <label for="description" class="text-gray-400 text-left block mt-3">Descripción:</label>
            <textarea v-model="product.description" placeholder="descripcion" class="block" type="password" ></textarea>

            <label for="sizesSelected" class="text-gray-400 block text-left my-3">Selecciona tallas disponibles:</label>
            <v-select multiple v-model="product.size" :options="sizes" id="sizesSelected"/>

            <vs-checkbox v-model="product.is_new" class="my-3">¿Es nuevo? </vs-checkbox>
        </div>
        <div class="col-12 col-md-6">
            <label for="discount" class="text-gray-400 block text-left my-3">Descuento en %:</label>
            <vs-input v-model="product.discount" placeholder="descuento" class="w-100" type="number" />

            <div v-for="(item, index) in product.size" :key="index">
                <label for="stock" class="text-gray-400 block text-left my-3" >Stock para talla {{item.toUpperCase()}}:</label>
                <vs-input v-model="stockSelected[index]" :placeholder="`Stock para talla ${item.toUpperCase()}`" type="number"/>
            </div>
            <label for="images" class="text-gray-400 block w-100 text-left mb-2 mt-3">Sube imagenes:</label>
            <input type="file" ref="myFile" name="image" multiple id="images" class="mb-10 col-10"/>

            <vs-button type="submit" @click.prevent="submitted" gradient > <span v-if="updateProduct">Actualiza producto</span> <span v-else> Agrega producto</span></vs-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import adminProducts from '../../services/adminProducts';
import Product from '../../models/product'
import vSelect from 'vue-select'

export default {
     
     components: {
         vSelect
     },

     data:() => ({
        stockSelected: [],
        sizesSelected: [],
        categories: [],
        sizes: ['xs','s','m','l','xl','xxl'],
        file: '',
        product: new Product('','','','','',false,'','',''),
        updateProduct: false,
      }),

      created() {
          if(this.$route.params.uuid) {
              this.updateProduct = true;
              
              adminProducts.getProduct(this.$route.params.uuid).then((res) => {
                  this.product = res.data.rows[0];
                  this.product.size = this.product.size.split(',')
                  this.product.is_new === 1 ? this.product.is_new = true : this.product.is_new = false;
                //   this.sizesSelected = this.product.size;
                // console.log(this.product.size,'lol')

                  const my_split = this.product.stock.split('},')
                  for(var i = 0; i<my_split.length; i++) {
                      if(my_split.length > 1 && i !== my_split.length-1 ) {
                            this.stockSelected.push(JSON.parse(my_split[i]+'}').stock)
                      } else{
                            this.stockSelected.push(JSON.parse(my_split[i]).stock)
                      }
                  }
              })           
          }
          adminProducts.getCategories().then((res) => {
            res.data.rows.map((item) => {
                const obj = {value: item.uuid, label: this.capitalize(item.category) }
                this.categories.push(obj)       
              })
            this.product.category_uuid = this.getCategory(this.product.category_uuid)
          })
      },

      methods: {
        capitalize(word) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        },

        submitted() {

            console.log(this.product)
            if (this.product.name === '' || this.product.name === null) {
                this.$vs.notification({
                    icon: '<i class="fas fa-times-circle"></i>',
                    color: 'danger',
                    position: 'top-right',
                    title:'Requerido',
                    text: 'El nombre es requerido'
                });
            } else if (this.product.price === '' || this.product.price === null) {
                this.$vs.notification({
                    icon: '<i class="fas fa-times-circle"></i>',
                    color: 'danger',
                    position: 'top-right',
                    title:'Requerido',
                    text: 'El precio es requerido'
                }); 
            } else if (this.product.category_uuid === '' || this.product.category_uuid === null) {
                this.$vs.notification({
                    icon: '<i class="fas fa-times-circle"></i>',
                    color: 'danger',
                    position: 'top-right',
                    title:'Requerido',
                    text: 'La categoría es requerida'
                }); 
            } else if (this.product.description === '' || this.product.description === null) {
                this.$vs.notification({
                    icon: '<i class="fas fa-times-circle"></i>',
                    color: 'danger',
                    position: 'top-right',
                    title:'Requerido',
                    text: 'La descripción es requerida'
                }); 
            } else if (this.product.size === '' || this.product.size === null) {
                this.$vs.notification({
                    icon: '<i class="fas fa-times-circle"></i>',
                    color: 'danger',
                    position: 'top-right',
                    title:'Requerido',
                    text: 'La talla es requerida'
                }); 
            } else if (this.product.discount === '' || this.product.discount === null) {
                this.$vs.notification({
                    icon: '<i class="fas fa-times-circle"></i>',
                    color: 'danger',
                    position: 'top-right',
                    title:'Requerido',
                    text: 'El descuento es requerido'
                }); 
            } else if (this.$refs.myFile.files.length === 0 && !this.updateProduct) {
                this.$vs.notification({
                    icon: '<i class="fas fa-times-circle"></i>',
                    color: 'danger',
                    position: 'top-right',
                    title:'Requerido',
                    text: 'Es necesario subir una imagen'
                }); 
            } else {
                for(var i=0; i< this.product.size.length; i++) {
                    if (this.stockSelected[i] === undefined) {
                        this.stockSelected[i] = 0;
                    }
                    const obj = {size: this.product.size[i], stock: this.stockSelected[i]};
                    this.stockSelected[i] = JSON.stringify(obj);
                }
                this.product.category_uuid = this.product.category_uuid.value;
                this.product.size = this.product.size.toString();
                this.product.stock = this.stockSelected.toString();
                this.product.is_new === false ? this.product.is_new = 0 : this.product.is_new = 1

                const loading = this.$vs.loading()
                if (this.updateProduct) {
                    adminProducts.updateProduct(this.product, this.$route.params.uuid).then((res) => {
                        if (res.status ===200) {
                            this.product = new Product('','','','','',false,'','','')
                            this.$router.push({name: 'Home'})
                            this.$vs.notification({
                                color: 'success',
                                position: 'top-right',
                                title:'Producto actualizado',
                                text: 'El producto ha sido actualizado correctamente'
                            })
                        }
                        loading.close();
                        this.$router.push({name: 'Detalle', params: { uuid: this.$route.params.uuid }})
                    });

                } else {

                    var file = this.$refs.myFile.files;
                    const form  = new FormData();
                    for(var j = 0; j < file.length ; j++) {
                        form.append('image',file[j],file[j].name)
                    }
                    form.append('price', this.product.price)
                    form.append('description', this.product.description)
                    form.append('size', this.product.size)
                    form.append('is_new', this.product.is_new)
                    form.append('discount', this.product.discount)
                    form.append('stock', this.product.stock)
                    form.append('category_uuid', this.product.category_uuid)
                    form.append('name', this.product.name)
                    adminProducts.addProduct(form).then((res) => {
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
                        loading.close();
                    });
                }
            
            }
        },

        getCategory(uuid) {
            let categoryLabel = ''
            this.categories.map((item) => {
                if(item.value === uuid) {
                    categoryLabel = item.label;
                }
            });
            return categoryLabel
        },
      },
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