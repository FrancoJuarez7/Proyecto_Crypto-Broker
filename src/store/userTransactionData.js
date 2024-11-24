import CryptoService from '@/services/CryptoService';

export default {

  namespaced: true,
  state: {
    userTransactionResults: [],
  },

  getters: {
    userTransactionResults(state) {
      return state.userTransactionResults;
    },
  },

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
        return false;
      }

      try {
        const response = await CryptoService.savedPurchase(password);

        if (response.data?.length >= 0) {
          commit('getTransactions', response.data);
          console.log('SE ENCONTRARON DATOS:', response.data);
          return true;
        }
        console.log('Error al obtener las compras guardadas en la API.');
        return false;
      } catch (error) {
        console.log('Error al intentar acceder a la API: ', error);
        return false;
      }
    }
    ,
  },
};
