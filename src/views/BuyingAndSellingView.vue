<template>
  <div>
    <NavigationBar></NavigationBar>
    <div>
      <p>COMPRA</p>

      <label for="buyCrypto">SELECT THE CRYPTO TO BUY</label>
      <select id="buyCrypto" v-model="selectedBuyCrypto">
        <option v-for="(nameCoins, index) in typesOfCoins" :key="index" :value="nameCoins">
          {{ nameCoins }}
        </option>
      </select>

      <br>

      <label>SELECT THE EXCHANGE TO BUY</label>
      <select id="buyExchangeCrypto" v-model="selectedExchangeBuyCrypto">
        <option v-for="(nameExchange, index) in Exchanges" :key="index" :value="nameExchange">
          {{ nameExchange }}
        </option>
      </select>

      <br>

      <label for="buyAmount">Quantity to purchase</label>
      <input type="number" id="buyAmount" name="amount" v-model="quantityBuy" min="1" max="100" step="1">
      <br>

      <button type="submit" @click="makePurchase">BUY</button>

      <br>

      <p v-if="selectedExchangeBuyCrypto !== null && selectedBuyCrypto !== null && quantityBuy !== null && quantityBuy > 0">{{ priceMessage }}</p>

      <br>

      <p v-if="errorMessageBuy">{{ errorMessageBuy }}</p>

    </div>

    <br>

    <!-- ******************************************************************************************************************************** -->

    <div>
      <p>VENTA</p>

      <label for="saleCrypo">SELECT THE CRYPTO TO SELL       </label>
      <select id="saleCrypto" v-model="selectedSellCrypto">
        <option v-for="(nameCoins, index) in typesOfCoins" :key="index" :value="nameCoins">
          {{ nameCoins }}
        </option>
      </select>

      <br>

      <label>SELECT THE EXCHANGE TO SELL         </label>
      <select id="sellExchangeCrypto" v-model="selectedExchangeSellCrypto">
        <option v-for="(nameExchange, index) in Exchanges" :key="index" :value="nameExchange">
          {{ nameExchange }}
        </option>
      </select>

      <br>

      <label for="sellAmount">Quantity to sell      </label>
      <input type="number" id="sellAmount" name="amount" v-model="quantitySell" min="1" max="100" step="1">
      <br>

      <button type="submit" @click="makeSale">SALE</button>
    </div>

    <p v-if="selectedExchangeSellCrypto !== null && selectedSellCrypto !== null && quantitySell !== null && quantitySell > 0">{{ priceMessage }}</p>

    <br>

    <p v-if="errorMessage">{{ errorMessage }}</p>

  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import CryptoService from '@/services/CryptoService';
import { mapGetters } from 'vuex';

export default {
  name: 'BuyingAndSellingView',
  components: {
    NavigationBar,
  },
  data() {
    return {
      typesOfCoins: ['BTC', 'ETC', 'USDT', 'USDC', 'DAI', 'UXD', 'USDP', 'WLD', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'TRX', 'LINK', 'DOT', 'MATIC',
        'SHIB', 'LTC', 'BHC', 'EOS', 'XLM', 'FTM', 'AAVE', 'UNI', 'ALGO', 'BAT', 'PAXG', 'CAKE', 'AXS', 'SLP', 'MANA', 'SAND', 'CHZ'],
      selectedBuyCrypto: '',
      selectedSellCrypto: '',
      quantityBuy: '',
      quantitySell: '',
      selectedExchangeBuyCrypto: '',
      selectedExchangeSellCrypto: '',
      Exchanges: ['LETSBIT', 'BITSOALPHA', 'CRYPTOMKT', 'BITGETP2P', 'BUENBIT', 'ELUTER', 'ELDORADOP2P', 'RIPIO', 'BITSO', 'PAXFULP2P', 'FIWIND', 'BINANCEP2P',
        'SATOSHITANGO', 'KRIPTONMARKET', 'ARGENBTC', 'OKEXP2P', 'TIENDACRYPTO', 'LEMONCASH', 'COCOSCRYPTO', 'BYBIT', 'BINANCE', 'PAYDECEP2P', 'TRUBIT',
        'KUCOINP2P', 'RIPIOEXCHANGE', 'VIBRANT', 'PLUSCRYPTO', 'BYBITP2P', 'CRYPTOMKTPRO', 'BELO', 'CALYPSO', 'BITMONEDERO', 'COINEXP2P', 'DECRYPTO', 'SALDO',
        'HUOBIP2P', 'LEMONCASHP2P', 'BINGXP2P', 'TRUBITP2P', 'LNP2PBOTP2P', 'SYKLOP2P', 'XAPO'],
      buyPrice: null,
      sellPrice: null,
      errorMessageBuy: '',
    };
  },
  methods: {
    fetchPrice() {
      if (this.selectedExchangeBuyCrypto !== null && this.selectedBuyCrypto !== null && this.quantityBuy !== null && this.quantityBuy > 0) {
        CryptoService.getPrice(this.selectedExchangeBuyCrypto, this.selectedBuyCrypto, this.quantityBuy)
          .then((response) => {
            this.buyPrice = response.data.totalAsk;
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (this.selectedExchangeSellCrypto !== null && this.selectedSellCrypto !== null && this.quantitySell !== null && this.quantitySell > 0) {
        CryptoService.getPrice(this.selectedExchangeSellCrypto, this.selectedSellCrypto, this.quantitySell)
          .then((response) => {
            this.sellPrice = response.data.totalBid;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    makePurchase() {
      if (this.password && this.quantityBuy > 0 && this.buyPrice > 0) {
        const objectsDataPurchase = {
          user_id: this.password, // Corregido de 'usert_id' a 'user_id'
          action: 'purchase',
          crypto_code: this.selectedBuyCrypto,
          crypto_amount: this.quantityBuy,
          money: this.buyPrice,
          datetime: this.getDateandTime(),
        };

        CryptoService.postloadpurchase(objectsDataPurchase)
          .then(() => {
            alert('Purchase completed successfully!');
            this.resetPurchaseForm(); // Resetea el formulario después de la compra
          })
          .catch((error) => {
            console.error('Error during purchase:', error);
            alert('There was an error processing your purchase.');
          });
      } else {
        this.errorMessageBuy = 'Please make sure all required fields are filled in. Please note that the amount to buy or sell cannot be less than 0.';
        this.resetPurchaseForm();
      }
    },
    resetPurchaseForm() {
      this.selectedBuyCrypto = '';
      this.quantityBuy = '';
      this.selectedExchangeBuyCrypto = '';
      this.buyPrice = null;
    },
    makeSale() {
      CryptoService.getPrice(this.selectedExchangeSellCrypto, this.selectedSellCrypto, this.quantitySell)
        .then((response) => {
          this.sellPrice = response.data.totalBid;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getDateandTime() {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}`;
    },
  },
  computed: {
    ...mapGetters(['password']),
    priceMessage() {
      this.fetchPrice();
      if (this.selectedExchangeBuyCrypto !== null && this.selectedBuyCrypto !== null && this.quantityBuy !== null && this.buyPrice !== null) {
        return `${this.quantityBuy} ${this.selectedBuyCrypto} at ${this.selectedExchangeBuyCrypto} = ARS${this.buyPrice}`;
      }
      if (this.selectedExchangeSellCrypto !== null && this.selectedSellCrypto !== null && this.quantitySell !== null && this.sellPrice !== null) {
        return `${this.quantitySell} ${this.selectedSellCrypto} at ${this.selectedExchangeSellCrypto} = ARS${this.sellPrice}`;
      }
      return '';
    },
  },
};
</script>

<style scoped>
/* Aquí va tu CSS */
</style>
