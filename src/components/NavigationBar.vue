<template>
  <nav>
    <router-link to="/buying-and-selling">Buying And Selling</router-link> |
    <router-link to="/movement-history">Movement History</router-link> |
    <router-link to="/financial-and-investmentEvaluation">Financial and Investment Evaluation</router-link> |
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

      // Desactivar la funcionalidad de volver hacia atrás en el historial
      this.$router.replace('/');
      window.history.pushState(null, null, window.location.href);

      window.addEventListener('popstate', () => {
        // Redirigir de nuevo a la pantalla de inicio si el usuario intenta volver atrás
        this.$router.replace('/');
      });
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
