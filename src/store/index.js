import { createStore } from 'vuex';
import userTransactionData from './userTransactionData';
import getPricesApi from './getPricesApi';
import exchangesAndCurrencies from './exchangesAndCurrencies';

export default createStore({

  // Variables que va a necesitar mi APP.
  state: {
    password: '',
    nameUser: '',
  },

  // Para no acceder directamente al estado o para filtrar info,calculan o filtran datos basados en el estado actual
  getters: {
    password(state) {
      return state.password;
    },
    nameUser(state) {
      return state.nameUser;
    },
  },

  /* Las mutaciones son funciones síncronas que reciben el estado actual y un payload (datos necesarios para la modificación) como argumentos y
  modifican el estado. Son funciones que modifican el estado de manera sincrónica. Para realizar cambios en la variable del estado */
  mutations: {
    setPassword(state, password) {
      state.password = password;
    },
    setNameUser(state, nameUser) {
      state.nameUser = nameUser;
    },
  },

  actions: {
    updatePassword({ commit }, password) {
      commit('setPassword', password);
    },
    updateNameUser({ commit }, nameUser) {
      commit('setNameUser', nameUser);
    },
  },

  // Para organizar de una mejor forma si quiero manejar varios estados. Permiten dividir el store en módulos más pequeños
  modules: {
    userTransactionData,
    getPricesApi,
    exchangesAndCurrencies,
  },
});
