<template>
  <nav>
    <router-link to="/buying-and-selling">Buying And Selling</router-link> |
    <router-link to="/movement-history">Movement History</router-link> |
    <router-link to="/current-status-analysis">Current Status Analysis</router-link> |
    <router-link to="/investment-analysis">Investment Analysis</router-link> |
    <button class="btn" @click="logout">Log out</button>
  </nav>
</template>

<script>
export default {
  name: 'NavegationBar',
  methods: {
    logout() {
      // Eliminar datos de autenticación
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('userSession');
      // Redirigir a la pantalla de inicio de sesión
      this.$router.replace('/'); // Reemplaza la entrada actual en el historial
    },
  },
};
</script>

<style>
.btn {
  /* Estilo para el botón */
  padding: 10px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
}
</style>
