<template>
  <div>
  <p>PURCHASE OF CRYPTOCURRENCIES</p>

    <label for="buyCrypto">SELECT THE CRYPTO TO BUY </label>
    <select id="buyCrypto" v-model="selectedBuyCrypto">
      <option v-for="(nameCoins, index) in getTypesOfCoins" :key="index" :value="nameCoins">
        {{ nameCoins }}
      </option>
    </select> <br>

    <label for="buyExchangeCrypto">SELECT THE EXCHANGE TO BUY </label>
    <select id="buyExchangeCrypto" v-model="selectedExchangeBuyCrypto">
      <option v-for="(nameExchange, index) in this.getExchanges" :key="index" :value="nameExchange">
        {{ nameExchange }}
      </option>
    </select> <br>

    <label for="buyAmount">QUANTITY TO PURCHASE </label>
    <input type="number" id="buyAmount" name="amount" v-model="quantityBuy" min="0.000001" max="1000000" step="1">
    <br>

    <button type="submit" id="btnPurchase" @click="makePurchase">BUY</button> <br>

    <p v-if="errorMessageBuy" class="error-messages">{{ errorMessageBuy }}</p>

    <p v-if="loadingProgress === 100 && !errorMessageBuy && selectedExchangeBuyCrypto && selectedBuyCrypto && quantityBuy && quantityBuy > 0 "
      >{{ priceMessageBuy }}</p> <br> <br>
  </div>

  <ProgressBar v-if="loadingProgress > 0" :loadingProgress="loadingProgress" :showBar="showProgressBar"></ProgressBar>
  <!-- ************************************** -->
  <div>
    <p>SALE OF CRYPTOCURRENCIES</p>

    <label for="saleCrypo">SELECT THE CRYPTO TO SELL </label>
    <select id="saleCrypto" v-model="selectedSellCrypto">
      <option v-for="(nameCoins, index) in getTypesOfCoins" :key="index" :value="nameCoins">
        {{ nameCoins }}
      </option>
    </select> <br>

    <label for="sellExchangeCrypto">SELECT THE EXCHANGE TO SELL </label>
    <select id="sellExchangeCrypto" v-model="selectedExchangeSellCrypto">
      <option v-for="(nameExchange, index) in getExchanges" :key="index" :value="nameExchange">
        {{ nameExchange }}
      </option>
    </select> <br>

    <label for="sellAmount">QUANTITY TO SELL </label>
    <input type="number" id="sellAmount" name="amount" v-model="quantitySell" min="0.000001" max="1000000" step="1"> <br>

    <button type="submit" @click="makeSale">SALE</button>

    <p v-if="errorMessageSell" class="error-messages">{{ errorMessageSell }}</p>

    <p v-if="loadingProgress === 100 && !errorMessageSell && selectedExchangeSellCrypto && selectedSellCrypto && quantitySell && quantitySell> 0"
    >{{ priceMessageSell }}</p> <br>

    <MessagesApp :isVisible="showModal" :message="messageApp" :showCloseButton ="showButton" @close="showModal = false"></MessagesApp>
  </div>

</template>

<script>
import CryptoService from '@/services/CryptoService';
import { mapGetters, mapActions } from 'vuex';
import MessagesApp from './MessagesApp.vue';
import ProgressBar from './ProgressBar.vue';

export default {
  name: 'SelectionBuyAndSell',
  components: {
    MessagesApp,
    ProgressBar,
  },
  created() {
    this.initializeExchanges();
    this.initializeTypesOfCoins();
    this.showProgressBar = false;
  },
  data() {
    return {
      showProgressBar: true,
      showButton: false,
      showModal: false,
      messageApp: '',
      selectedBuyCrypto: '',
      selectedSellCrypto: '',
      quantityBuy: '',
      quantitySell: '',
      selectedExchangeBuyCrypto: '',
      selectedExchangeSellCrypto: '',
      errorMessageBuy: '',
      errorMessageSell: '',
      isCalling: false,
      response: false,
      buyCondition: '',
      sellCondition: '',
    };
  },
  watch: {
    selectedBuyCrypto: 'fetchPrice',
    selectedExchangeBuyCrypto: 'fetchPrice',
    quantityBuy: 'fetchPrice',
    selectedSellCrypto: 'fetchPrice',
    selectedExchangeSellCrypto: 'fetchPrice',
    quantitySell: 'fetchPrice',
  },
  methods: {
  /* SI LOS DATOS SON CORRECTOS, LLAMA AUTOMATICAMENTE A LA FUNCION QUE LLAMA A LA API PARA MOSTRAR EL MENSAJE, SI NO ESTAN TODOS COMPLETOS, NO
  LOS LLAMA */

    async fetchPrice() {
      this.buyCondition = this.selectedExchangeBuyCrypto && this.selectedBuyCrypto && this.quantityBuy > 0;
      this.sellCondition = this.selectedExchangeSellCrypto && this.selectedSellCrypto && this.quantitySell > 0;

      if (this.isCalling) return;

      this.isCalling = true;
      this.showProgressBar = this.buyCondition || this.sellCondition;

      if (this.buyCondition) {
        await this.handleFetchPrice(
          'purchase',
          this.selectedExchangeBuyCrypto,
          this.selectedBuyCrypto,
          this.quantityBuy,
        );
      }

      if (this.sellCondition) {
        await this.handleFetchPrice(
          'sale',
          this.selectedExchangeSellCrypto,
          this.selectedSellCrypto,
          this.quantitySell,
        );
      }

      // Restablece los mensajes de error
      this.errorMessageBuy = '';
      this.errorMessageSell = '';

      this.isCalling = false;
      this.showProgressBar = false;
    },

    async handleFetchPrice(type, exchange, crypto, quantity) {
      await this.fetchCryptoPrice({
        exchange,
        crypto,
        quantity,
        type,
      });

      const price = type === 'purchase' ? this.purchasePrice : this.sellPrice;

      if ((type === 'purchase' && (price === null || Number.isNaN(price)))
      || (type === 'sale' && (price === null || Number.isNaN(price)))) {
        this.showModal = true;
        this.showButton = true;
        this.messageApp = type === 'purchase' ? this.buyErrorMessage : this.saleErrorMessage;
        this.resetBuyFields();
        this.resetSellFields();
      }
    },
    // FUNCION QUE RESETE LOS VALORES DE LAS COMPRAS
    resetBuyFields() {
      this.selectedBuyCrypto = null;
      this.selectedExchangeBuyCrypto = null;
      this.quantityBuy = null;
    },

    // FUNCION QUE RESETE LOS VALORES DE LAS VENTAS
    resetSellFields() {
      this.selectedSellCrypto = null;
      this.selectedExchangeSellCrypto = null;
      this.quantitySell = null;
    },

    // FUNCION PARA VALIDAR COMPRA y VENTA
    validation(type) {
      // Crea arrays de objetos para validar los datos y los posibles ERRORES.
      const validations = {
        purchase: [
          { condition: !this.selectedExchangeBuyCrypto, message: '* No exchange has been selected.' },
          { condition: !this.selectedBuyCrypto, message: '* No cryptocurrency has been selected.' },
          { condition: this.quantityBuy <= 0, message: '* The quantity must be greater than 0.' },
        ],
        sale: [
          { condition: !this.selectedExchangeSellCrypto, message: '* No exchange has been selected.' },
          { condition: !this.selectedSellCrypto, message: '* No cryptocurrency has been selected.' },
          { condition: this.quantitySell <= 0, message: '* The quantity must be greater than 0.' },
        ],
      };

      /* Creo los 2 arrays de objetos (purchase y sale) y aca  en esta funcion con el type que recibe consulta, en esta funcion es una clave.
     purchse(clave) : [arrays de objetos] (valor) */

      const errorMessages = [];

      // Recorre las validaciones para encontrar errores y acumular mensajes.
      validations[type].forEach((validation) => {
        if (validation.condition) {
          errorMessages.push(validation.message);
        }
      });

      // Maneja los mensajes de error si hay alguno.
      if (errorMessages.length > 0) {
        if (type === 'purchase') {
          this.errorMessageBuy = errorMessages.join('\n');
        } else if (type === 'sale') {
          this.errorMessageSell = errorMessages.join('\n');
        }
        return false; // Devuelve falso si hay errores.
      }

      if (type === 'purchase') {
        this.errorMessageBuy = '';
      } else if (type === 'sale') {
        this.errorMessageSell = '';
      }

      return true; // Return true if validation passed
    },

    // FUNCIÓN QUE VALIDA LOS DATOS DE COMPRA; SI SON CORRECTOS, LOS ENVÍA A RESTDB, DE LO CONTRARIO, MUESTRA UN ERROR.
    async makePurchase() {
      if (!this.validation('purchase')) {
        this.resetBuyFields();
        this.resetSellFields();
        this.errorMessageSell = '';
        return; // Si esto es falso, es porque no paso las validaciones
      }

      if (this.purchasePrice <= 0) {
        this.errorMessageBuy = '* The purchase price must be greater than 0.';
        this.resetBuyFields();
        return;
      }

      await this.fetchPrice(); // Por si el precio llega a variar.

      // Si todas las validaciones pasan, proceder con la compra
      const objectsDataPurchase = {
        user_id: this.password,
        action: 'purchase',
        crypto_code: this.selectedBuyCrypto,
        crypto_amount: this.quantityBuy,
        money: this.purchasePrice,
        datetime: this.getDateandTime(),
      };
      console.log(`COMPRA: datetime: ${objectsDataPurchase.datetime}`);
      this.saveTransactionsPurchases(objectsDataPurchase);
    },

    // GUARDAR LOS DATOS DE LAS COMPRAS EN LA API DE BBDD
    async saveTransactionsPurchases(objectsDataPurchase) {
      try {
        this.setModalMesagge('Processing purchase...', false);

        if (!this.response) {
          await CryptoService.PostSaveCryptoPurchase(objectsDataPurchase);
          this.setModalMesagge('Purchase completed successfully!', true);
        }
      } catch (error) {
        console.error('Error during purchase:', error);
        this.setModalMesagge('There was an error processing your purchase.', true);
      } finally {
        this.resetBuyFields(); // Resetea el formulario después de la compra
        this.resetSellFields();
      }
    },

    setModalMesagge(message, showButton) {
      this.showModal = true; // Esto se muestra siempre por eso no se pasa, los demas varian.
      this.showButton = showButton;
      this.messageApp = message;
    },

    // FUNCIÓN QUE VALIDA LOS DATOS DE VENTA; SI SON CORRECTOS, LOS ENVÍA A RESTDB, DE LO CONTRARIO, MUESTRA UN ERROR.
    async makeSale() {
      if (!this.validation('sale')) {
        this.resetBuyFields();
        this.resetSellFields();
        this.errorMessageBuy = '';
        return;
      }
      // Si esto es falso, es porque no paso las validaciones

      if (this.sellPrice <= 0) {
        this.errorMessageSell = 'The sale price must be greater than 0.';
        this.resetSellFields();
        return;
      }

      const hasData = await this.getUserTransactionData();

      if (!hasData) {
        this.setModalMesagge('Failed to obtain transaction data. Please refresh the page or try again later.', true);
        this.resetSellFields();
        return;
      } // VER ACA LO DEL ? DE CHAT GPT
      if (this.userTransactionResults?.length <= 0) {
        this.setModalMesagge('There are currently no transactions to display.', true);
        this.resetSellFields();
        return;
      }
      await this.operationSale();
    },

    // FUNCION PARA SEPARAR LA LOGICA DE LA VENTA. SI ES PURCHASE SUMA LA CANTIDAD DE MONEDAS, SINO LA RESTA Y SE REGISTRA LA VENTA
    async operationSale() {
      let quantityOfCoins = 0;
      this.userTransactionResults.forEach((transactionData) => {
        if (this.selectedSellCrypto === transactionData.crypto_code && transactionData.action === 'purchase') {
          quantityOfCoins += transactionData.crypto_amount; // Si es es compra, suma
        } else if (this.selectedSellCrypto === transactionData.crypto_code && transactionData.action === 'sale') {
          quantityOfCoins -= transactionData.crypto_amount;
        }
      });

      if (quantityOfCoins === 0) {
        this.errorMessageSell = "* You don't have that type of currency available for sale.";
        console.log('No cuenta con ese tipo de moneda para vender.');
        this.resetSellFields();
        return;
      }

      if (this.quantitySell > quantityOfCoins) {
        this.errorMessageSell = "* You don't have that amount of coins available for sale.";
        console.log('No cuenta con esa cantidad de monedas para vender.');
        this.resetSellFields();
        return;
      }

      await this.fetchPrice(); // Por si el precio llega a variar.

      const objectsDataSale = {
        user_id: this.password,
        action: 'sale',
        crypto_code: this.selectedSellCrypto,
        crypto_amount: this.quantitySell,
        money: this.sellPrice,
        datetime: this.getDateandTime(),
      };

      console.log(`VENTA: datetime: ${objectsDataSale.datetime}`);

      await this.saveSalesTransactions(objectsDataSale);
    },

    // GUARDAR LOS DATOS DE LAS COMPRAS
    async saveSalesTransactions(objectsDataSale) {
      try {
        this.setModalMesagge('Processing sale...', false);

        if (!this.response) {
          await CryptoService.PostSaveCryptoSale(objectsDataSale);
          this.setModalMesagge('Sale completed successfully!', true);
        }
      } catch (error) {
        console.error('Error during purchase:', error);
        this.setModalMesagge('There was an error processing your sale.', true);
      } finally {
        this.resetSellFields();
      }
    },

    // FUNCION PARA OBTENER LA HORA EN EL FORMATO SOLICITADO
    getDateandTime() {
      const now = new Date();
      const options = {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
      };
      return `${now.toLocaleString('sv-SE', options).replace(' ', 'T')}Z`; // Formato: YYYY-MM-DDTHH:mm:ssZ
    },

    generatePriceMessage(quantity, crypto, exchange, type) {
      if (type === 'purchase') {
        this.resetSellFields();
        if (quantity !== null && crypto !== null && exchange !== null && this.purchasePrice !== null) {
          return `${quantity} ${crypto} AT ${exchange} = ARS ${this.purchasePrice}`;
        }
      }

      if (type === 'sale') {
        this.resetBuyFields();
        if (quantity !== null && crypto !== null && exchange !== null && this.sellPrice !== null) {
          return `${quantity} ${crypto} AT ${exchange} = ARS ${this.sellPrice}`;
        }
      }

      return 'Invalid input or price not available.';
    },
    ...mapActions({
      getUserTransactionData: 'userTransactionData/getUserTransactionData',
      fetchCryptoPrice: 'getPricesApi/fetchCryptoPrice',
      initializeExchanges: 'exchangesAndCurrencies/initializeExchanges',
      initializeTypesOfCoins: 'exchangesAndCurrencies/initializeTypesOfCoins',
    }),
  },

  computed: {
    ...mapGetters({
      password: 'password',
      userTransactionResults: 'userTransactionData/userTransactionResults',
      purchasePrice: 'getPricesApi/purchasePrice',
      sellPrice: 'getPricesApi/sellPrice',
      saleErrorMessage: 'getPricesApi/saleErrorMessage',
      buyErrorMessage: 'getPricesApi/buyErrorMessage',
      getExchanges: 'exchangesAndCurrencies/getExchanges',
      getTypesOfCoins: 'exchangesAndCurrencies/getTypesOfCoins',
      loadingProgress: 'getPricesApi/loadingProgress',
    }),

    priceMessageBuy() { // PARA MOSTRAR EL MENSAJE DE LA COMPRA DIRECTAMENTE EN EL TEMPLATE
      this.resetSellFields();
      if (this.selectedExchangeBuyCrypto && this.selectedBuyCrypto && this.quantityBuy > 0) {
        return `${this.quantityBuy} ${this.selectedBuyCrypto} = ${this.purchasePrice}`;
      }
      return '';
    },

    priceMessageSell() {
      this.resetBuyFields();
      if (this.selectedExchangeSellCrypto && this.selectedSellCrypto && this.quantitySell > 0) {
        return `${this.quantitySell} ${this.selectedSellCrypto} = ${this.sellPrice}`;
      }
      return '';
    },

  },
};
</script>

<style scoped>

input {
  margin: 5px 0;
}

.error-messages {
white-space: pre-line; /* Mantiene los saltos de línea */
color: red; /* Opcional, para resaltar los mensajes de error */
}
</style>
