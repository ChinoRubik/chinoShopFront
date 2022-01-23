<template>
    
    <div class="flex justify-center mt-32 container w-1/4 mx-auto">
        <vs-button gradient>
            <router-link :to="{name: 'agregaCategoria'}">Agrega categoría</router-link>
        </vs-button>

        <vs-button gradient>
            <router-link :to="{name: 'eliminaCategoria'}">Elimina categoría</router-link>
        </vs-button>

        <vs-button gradient>
            <router-link :to="{name: 'agregaProducto'}">Agrega producto</router-link>
        </vs-button>
    </div>
    
</template>

<script>
export default {
    setup() {
        
    },
}
</script>