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

    <p v-if="errorMessageSell">{{ errorMessageSell }}</p>

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
      typesOfCoins: ['BTC', 'ETH', 'USDT', 'USDC', 'DAI', 'UXD', 'USDP', 'WLD', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'TRX', 'LINK', 'DOT', 'MATIC',
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
      errorMessageSell: '',
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
    validation(type) {
      const validations = {
        purchase: [
          { condition: !this.password, message: 'Password is required.' },
          { condition: !this.selectedExchangeBuyCrypto, message: 'No exchange has been selected.' },
          { condition: !this.selectedBuyCrypto, message: 'No cryptocurrency has been selected.' },
          { condition: this.quantityBuy <= 0, message: 'The quantity must be greater than 0.' },
          { condition: this.buyPrice <= 0, message: 'The purchase price must be greater than 0.' },
        ],
        sale: [
          { condition: !this.selectedExchangeSellCrypto, message: 'No exchange has been selected.' },
          { condition: !this.selectedSellCrypto, message: 'No cryptocurrency has been selected.' },
          { condition: this.quantitySell <= 0, message: 'The quantity must be greater than 0.' },
          { condition: this.sellPrice <= 0, message: 'The sale price must be greater than 0.' },
        ],
      };

      /* Creo los 2 arrays de objetos (purchase y sale) y aca  en esta funcion con el type que recibe consulta, en esta funcion es una clave.
       purchse(clave) : [arrays de obbetos] (valor) */

      const failedValidation = validations[type].find((validation) => validation.condition);

      if (failedValidation) {
        if (type === 'purchase') {
          this.errorMessageBuy = failedValidation.message;
        } else if (type === 'sale') {
          this.errorMessageSell = failedValidation.message;
        }
        return false; // Return false if there is an error
      }

      if (type === 'purchase') {
        this.errorMessageBuy = '';
      } else if (type === 'sale') {
        this.errorMessageSell = '';
      }

      return true; // Return true if validation passed
    },
    makePurchase() {
      if (!this.validation('purchase')) return; // Si esto es falso, es porque no paso las validaciones

      // Si todas las validaciones pasan, proceder con la compra
      const objectsDataPurchase = {
        user_id: this.password,
        action: 'purchase',
        crypto_code: this.selectedBuyCrypto,
        crypto_amount: this.quantityBuy,
        money: this.buyPrice,
        datetime: this.getDateandTime(),
      };

      console.log(objectsDataPurchase);

      CryptoService.PostSaveCryptoPurchase(objectsDataPurchase)
        .then(() => {
          alert('Purchase completed successfully!');
          this.resetPurchaseForm(); // Resetea el formulario después de la compra
        })
        .catch((error) => {
          console.error('Error during purchase:', error);
          alert('There was an error processing your purchase.');
        });
    },
    resetPurchaseForm() {
      this.selectedBuyCrypto = '';
      this.quantityBuy = '';
      this.selectedExchangeBuyCrypto = '';
      this.buyPrice = null;
      this.selectedSellCrypto = '';
      this.quantitySell = '';
      this.selectedExchangeSellCrypto = '';
      this.sellPrice = null;
    },
    makeSale() {
      if (!this.validation('sale')) return; // Si esto es falso, es porque no paso las validaciones

      // Si todas las validaciones pasan, proceder con la compra
      const objectsDataSale = {
        user_id: this.password,
        action: 'sale',
        crypto_code: this.selectedSellCrypto,
        crypto_amount: this.quantitySell,
        money: this.sellPrice,
        datetime: this.getDateandTime(),
      };

      // console.log(objectsDataSale);

      CryptoService.PostSaveCryptoSale(objectsDataSale)
        .then(() => {
          alert('Purchase completed successfully!');
          this.resetPurchaseForm();
        })
        .catch((error) => {
          console.error('Error during purchase:', error);
          alert('There was an error processing your purchase.');
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
        return `${this.quantityBuy} ${this.selectedBuyCrypto} AT ${this.selectedExchangeBuyCrypto} = ARS ${this.buyPrice}`;
      }
      if (this.selectedExchangeSellCrypto !== null && this.selectedSellCrypto !== null && this.quantitySell !== null && this.sellPrice !== null) {
        return `${this.quantitySell} ${this.selectedSellCrypto} AT ${this.selectedExchangeSellCrypto} = ARS ${this.sellPrice}`;
      }
      return '';
    },
  },
};
</script>

<style scoped>
/* Aquí va tu CSS */
</style>
