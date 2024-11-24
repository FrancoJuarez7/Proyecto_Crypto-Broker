export default {

  namespaced: true,

  state: {
    exchanges: [],
    typeOfCoins: [],
  },

  getters: {
    getExchanges: (state) => state.exchanges,
    getTypesOfCoins: (state) => state.typeOfCoins,
  },

  mutations: {
    set_Exchanges(state, data) {
      state.exchanges = data;
    },

    set_TypesOfCoins(state, data) {
      state.typeOfCoins = data;
    },
  },

  actions: {
    initializeExchanges({ commit }) {
      const exchanges = ['LETSBIT', 'BITSOALPHA', 'CRYPTOMKT', 'BITGETP2P', 'BUENBIT', 'ELUTER', 'ELDORADOP2P', 'RIPIO', 'BITSO', 'PAXFULP2P',
        'FIWIND', 'BINANCEP2P', 'SATOSHITANGO', 'KRIPTONMARKET', 'ARGENBTC', 'OKEXP2P', 'TIENDACRYPTO', 'LEMONCASH', 'COCOSCRYPTO', 'BYBIT',
        'BINANCE', 'PAYDECEP2P', 'TRUBIT', 'KUCOINP2P', 'RIPIOEXCHANGE', 'VIBRANT', 'PLUSCRYPTO', 'BYBITP2P', 'CRYPTOMKTPRO', 'BELO', 'CALYPSO',
        'BITMONEDERO', 'COINEXP2P', 'DECRYPTO', 'SALDO', 'HUOBIP2P', 'LEMONCASHP2P', 'BINGXP2P', 'TRUBITP2P', 'LNP2PBOTP2P', 'SYKLOP2P', 'XAPO'];

      commit('set_Exchanges', exchanges);
    },

    initializeTypesOfCoins({ commit }) {
      const typesOfCoins = [
        'BTC', 'ETH', 'USDT', 'USDC', 'DAI', 'UXD', 'USDP', 'WLD', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'TRX', 'LINK', 'DOT', 'MATIC',
        'SHIB', 'LTC', 'BHC', 'EOS', 'XLM', 'FTM', 'AAVE', 'UNI', 'ALGO', 'BAT', 'PAXG', 'CAKE', 'AXS', 'SLP', 'MANA', 'SAND', 'CHZ'];

      commit('set_TypesOfCoins', typesOfCoins);
    },

  },
};
