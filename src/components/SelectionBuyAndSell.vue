<template>
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

      <button type="submit" id="btnPurchase" @click="makePurchase" :disabled="isButtonDisabled">BUY</button>

      <br>
      <p v-if="errorMessageBuy" class="error-messages">{{ errorMessageBuy }}</p>

      <p v-if="!errorMessageBuy && selectedExchangeBuyCrypto && selectedBuyCrypto && quantityBuy && quantityBuy > 0">{{ priceMessage }}</p>

      <br>

    <br>

    <!-- ******************************************************************************************************************************** -->

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

      <button type="submit" @click="makeSale" :disabled="isButtonDisabled">SALE</button>

    <p v-if="errorMessageSell" class="error-messages">{{ errorMessageSell }}</p>

    <p v-if="!errorMessageSell && selectedExchangeSellCrypto && selectedSellCrypto && quantitySell && quantitySell > 0">{{ priceMessage }}</p>

    <br>

</template>

<script>
import CryptoService from '@/services/CryptoService';
import { mapGetters } from 'vuex';

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
      buyPrice: null,
      sellPrice: null,
      errorMessageBuy: '',
      errorMessageSell: '',
      resultado: [],
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
    fetchPrice() {
      if (this.selectedExchangeBuyCrypto && this.selectedBuyCrypto && this.quantityBuy && this.quantityBuy > 0) {
        this.fetchCryptoPrice(this.selectedExchangeBuyCrypto, this.selectedBuyCrypto, this.quantityBuy, 'buy');
      } else if (this.selectedExchangeSellCrypto && this.selectedSellCrypto && this.quantitySell && this.quantitySell > 0) {
        this.fetchCryptoPrice(this.selectedExchangeSellCrypto, this.selectedSellCrypto, this.quantitySell, 'sell');
      }
    },
    // FUNCION SOLO PARA LLAMAR A LA API Y OBTENER EL DATO QUE NECESITO DEPENDIENTO SI ES COMPRA O VENTA
    fetchCryptoPrice(exchange, crypto, quantity, type) {
      CryptoService.getPrice(exchange, crypto, quantity)
        .then((response) => {
          // Verifica si la respuesta y los datos son válidos
          if (response && response.data) {
            if (type === 'buy') {
              this.buyPrice = parseFloat(response.data.totalAsk).toFixed(2);
              this.errorMessageBuy = '';
            } else if (type === 'sell') {
              this.sellPrice = parseFloat(response.data.totalBid).toFixed(2);
              this.errorMessageSell = '';
            }
          } else {
            // Maneja el caso donde la respuesta es vacía o nula
            console.log('No hay cotización al momento');
            if (type === 'buy') {
              this.errorMessageBuy = 'No se encontraron datos de precios para la compra.';
            } else {
              this.errorMessageSell = 'No se encontraron datos de precios para la venta.';
            }
          }
        })
        .catch(() => {
          if (type === 'buy') {
            this.errorMessageBuy = 'Hubo un error al consultar los precios de compra en la API de www.criptoya.com.';
            this.resetPurchaseForm();
          } else {
            this.errorMessageSell = 'Hubo un error al consultar los precios de venta en la API de www.criptoya.com.';
            this.resetPurchaseForm();
          }
        });
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
    makePurchase() {
      if (!this.validation('purchase')) return; // Si esto es falso, es porque no paso las validaciones

      if (this.buyPrice <= 0) {
        this.errorMessageBuy = 'The purchase price must be greater than 0.';
        return;
      }

      this.fetchPrice(); // Por si el precio llega a variar.

      console.log(this.buyPrice);

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

      CryptoService.PostSaveCryptoPurchase(objectsDataPurchase) // Creo la solicitud POST para mandar el obejto a RestDB
        .then(() => {
          alert('Purchase completed successfully!');
          this.resetPurchaseForm(); // Resetea el formulario después de la compra
        })
        .catch((error) => {
          console.error('Error during purchase:', error);
          alert('There was an error processing your purchase.');
        });
    },
    // FUNCION PARA RESETEAR LOS VALORES
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
    // FUNCIÓN QUE VALIDA LOS DATOS DE VENTA; SI SON CORRECTOS, LOS ENVÍA A RESTDB, DE LO CONTRARIO, MUESTRA UN ERROR.
    makeSale() {
      if (!this.validation('sale')) return; // Si esto es falso, es porque no paso las validaciones

      if (this.sellPrice <= 0) {
        this.errorMessageSell = 'The sale price must be greater than 0.';
        return;
      }
      // Obtengo los datos de los movimientos del usuario
      CryptoService.savedPurchase(this.password)
        .then((response) => {
          this.resultado = response.data;
          console.log(this.resultado);
          this.operationSale();
        }).catch((error) => {
          console.error('Error al obtener las compras guardadas:', error);
          alert('Error retrieving saved purchases.');
        });
    },
    // Funcion para separar la logica de la venta, su es purchase suma, sino resta y registro la venta. REPASAR
    operationSale() {
      let quantityOfCoins = 0;
      this.resultado.forEach((element) => {
        if (this.selectedSellCrypto === element.crypto_code && element.action === 'purchase') {
          quantityOfCoins += element.crypto_amount; // Si es es compra, suma
        } else if (this.selectedSellCrypto === element.crypto_code && element.action === 'sale') {
          quantityOfCoins -= element.crypto_amount;
        }
      });

      if (quantityOfCoins === 0) {
        this.errorMessageSell = 'No cuenta con ese tipo de moneda para vender.';
        console.log('No cuenta con ese tipo de moneda para vender.');
        return;
      }

      if (this.quantitySell > quantityOfCoins) {
        this.errorMessageSell = 'No cuenta con esa cantidad de monedas para vender.';
        console.log('No cuenta con esa cantidad de monedas para vender.');
        return;
      }

      this.fetchPrice(); // Por si el precio llega a variar.

      const objectsDataSale = {
        user_id: this.password,
        action: 'sale',
        crypto_code: this.selectedSellCrypto,
        crypto_amount: this.quantitySell,
        money: this.sellPrice,
        datetime: this.getDateandTime(),
      };
      console.log('Cantidad de monedas disponibles: ', quantityOfCoins);
      console.log(objectsDataSale);

      CryptoService.PostSaveCryptoSale(objectsDataSale)
        .then(() => {
          alert('Sale completed successfully!');
          this.resetPurchaseForm();
        })
        .catch((error) => {
          console.error('Error during purchase:', error);
          alert('There was an error processing your sale.');
        });
    },
    // FUNCION PARA OBTENER LA HORA EN EL FORMATO SOLICITADO
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

    // PARA MOSTRAR EL MENSAJE DE LA COMPRA
    priceMessage() {
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

.error-messages {
  white-space: pre-line; /* Mantiene los saltos de línea */
  color: red; /* Opcional, para resaltar los mensajes de error */
}
</style>
