import CryptoService from '@/services/CryptoService';

export default {

  namespaced: true,

  state: {
    priceTransaction: {
      buy: 0,
      sell: 0,
    },
    loadingProgress: 0,
    errorMessageBuy: '',
    errorMessageSell: '',
  },

  getters: {
    purchasePrice(state) {
      return state.priceTransaction.buy;
    },

    sellPrice(state) {
      return state.priceTransaction.sell;
    },

    saleErrorMessage(state) {
      return state.errorMessageSell;
    },

    buyErrorMessage(state) {
      return state.errorMessageBuy;
    },

    loadingProgress: (state) => state.loadingProgress,

  },

  mutations: {
    obtainedPrice(state, { type, price }) {
      if (type === 'purchase') {
        state.priceTransaction.buy = price;
      } else if (type === 'sale') {
        state.priceTransaction.sell = price;
      }
    },

    setErrorMessage(state, { type, message }) {
      if (type === 'purchase') {
        state.errorMessageBuy = message;
      } else {
        state.errorMessageSell = message;
      }
    },

    setLoadingProgress(state, progress) {
      state.loadingProgress = progress;
    },

  },

  actions: {
    async fetchCryptoPrice({ commit }, {
      exchange, crypto, quantity, type,
    }) {
      let price = 0;
      let result = 0;

      try {
        commit('setLoadingProgress', 25);
        const response = await CryptoService.getPrice(crypto, exchange);

        commit('setLoadingProgress', 50);

        if (response.data) {
          // Asigna el precio basado en el tipo de transacción
          price = type === 'purchase' ? parseFloat(response.data.totalAsk).toFixed(2)
            : parseFloat(response.data.totalBid).toFixed(2);

          // Calcula el resultado multiplicando la cantidad por el precio
          result = parseFloat(quantity * price);

          if (Number.isNaN(result)) {
            const errorMessage = type === 'purchase' ? 'No price data found for the purchase.'
              : 'No price data found for the sale.';
            commit('obtainedPrice', { type, price: result });
            commit('setErrorMessage', { type, message: errorMessage });
            commit('setLoadingProgress', 0);
            return;
          }

          commit('setLoadingProgress', 75);
          commit('setLoadingProgress', 100);

          // Actualiza el estado con el precio obtenido
          commit('obtainedPrice', { type, price: (result).toFixed(2) });
          commit('setErrorMessage', { type, message: '' });
        } else {
          // Si la response && response.data no tiene datos válidos
          const errorMessage = type === 'purchase' ? 'No price data found for the purchase.'
            : 'No price data found for the sale.';
          commit('obtainedPrice', { type, price: null });
          commit('setErrorMessage', { type, message: errorMessage });
          commit('setLoadingProgress', 0);
          return;
        }
      } catch (error) { // Manejo de errores en la consulta a la API
        const errorMessage = type === 'purchase' ? 'There was an error retrieving the purchase prices from the API.'
          : 'There was an error retrieving the sale prices from the API.';
        commit('obtainedPrice', { type, price: null });
        commit('setErrorMessage', { type, message: errorMessage });
        commit('setLoadingProgress', 0);
      }
    },
  },

};
