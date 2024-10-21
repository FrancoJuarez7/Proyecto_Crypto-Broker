import CryptoService from '@/services/CryptoService';

export default {

  namespaced: true,

  state: {
    precioTransaccion: {
      buy: 0,
      sell: 0,
    },
    errorMessageBuy: '',
    errorMessageSell: '',
  },

  getters: {
    purchasePrice(state) {
      return state.precioTransaccion.buy;
    },

    sellPrice(state) {
      return state.precioTransaccion.sell;
    },

    saleErrorMessage(state) {
      return state.errorMessageSell;
    },

    buyErrorMessage(state) {
      return state.errorMessageBuy;
    },

  },

  mutations: {
    obtainedPrice(state, { type, price }) {
      if (type === 'purchase') {
        state.precioTransaccion.buy = price;
      } else if (type === 'sale') {
        state.precioTransaccion.sell = price;
      }
    },

    setErrorMessage(state, { type, message }) {
      if (type === 'purchase') {
        state.errorMessageBuy = message;
      } else {
        state.errorMessageSell = message;
      }
    },

  },

  actions: {

    async fetchCryptoPrice({ commit }, {
      exchange, crypto, quantity, type,
    }) {
      let price = 0;
      let result = 0;

      try {
        const response = await CryptoService.getPrice(crypto, exchange);

        if (response.data) {
          // Asigna el precio basado en el tipo de transacción
          price = type === 'purchase' ? parseFloat(response.data.totalAsk).toFixed(2)
            : parseFloat(response.data.totalBid).toFixed(2);

          // Calcula el resultado multiplicando la cantidad por el precio
          result = parseFloat(quantity * price);

          if (Number.isNaN(result)) {
            const errorMessage = type === 'purchase' ? 'No se encontraron datos de precios para la compra.'
              : 'No se encontraron datos de precios para la venta.';
            commit('obtainedPrice', { type, price: result });
            commit('setErrorMessage', { type, message: errorMessage });
            return;
          }

          // Actualiza el estado con el precio obtenido
          commit('obtainedPrice', { type, price: result });
          commit('setErrorMessage', { type, message: '' });
        } else {
          // Si la response && response.data no tiene datos válidos
          const errorMessage = type === 'purchase' ? 'No se encontraron datos de precios para la compra.'
            : 'No se encontraron datos de precios para la venta.';
          commit('obtainedPrice', { type, price: null });
          commit('setErrorMessage', { type, message: errorMessage });
          return;
        }
      } catch (error) { // Manejo de errores en la consulta a la API
        const errorMessage = type === 'purchase' ? 'Hubo un error al consultar los precios de compra en la API.'
          : 'Hubo un error al consultar los precios de venta en la API.';
        commit('obtainedPrice', { type, price: null });
        commit('setErrorMessage', { type, message: errorMessage });
      }
    },
  },
};
