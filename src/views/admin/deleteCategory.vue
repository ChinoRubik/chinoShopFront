<template>
 <div class="flex justify-center mt-32">
    <div class="shadow-lg px-10 py-5 rounded-lg bg-white">
      <h1 class="text-left text-2xl mb-5">Elimina categoría</h1>
      <form >
    
        <label for="" class="block text-left">Categoria:</label>
        <v-select :options="options" class="mb-8" v-model="categorySelected"></v-select>
        <vs-button type="submit" @click.prevent="submitted" gradient>Eliminar categoria</vs-button>
        
      </form>
    </div>
  </div>
</template>

<script>
import adminProducts from '../../services/adminProducts';
import vSelect from 'vue-select'

export default {
     data:() => ({
        categorySelected: '',
        options: []
      }),
      components: {
          vSelect
      },
      
      created() {
          adminProducts.getCategories().then((res) => {
              res.data.rows.map((item) => {
                  this.options.push({label: item.category, uuid: item.uuid})
              });
          });
      },

      methods: {
        submitted() {
            // console.log(this.categorySelected)
            adminProducts.deleteCategory(this.categorySelected.uuid).then((res) => {
                if (res.status === 200) {
                    this.$router.push({name: 'Home'})
                    this.$vs.notification({
                        color: 'success',
                        position: 'top-right',
                        title:'Categoría eliminada',
                        text: 'La categoría ha sido eliminada correctamente'
                    });
                }
            });

        },
      }
}
</script>
