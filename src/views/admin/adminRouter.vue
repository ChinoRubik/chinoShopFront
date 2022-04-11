<template> 
    <div class="flex justify-center mt-32 container w-1/4 mx-auto">
        <router-link :to="{name: 'agregaCategoria'}" class="px-3 py-2 bg-blue-500 rounded-lg text-white shadow-md h-25">Agrega categoría</router-link>

        <router-link :to="{name: 'eliminaCategoria'}" class="ml-2 px-3 py-2 bg-blue-500 rounded-lg text-white shadow-md h-25">Elimina categoría</router-link>

        <router-link :to="{name: 'agregaProducto'}" class="ml-2 px-3 py-2 bg-blue-500 rounded-lg text-white shadow-md h-25">Agrega producto</router-link>
    </div>
</template>
