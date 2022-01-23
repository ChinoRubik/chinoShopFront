<template>
 <div class="flex justify-center mt-32">
    <div class="shadow-lg px-10 py-5 rounded-lg bg-white">
      <h1 class="text-left text-2xl">Agrega categoria</h1>

      <form >
        <vs-input v-model="category.category" placeholder="Nombre de categoría" class="my-5 w-100" type="text" required/>
        <vs-button type="submit" @click.prevent="submitted" gradient>Añadir categoria</vs-button>
      </form>
    </div>
  </div>
</template>

<script>
import adminProducts from '../../services/adminProducts';

export default {
     data:() => ({
        category: {category : ''}
      }),
      methods: {
        submitted() {
            adminProducts.addCategory(this.category).then((res) => {
                if (res.status === 200) {
                    this.$router.push({name: 'Home'})
                    this.category.category = ''
                    this.$vs.notification({
                        color: 'success',
                        position: 'top-right',
                        title:'Categoría agregado',
                        text: 'La categoría ha sido agregado correctamente'
                    });
                }
            });
        },
      }
}
</script>
