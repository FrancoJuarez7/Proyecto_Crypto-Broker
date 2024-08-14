<template>
  <div>

     <!-- Aquí va el BANNER -->

    <form @submit.prevent="submitForm">

      <label for="password">Enter your password:</label>
      <input type="password" id="password" v-model="password" placeholder="Enter your password">
      <button type="submit">START</button>

      <p v-if="cryptoValueQuote.argenbtc">Ask price for ArgenBTC: {{ cryptoValueQuote.argenbtc.ask }}</p>

    </form>

      <!-- Aquí van los CARTELES CON LOS PRECIOS QUE SE DEBERIAN ACTUALIZAR CADA CIERTO TIEMPO -->

  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CryptoService from '@/services/CryptoService';

export default {
  name: 'LoginView',
  data() {
    return {
      password: '',
      cryptoValueQuote: {},
    };
  },
  methods: { // Methods: acciones que quiero realizar
    ...mapActions(['updatePassword']), // Función de Vuex que permite mapear acciones como métodos de tu componente Vue.
    submitForm() {
      this.updatePassword(this.password);
      this.$router.push({ name: 'buying-and-selling' });
    },
  },

  created() {
    CryptoService.getPrice().then((response) => {
      console.log(response.data); // Para depurar y ver la estructura de la respuesta
      this.cryptoValueQuote = response.data;
    }).catch((error) => {
      console.error('Error fetching crypto price:', error);
    });
  },
};
</script>

<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
