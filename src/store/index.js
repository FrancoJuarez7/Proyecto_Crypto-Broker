import { createStore } from 'vuex';
import userTransactionData from './userTransactionData';
import getPricesApi from './getPricesApi';
import exchangesAndCurrencies from './exchangesAndCurrencies';

export default createStore({

  state: {
    password: '',
    nameUser: '',
  },

  getters: {
    password(state) {
      return state.password;
    },
    nameUser(state) {
      return state.nameUser;
    },
  },

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

  modules: {
    userTransactionData,
    getPricesApi,
    exchangesAndCurrencies,
  },
});
