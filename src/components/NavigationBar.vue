<template>
  <nav id="nav-container">
    <ul>
      <li><router-link to="/buying-and-selling">BUYING AND SELLING</router-link> </li>
      <li><router-link to="/movement-history">MOVEMENT HISTORY</router-link> </li>
      <li><router-link to="/financial-and-investmentEvaluation">FINANCIAL AND INVESTMENT EVALUATION</router-link> </li>
      <li><p> USER: {{ nameUser }}</p></li>
      <li><button class="btn" @click="logout">Log out</button></li>
    </ul>
  </nav>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'NavegationBar',
  methods: {
    /**
 * Cierra la sesión del usuario eliminando los datos de autenticación
 * y deshabilitando la funcionalidad de volver hacia atrás en el historial del navegador.
 *
 * Este método realiza las siguientes acciones:
 * - Elimina los datos de autenticación almacenados en `localStorage` y `sessionStorage`.
 * - Redirige al usuario a la página principal (inicio).
 * - Desactiva la funcionalidad de volver hacia atrás en el historial del navegador.
 *
 * @returns {void} Este método no devuelve ningún valor.
 */
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
  computed: {
    ...mapGetters(['nameUser']),
  },
};
</script>

<style scoped>

#nav-container{
  min-width: 1250px;
  height: 80px;
  color: white;
  border: 2px solid rgb(247, 166, 0);
  box-shadow: 0 12px 12px rgb(247, 166, 0);
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
}

#nav-container ul {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  align-items: center;
  justify-content: center;
  text-align: center;
  list-style: none;
  margin-top: 10px;
}

#nav-container ul li,
#nav-container ul li a{
  color: white;
  text-decoration: none;
  font-weight: bold;
}

#nav-container ul li:hover,
#nav-container ul li a:hover {
  color: rgb(247, 166, 0);
  transform: scale(1.2, 1.2);
}

/*BOTON*/
.btn {
  text-align: center;
  width: 100px;
  height: 35px;
  margin-top: 10px;
  color: black;
  background:  rgb(247, 166, 0);
  border: 1px solid #081f27;
  border-radius: 0px;
  cursor: pointer;
  font-size: 17px;
  font-family: "arial";
  font-weight: bold;
  margin-left: 17px;
  margin-bottom: 20px;
  transition: all 300ms;
  box-shadow: 0px 6px 8px rgba(179, 121, 121, 0.2);
}

.btn:hover{
  background-color: red;
}

</style>
