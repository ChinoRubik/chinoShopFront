<template>
    <div>
        <div class="bg-green-500 text-white p-16 firstBox">
            <div class="w-100">
                <span><img src="./../assets/check.png" class="iconCheck"></span>
                <img src="./../assets/bag-shopping-solid.svg" class="iconBag">
             </div>
            <h1 class="">¡Tu compra ha sido exitosa!</h1>
            <i class="fa-solid fa-circle-check"></i>
            <h5>Te avisaremos cuando tus productos estén en camino.</h5>
            <h5 class="mt-3 block">Has pagado MXM ${{total}}.00</h5>
        </div>
        <div class="backgroundMain">
            <div class="w-1/3 mx-auto boxes">
                <div v-for="item in productsBought" :key="item.uuid" class="bg-white rounded-xl p-3 flex mb-4 box flex-wrap justify-center">
                    <img :src="item.image" class="rounded-full img mb-2">
                    <div class="md:ml-4">
                        <span class="font-bold text-left block">({{item.amount}}) {{item.name}}</span>
                        <span class="text-stone-500 text-left mt-2 block ">{{item.description}}</span>
                        <span class="text-stone-500 text-left block">Talla <strong>{{item.size}}</strong></span>
                    </div>
                </div>
                <b-button variant="primary mt-3" @click="$router.push({name: 'Home'})">Ir a Inicio</b-button>

            </div>
       
        </div>
    </div>
</template>

<script>
import adminProducts from "../services/adminProducts";

export default {
    data() {
        return {
            productsBought: [],
            total: 0
        }
    },

    mounted() {
        this.existsUuidSale();
    },

    methods: {
        existsUuidSale() {
            adminProducts.getSaleByUuid(this.$route.params.uuid).then((res) => {                
                if(res.data.rows.length === 0 || res.data.rows[0].isDone === 0) {
                    this.$router.push({name: 'NotFound', params:{pathMatch2: this.$route.params.uuid, pathMatch: 'pago'}})
                } else {
                    this.productsBought = JSON.parse(res.data.rows[0].list);
                    this.total = res.data.rows[0].total;
                }
            })
        },
    }
}
</script>
<style>
.firstBox {
    height: 450px;
}
.iconBag {
    margin:0px auto;    
    width: 10em;
    height: 10em;
    background-color: white;
    padding: 2em;
    border-radius: 360px;
    margin-bottom: 1.5em;
}
.backgroundMain {
    background-color: #EDEDED;
    height: 1000px;
}
.iconCheck {
    width: 4.5em;    
    top: 18.5%;
    left: 52%;
    position: absolute; 
}
.img {
    width: 6em;
    object-fit: cover;
    height: 6em;
}
.cardE {
    margin-bottom: 2em;
}
.boxes {
    position: absolute;
    right: 33%;
    top: 42%;
}
.box {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
}
</style>