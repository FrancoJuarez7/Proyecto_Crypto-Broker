<template>
    <nav>
    <router-link to="/buying-and-selling">Buying And Selling</router-link> |
    <router-link to="/movement-history">MovementHistory</router-link> |
    <router-link to="/current-status-analysis">Current Status Analysis</router-link> |
    <router-link to="/investment-analysis">Investment Analysis</router-link> |
    <router-link to="/" class="btn">Log out</router-link>
    </nav>
</template>

<script>
export default {
  name: 'NavegationBar',
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
