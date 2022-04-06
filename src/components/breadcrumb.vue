<template>
  <div>
    <b-breadcrumb :items="items" class="p-4 h-20"></b-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          text: "Carrito",
          to: { name: "Carrito" },
        },
        {
          text: "Información",
          to: { name: "Checkout", params: { uuid: this.$route.params.uuid}},
        },
        {
          text: "Envíos",
          active: this.activeArray[0],
          to: { name: "Shipping", params: { uuid: this.$route.params.uuid}},
        },
        {
          text: "Pago",
          active: this.activeArray[1],
          to: { name: "Payment", params: { uuid: this.$route.params.uuid}},
        },
   
      ],
    };
  },

  props: {
    activeArray: {
      type: Array,
      required: true,
    },
  },
};
</script>