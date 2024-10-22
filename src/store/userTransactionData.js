import CryptoService from '@/services/CryptoService';

export default {

  namespaced: true,
  // Variables que va a necesitar mi APP.
  state: {
    userTransactionResults: [],
  },

  // Para no acceder directamente al estado o para filtrar info,calculan o filtran datos basados en el estado actual
  getters: {
    userTransactionResults(state) {
      return state.userTransactionResults;
    },
  },

  /* Las mutaciones son funciones síncronas que reciben el estado actual y un payload (datos necesarios para la modificación) como argumentos y
  modifican el estado. Son funciones que modifican el estado de manera sincrónica. Para realizar cambios en la variable del estado */
  mutations: {
    getTransactions(state, data) {
      state.userTransactionResults = data;
    },
  },

  actions: {

    // Obtengo los datos de los movimientos del usuario
    async getUserTransactionData({ commit, rootState }) {
      const { password } = rootState;

      if (!password) {
        alert('Password is required');
        return false; // Devuelve false si no hay contraseña
      }

      try {
        const response = await CryptoService.savedPurchase(password);

        if (response.data || response.data > 0) {
          commit('getTransactions', response.data);
          console.log('SE ENCONTRARON DATOS:', response.data);
          return true; // Devuelve true si hay datos
        }
        console.log('Error al obtener las compras guardadas en la API.');
        return false; // Devuelve false si no hay datos
      } catch (error) {
        console.log('Error al intentar acceder a la API: ', error);
        alert('Error retrieving saved purchases.');
        return false; // Devuelve false en caso de error
      }
    }
    ,
  },
};
