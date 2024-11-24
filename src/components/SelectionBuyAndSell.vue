<template>

  <div class="buy-sell-container">

    <!-- PROCESO DE COMPRA-->
    <div>
      <h3>PURCHASE OF CRYPTOCURRENCIES</h3>

      <select id="buyCrypto" v-model="selectedBuyCrypto">
        <option disabled value="">SELECT THE CRYPTO TO BUY</option>
        <option v-for="(nameCoins, index) in getTypesOfCoins" :key="index" :value="nameCoins">
          {{ nameCoins }}
        </option>
      </select> <br>

      <select id="buyExchangeCrypto" v-model="selectedExchangeBuyCrypto">
        <option disabled value="">SELECT THE EXCHANGE TO BUY </option>
        <option v-for="(nameExchange, index) in this.getExchanges" :key="index" :value="nameExchange">
          {{ nameExchange }}
        </option>
      </select> <br>

      <label for="buyAmount"></label>
      <input type="number" id="buyAmount" name="amount" placeholder='QUANTITY TO PURCHASE' v-model="quantityBuy" min="0.000001" max="1000000" step="1">
      <br>

      <button class="button-buy-sale" type="submit" id="btnPurchase" @click="makePurchase">BUY</button>
      <button class="button-buy-sale" type="submit"  @click="cancel('buy')">CANCEL</button> <br>

      <p v-if="errorMessageBuy" class="error-messages">{{ errorMessageBuy }}</p>

      <p v-if="loadingProgress === 100 && !errorMessageBuy" class="result-price">{{ messagePriceBuy }}</p> <br> <br>
    </div>

    <!-- BARRA DE PROGRESO -->
    <ProgressBar v-if="loadingProgress > 0" :loadingProgress="loadingProgress" :showBar="showProgressBar"></ProgressBar>

    <!-- PROCESO DE VENTA-->
    <div>
      <h3>SALE OF CRYPTOCURRENCIES</h3>

      <select id="saleCrypto" v-model="selectedSellCrypto">
        <option disabled selected value="">SELECT THE CRYPTO TO SELL </option>
        <option v-for="(nameCoins, index) in getTypesOfCoins" :key="index" :value="nameCoins">
           {{ nameCoins }}
        </option>
      </select> <br>

      <select id="sellExchangeCrypto" v-model="selectedExchangeSellCrypto">
        <option disabled selected value="">SELECT THE EXCHANGE TO SELL </option>
        <option v-for="(nameExchange, index) in getExchanges" :key="index" :value="nameExchange">
        {{ nameExchange }}
        </option>
      </select> <br>

      <label for="sellAmount"></label>
      <input type="number" id="sellAmount" name="amount" placeholder="QUANTITY TO SELL " v-model="quantitySell" min="0.000001" max="1000000" step="1"> <br>

      <button class="button-buy-sale"  type="submit" @click="makeSale">SALE</button>
      <button class="button-buy-sale"  type="submit"  @click="cancel('sell')">CANCEL</button> <br>

      <p v-if="errorMessageSell" class="error-messages">{{ errorMessageSell }}</p>

      <p v-if="loadingProgress === 100 && !errorMessageSell " class="result-price">{{ messagePriceSell }}</p> <br>
    </div>

    <!-- MENSAJE DE ERROR -->
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
      messagePriceBuy: '',
      messagePriceSell: '',
    };
  },
  watch: {
    selectedBuyCrypto: 'purchaseCondition',
    selectedExchangeBuyCrypto: 'purchaseCondition',
    quantityBuy: 'purchaseCondition',
    selectedSellCrypto: 'saleCondition',
    selectedExchangeSellCrypto: 'saleCondition',
    quantitySell: 'saleCondition',
  },
  methods: {

    /**
 * Método asincrónico que maneja la condición de compra de criptomonedas.
 *
 * @async
 * @returns {Promise<void>} No retorna ningún valor.
 */
    async purchaseCondition() {
      try {
        this.buyCondition = this.selectedExchangeBuyCrypto && this.selectedBuyCrypto && this.quantityBuy > 0;

        if (this.buyCondition) {
          this.messagePriceSell = '';
          this.resetSellFields();

          await this.fetchPrice();
          this.messagePriceBuy = `${this.quantityBuy} ${this.selectedBuyCrypto} = ${this.purchasePrice}`;
        }
      } catch (error) {
        console.error('Error in purchaseCondition:', error);
        this.setModalMessage('An error occurred while processing the purchase condition. Please try again later.', true);
      }
    },

    /**
 * Método asincrónico que maneja la condición de venta de criptomonedas.
 *
 * @async
 * @returns {Promise<void>} No retorna ningún valor.
 */
    async saleCondition() {
      try {
        this.sellCondition = this.selectedExchangeSellCrypto && this.selectedSellCrypto && this.quantitySell > 0;

        if (this.sellCondition) {
          this.messagePriceBuy = '';
          this.resetBuyFields();

          await this.fetchPrice();
          this.messagePriceSell = `${this.quantitySell} ${this.selectedSellCrypto} = ${this.sellPrice}`;
        }
      } catch (error) {
        console.error('Error in saleCondition:', error);
        this.setModalMessage('An error occurred while processing the sale condition. Please try again later.', true);
      }
    },

    /**
 * Método asincrónico que maneja la obtención de precios para compra y venta de criptomonedas.
 *
 * @returns {Promise<void>} No retorna ningún valor.
 */

    async fetchPrice() {
      try {
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

        this.isCalling = false;
        this.showProgressBar = false;
      } catch (error) {
        console.error('Error fetching price:', error);
        this.setModalMessage('An error occurred while fetching the price. Please try again later.', true);
        this.isCalling = false;
        this.showProgressBar = false;
      }
    },

    /**
 * Maneja la obtención del precio para una operación de compra o venta.
 *
 * @param {string} type - Tipo de operación, puede ser 'purchase' o 'sale'.
 * @param {string} exchange - Plataforma en el que se realizará la operación.
 * @param {string} crypto - Criptomoneda seleccionada para la operación.
 * @param {number} quantity - Cantidad de criptomonedas a comprar o vender.
 * @returns {Promise<void>} No retorna ningún valor.
*/

    async handleFetchPrice(type, exchange, crypto, quantity) {
      try {
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
      } catch (error) {
        console.error('Error fetching price:', error);
        this.setModalMessage('An error occurred while fetching the price. Please try again later.', true);
        this.resetBuyFields();
        this.resetSellFields();
      }
    },

    /**
 * Restablece los campos de la interfaz de compra a sus valores iniciales.
 *
 * @returns {void} No retorna ningún valor.
*/

    resetBuyFields() {
      this.selectedBuyCrypto = '';
      this.selectedExchangeBuyCrypto = '';
      this.quantityBuy = '';
    },

    /**
 * Restablece los campos de la interfaz de venta a sus valores iniciales.
 *
 * @returns {void} No retorna ningún valor.
*/

    resetSellFields() {
      this.selectedSellCrypto = '';
      this.selectedExchangeSellCrypto = '';
      this.quantitySell = '';
    },

    /**
 * Cancela la operación de compra o venta, limpiando los campos correspondientes.
 *
 * @param {string} type - El tipo de operación ('buy' o 'sell') que se va a cancelar.
 * @returns {void} No retorna ningún valor.
*/

    cancel(type) {
      if (type === 'buy') {
        this.errorMessageBuy = '';
        this.messagePriceBuy = '';
        this.resetBuyFields();
      } else if (type === 'sell') {
        this.errorMessageSell = '';
        this.messagePriceSell = '';
        this.resetSellFields();
      }
    },

    /**
 * Función para validar los datos de compra y venta.
 *
 * @param {string} type - El tipo de operación a validar: 'purchase' o 'sale'.
 * @returns {boolean} Devuelve `true` si la validación es exitosa (sin errores) o `false` si hay errores de validación.
*/

    validation(type) {
      const validations = { // Arrays de objetos para validar los datos y los posibles ERRORES.
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

    /**
 * Función que valida los datos de compra; si son correctos, los envía a la base de datos RESTDB. Si no pasan la
 * validación, muestra un mensaje de error.
 *
 * @returns {void} No retorna ningún valor, pero maneja el proceso de compra y muestra errores si los hay.
*/

    async makePurchase() {
      try {
        if (!this.validation('purchase')) {
          this.errorMessageSell = '';
          return; // Si esto es falso, es porque no paso las validaciones
        }

        if (this.purchasePrice <= 0) {
          this.errorMessageBuy = '* The purchase price must be greater than 0.';
          return;
        }

        // Si pasa la validación, consulta el precio de compra por si ha variado.
        await this.fetchPrice();

        // Si todas las validaciones pasan, procede con la compra
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
      } catch (error) {
        console.error('Error making purchase:', error);
        this.setModalMessage('An error occurred while processing the purchase. Please try again later.', true);
      }
    },

    /**
 * Guarda los datos de la compra en la API de la base de datos (RESTDB).
 *
 * @param {Object} objectsDataPurchase Los datos de la compra (ej. usuario, criptomoneda, cantidad, precio, fecha/hora).
 * @returns {void} No retorna ningún valor, pero maneja el proceso de guardar la compra y muestra mensajes de éxito o error.
*/

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
        this.messagePriceBuy = '';
        this.errorMessageSell = '';
      }
    },

    /**
 * Establece el mensaje y la visibilidad del modal en función de los parámetros proporcionados.
 *
 * @param {string} message El mensaje que se mostrará en el modal.
 * @param {boolean} showButton Determina si se debe mostrar un botón en el modal.
 * @returns {void} No retorna ningún valor, solo actualiza las variables relacionadas con el modal.
 */
    setModalMesagge(message, showButton) {
      this.showModal = true; // Esto se muestra siempre por eso no se pasa, los demas varian.
      this.showButton = showButton;
      this.messageApp = message;
    },

    /**
 * Realiza una operación de venta de criptomonedas. Valida los datos de la venta. Si son correctos, obtiene los datos de
 * la transacción del usuario. Si la transacción es válida, procede con la venta.
 *
 * @returns {Promise<void>} No retorna ningún valor.
*/
    async makeSale() {
      try {
        if (!this.validation('sale')) { // Si esto es falso, es porque no paso las validaciones
          this.errorMessageBuy = '';
          return;
        }

        if (this.sellPrice <= 0) {
          this.errorMessageSell = 'The sale price must be greater than 0.';
          return;
        }

        const hasData = await this.getUserTransactionData();

        if (!hasData) {
          this.setModalMesagge('Failed to obtain transaction data. Please refresh the page or try again later.', true);
          this.resetSellFields();
          return;
        }
        if (this.userTransactionResults?.length <= 0) {
          this.setModalMesagge('There are currently no transactions to display.', true);
          this.resetSellFields();
          return;
        }
        await this.operationSale();
      } catch (error) {
        console.error('Error making sale:', error);
        this.setModalMessage('An error occurred while processing the sale. Please try again later.', true);
      }
    },

    /**
 * Realiza la operación de venta de criptomonedas, validando la disponibilidad de las monedas y la cantidad seleccionada.
 *
 * @returns {Promise<void>} No retorna ningún valor. Si ocurre un error, muestra un mensaje de error y restablece los campos de venta.
 */

    async operationSale() {
      try {
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
      } catch (error) {
        console.error('Error during sale operation:', error);
        this.setModalMessage('An error occurred while processing the sale. Please try again later.', true);
        this.resetSellFields();
      }
    },

    /**
 * Guarda la transacción de venta de criptomonedas en la base de datos.
 *
 * @param {Object} objectsDataSale - Los datos de la venta, incluyendo el ID del usuario, acción, criptomoneda, cantidad, precio y fecha.
 * @returns {Promise<void>} No retorna ningún valor. Muestra mensajes en la interfaz de usuario según el resultado de la operación.
*/
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
        this.messagePriceSell = '';
      }
    },

    /**
 * Genera una cadena de fecha y hora en formato ISO 8601 en UTC, recortando los milisegundos.
 *
 * @returns {string} La fecha y hora actual en formato `YYYY-MM-DDTHH:mm:ssZ`, en UTC. Ejemplo: "2024-11-09T11:15Z"
 */
    getDateandTime() {
      const dateNow = new Date();
      return `${dateNow.toISOString().slice(0, -5)}Z`; // Recorta los milisegundos
    },

    /**
 * Si los parametros son validos. Genera un mensaje con los detalles de la transacción de compra o venta de criptomonedas.
 *
 * @param {number} quantity - La cantidad de criptomonedas a comprar o vender.
 * @param {string} crypto - El código de la criptomoneda (ej. 'BTC', 'ETH').
 * @param {string} exchange - El exchange  donde se realiza la operación (ej. 'Lestbit', 'Ripio').
 * @param {string} type - El tipo de operación, puede ser 'purchase' o 'sale'.
 * @returns {string} Un mensaje formateado con la información de la transacción o un mensaje de error si los datos son inválidos o no están disponibles.
*/
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

  },
};
</script>

<style scoped>

input {
  margin: 5px 0;
}

.result-price{
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
  white-space: pre-line;
  font-weight: bold;
  font-size: 20px;
}

.error-messages {
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
  white-space: pre-line;
  color: red;
  font-weight: bold;
}

.buy-sell-container{
  min-width: 1250px;
  display: grid;
  grid-template-columns: repeat(2,1fr);
  margin-top: 50px;
  color: white;
}

select,
input[type="number"]{
  display: block;
  margin: 0px auto;
  margin-top: 20px;
  width: 60%;
  height: 30px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px #ccc inset;
  border-radius: 5px;
  padding-left: 10px;
  color: rgb(49, 48, 48);
}

input[type="number"]{
  width: 58%;
}

input::placeholder {
  color:  rgb(49, 48, 48);
}

select:hover,
input[type="number"]:hover{
  box-shadow: 1px 1px 1px #ccc inset;
}

.button-buy-sale {
  text-align: center;
  padding: 10px 20px; /*Padding en lugar de width y height */
  margin-top: 20px;
  color: black;
  background: rgb(247, 166, 0);
  border: 1px solid #081f27;
  border-radius: 5px;
  cursor: pointer;
  font-size: 17px;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  margin-left: 17px;
  margin-bottom: 20px;
  transition: background 300ms, box-shadow 300ms;
}

button:hover{
  box-shadow: 0px 5px 5px gray;
}
</style>
