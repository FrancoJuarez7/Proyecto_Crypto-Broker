<template>
    <div>
        <form @submit.prevent="submitForm">

        <label for="password" >Enter your password:</label>
        <input type="password" id="password" v-model="password" placeholder="Enter your password">
        <button type="submit">START</button>
        <p>Attention: The key must contain 8 characters and must be alphanumeric.</p>
        </form>

        <p v-if="errorMessage" id="error-mensaje">{{errorMessage}}</p>
    </div>
  </template>

<script>

import { mapActions } from 'vuex';

export default {
  name: 'LoginForm',
  data() {
    return {
      password: '',
      cryptoValueQuote: {},
      errorMessage: '',
    };
  },
  methods: { // Methods: acciones que quiero realizar
    ...mapActions(['updatePassword']), // Función de Vuex que permite mapear acciones como métodos de tu componente Vue.
    submitForm() {
      const { password } = this;
      const isValidLength = password.length === 8;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);

      if (!isValidLength || !hasLetter || !hasNumber) {
        this.errorMessage = 'The password must be 8 characters and alphanumeric.';
      } else {
        this.updatePassword(this.password);
        this.errorMessage = '';
        this.$router.push({ name: 'buying-and-selling' });
      }
    },
  },
};
</script>

  <style scoped>
  #error-mensaje {
  color: red;
  font-size: 14px;
}
  </style>
