<template>
  <p>PURCHASE OF CRYPTOCURRENCIES</p>

    <label for="buyCrypto">SELECT THE CRYPTO TO BUY </label>
    <select id="buyCrypto" v-model="selectedBuyCrypto">
      <option v-for="(nameCoins, index) in typesOfCoins" :key="index" :value="nameCoins">
        {{ nameCoins }}
      </option>
    </select> <br>

    <label for="buyExchangeCrypto">SELECT THE EXCHANGE TO BUY </label>
    <select id="buyExchangeCrypto" v-model="selectedExchangeBuyCrypto">
      <option v-for="(nameExchange, index) in Exchanges" :key="index" :value="nameExchange">
        {{ nameExchange }}
      </option>
    </select> <br>

    <label for="buyAmount">QUANTITY TO PURCHASE </label>
    <input type="number" id="buyAmount" name="amount" v-model="quantityBuy" min="0.000001" max="1000000" step="1">
    <br>

    <button type="submit" id="btnPurchase" @click="makePurchase">BUY</button> <br>

    <p v-if="errorMessageBuy" class="error-messages">{{ errorMessageBuy }}</p>

    <p v-if="!errorMessageBuy && selectedExchangeBuyCrypto && selectedBuyCrypto && quantityBuy && quantityBuy > 0 "
      >{{ priceMessageBuy }}</p> <br> <br>

  <!-- ************************************** -->

    <p>SALE OF CRYPTOCURRENCIES</p>

    <label for="saleCrypo">SELECT THE CRYPTO TO SELL </label>
    <select id="saleCrypto" v-model="selectedSellCrypto">
      <option v-for="(nameCoins, index) in typesOfCoins" :key="index" :value="nameCoins">
        {{ nameCoins }}
      </option>
    </select> <br>

    <label for="sellExchangeCrypto">SELECT THE EXCHANGE TO SELL </label>
    <select id="sellExchangeCrypto" v-model="selectedExchangeSellCrypto">
      <option v-for="(nameExchange, index) in Exchanges" :key="index" :value="nameExchange">
        {{ nameExchange }}
      </option>
    </select> <br>

    <label for="sellAmount">QUANTITY TO SELL </label>
    <input type="number" id="sellAmount" name="amount" v-model="quantitySell" min="0.000001" max="100" step="1"> <br>

    <button type="submit" @click="makeSale">SALE</button>

    <p v-if="errorMessageSell" class="error-messages">{{ errorMessageSell }}</p>

    <p v-if="!errorMessageSell && selectedExchangeSellCrypto && selectedSellCrypto && quantitySell && quantitySell> 0"
    >{{ priceMessageSell }}</p> <br>

</template>

<script>
import CryptoService from '@/services/CryptoService';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SelectionBuyAndSell',
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
      errorMessageBuy: '',
      errorMessageSell: '',
      isCalling: false,
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
      const buyCondition = this.selectedExchangeBuyCrypto && this.selectedBuyCrypto && this.quantityBuy && this.quantityBuy > 0;
      const sellConditions = this.selectedExchangeSellCrypto && this.selectedSellCrypto && this.quantitySell && this.quantitySell > 0;

      if (this.isCalling) {
        return;
      }

      this.isCalling = true;

      try {
        if (buyCondition) {
          await this.fetchCryptoPrice({
            exchange: this.selectedExchangeBuyCrypto,
            crypto: this.selectedBuyCrypto,
            quantity: this.quantityBuy,
            type: 'purchase',
          });

          if (this.purchasePrice === null || Number.isNaN(this.purchasePrice)) {
            console.log('ENTRO ACA COMPRA:', this.buyErrorMessage);
            this.resetBuyFields();
            this.errorMessageSell = '';
          }

          this.errorMessageBuy = '';
          this.errorMessageSell = '';
        } else if (sellConditions) {
          await this.fetchCryptoPrice({
            exchange: this.selectedExchangeSellCrypto,
            crypto: this.selectedSellCrypto,
            quantity: this.quantitySell,
            type: 'sale',
          });

          if (this.sellPrice === null || Number.isNaN(this.sellPrice)) {
            console.log('ENTRO ACA VENTA: ', this.saleErrorMessage);
            this.resetSellFields();
            this.errorMessageBuy = '';
          }
          this.errorMessageBuy = '';
          this.errorMessageSell = '';
        }
      } catch (error) {
        console.log('Error:', error);
      } finally {
        this.isCalling = false;
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
          { condition: !this.selectedExchangeBuyCrypto, message: 'No exchange has been selected.' },
          { condition: !this.selectedBuyCrypto, message: 'No cryptocurrency has been selected.' },
          { condition: this.quantityBuy <= 0, message: 'The quantity must be greater than 0.' },
        ],
        sale: [
          { condition: !this.selectedExchangeSellCrypto, message: 'No exchange has been selected.' },
          { condition: !this.selectedSellCrypto, message: 'No cryptocurrency has been selected.' },
          { condition: this.quantitySell <= 0, message: 'The quantity must be greater than 0.' },
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
        this.errorMessageSell = '';
        this.resetSellFields();
        return; // Si esto es falso, es porque no paso las validaciones
      }

      if (this.purchasePrice <= 0) {
        this.errorMessageBuy = 'The purchase price must be greater than 0.';
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

      this.saveTransactionsPurchases(objectsDataPurchase);
    },

    // GUARDAR LOS DATOS DE LAS COMPRAS EN LA API DE BBDD
    async saveTransactionsPurchases(objectsDataPurchase) {
      try {
        await CryptoService.PostSaveCryptoPurchase(objectsDataPurchase);
        alert('Purchase completed successfully!');
      } catch (error) {
        console.error('Error during purchase:', error);
        alert('There was an error processing your purchase.');
      } finally {
        this.resetBuyFields(); // Resetea el formulario después de la compra
        this.resetSellFields();
      }
      console.log('LO COMPRA REALIZADA: ', objectsDataPurchase);
    },

    // FUNCIÓN QUE VALIDA LOS DATOS DE VENTA; SI SON CORRECTOS, LOS ENVÍA A RESTDB, DE LO CONTRARIO, MUESTRA UN ERROR.
    async makeSale() {
      if (!this.validation('sale')) {
        this.resetBuyFields();
        this.errorMessageBuy = '';
        this.resetSellFields();
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
        return;
      }

      this.operationSale();

      console.log('LO QUE TRAE DE LA COMPRA DEL USUARIO: ', this.userTransactionResults);
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
        this.errorMessageSell = "You don't have that type of currency available for sale.";
        console.log('No cuenta con ese tipo de moneda para vender.');
        this.resetSellFields();
        return;
      }

      if (this.quantitySell > quantityOfCoins) {
        this.errorMessageSell = "You don't have that amount of coins available for sale.";
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

      this.saveSalesTransactions(objectsDataSale);
    },

    // GUARDAR LOS DATOS DE LAS COMPRAS
    async saveSalesTransactions(objectsDataSale) {
      try {
        await CryptoService.PostSaveCryptoSale(objectsDataSale);
        alert('Sale completed successfully!');
      } catch (error) {
        console.error('Error during purchase:', error);
        alert('There was an error processing your sale.');
      } finally {
        this.resetSellFields();
      }

      console.log('LO QUE GUARDA DE LA VENTA: ', objectsDataSale);
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
    ...mapActions('userTransactionData', ['getUserTransactionData']),
    ...mapActions('getPricesApi', ['fetchCryptoPrice']),
  },

  /* FALTA CONTROLAR LA HORA EN LAS VENTAS. IMPLEMENTAR LOS MENSAJES DE GTPRICESAPI !!!!!!!!!!!!!!!!!!! */

  computed: {
    ...mapGetters({
      password: 'password',
      userTransactionResults: 'userTransactionData/userTransactionResults',
      purchasePrice: 'getPricesApi/purchasePrice',
      sellPrice: 'getPricesApi/sellPrice',
      saleErrorMessage: 'getPricesApi/saleErrorMessage',
      buyErrorMessage: 'getPricesApi/buyErrorMessage',
    }),

    // PARA MOSTRAR EL MENSAJE DE LA COMPRA DIRECTAMENTE EN EL TEMPLATE

    priceMessageBuy() {
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

.error-messages {
white-space: pre-line; /* Mantiene los saltos de línea */
color: red; /* Opcional, para resaltar los mensajes de error */
}
</style>
