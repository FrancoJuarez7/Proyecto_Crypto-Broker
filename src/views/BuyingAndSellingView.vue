<template>
  <div>
    <NavigationBar></NavigationBar>
    <div>
      <p>COMPRA</p>

      <label>SELECT THE CRYPTO TO BUY               </label>
      <select id="buyCrypto" v-model="selectedBuyCrypto">
        <option v-for="(nameCoins, index) in typesOfCoins" :key="index" :value="nameCoins">
          {{ nameCoins }}
        </option>
      </select>

      <br>

      <label for="buyAmount">Quantity to purchase               </label>
      <input type="number" id="buyAmount" name="amount" min="1" max="100" step="1">

      <br>

      <button type="submit" @click="makePurchase">BUY</button>
    </div>

    <br>

    <div>
      <p>VENTA</p>

      <label>SELECT THE CRYPTO TO SELL                </label>
      <select id="saleCrypto" v-model="selectedSellCrypto">
        <option v-for="(nameCoins, index) in typesOfCoins" :key="index" :value="nameCoins">
          {{ nameCoins }}
        </option>
      </select>

      <br>

      <label for="sellAmount">Quantity to sell               </label>
      <input type="number" id="sellAmount" name="amount" min="1" max="100" step="1">

      <br>

      <button type="submit" @click="makeSale">SALE</button>
    </div>
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
// import CryptoService from '@/services/CryptoService';

export default {
  name: 'BuyingAndSellingView',
  components: {
    NavigationBar,
  },
  data() {
    return {
      names: [], // Cambié de objeto a array para poder iterar
      typesOfCoins: ['BTC', 'ETC', 'USDT', 'USDC', 'DAI', 'UXD', 'USDP', 'WLD', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'TRX', 'LINK', 'DOT', 'MATIC',
        'SHIB', 'LTC', 'BHC', 'EOS', 'XLM', 'FTM', 'AAVE', 'UNI', 'ALGO', 'BAT', 'PAXG', 'CAKE', 'AXS', 'SLP', 'MANA', 'SAND', 'CHZ'],
      selectedBuyCrypto: '',
      selectedSellCrypto: '',
    };
  },
  /* created() {
    CryptoService.getPrice();
  }, */
};
</script>

<style scoped>
/* Aquí va tu CSS */
</style>
