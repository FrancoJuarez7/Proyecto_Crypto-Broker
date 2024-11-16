<template>
  <div>
    <NavigationBar></NavigationBar>
    <MessagesApp :isVisible="showModal" :message="messageApp" :showCloseButton="showButton"  @click="showModal = false"></MessagesApp>

     <!-- Mostrar datos si están disponibles -->
     <div v-if=" !isLoading && columnas.length > 0 && filas.length > 0">
      <CryptoDataTable
        :columnasProp="columnas"
        :filasProps="filas"
        :actionsButton="actions">
      </CryptoDataTable>
    </div>

    <div v-else-if=" !isLoading && !hasData" class="messageData">
      <p>THE DATA SAVED IN THE API COULD NOT BE ACCESSED</p>
    </div>

    <div v-else-if="!isLoading && (this.userTransactionResults.length <= 0 || this.totalCoins === 0)" class="messageData">
      <p>NO TRANSACTION DATA TO DISPLAY</p>
    </div>

</div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import CryptoDataTable from '@/components/CryptoDataTable.vue';
import MessagesApp from '@/components/MessagesApp.vue';
import { mapGetters, mapActions } from 'vuex';
// import CryptoService from '@/services/CryptoService';

export default {
  name: 'FinancialAndInvestmentEvaluationView',
  components: {
    NavigationBar,
    CryptoDataTable,
    MessagesApp,
  },
  async created() {
    await this.getRowsAndColumns();
  },
  data() {
    return {
      showModal: false,
      showButton: false,
      isLoading: true,
      hasData: false,
      messageApp: '',
      columnas: [],
      filas: [],
      arrayTypes: [],
      actions: false,
      totalCoins: 0,
      totalMoneyInvested: 0,
    };
  },
  methods: {
    /**
 * Establece el mensaje y la visibilidad del modal.
 *
 * @param {string} message El mensaje que se mostrará en el modal.
 * @param {boolean} showButton Determina si se debe mostrar un botón en el modal.
 * @returns {void} No retorna ningún valor.
 */
    setModalMessage(message, showButton) {
      this.showModal = true;
      this.showButton = showButton;
      this.messageApp = message;
    },

    /**
 * Establece las columnas para la tabla y obtiene las transacciones.
 *
 * @returns {Promise<void>} No devuelve nada.
 */
    async getRowsAndColumns() {
      this.columnas = [
        'CURRENCY',
        'QUANTITY',
        'VALUE',
        'BALANCE',
      ];

      await this.getTransactions();
    },

    /**
 * Obtiene las transacciones y actualiza el estado del modal.
 *
 * Establece el mensaje del modal según el estado de carga de las transacciones y los resultados.
 *
 * @returns {Promise<void>} No devuelve nada.
 */
    async getTransactions() {
      this.setModalMessage('Loading financial data...', false);

      this.hasData = await this.getUserTransactionData();
      this.isLoading = false;
      if (!this.hasData) {
        this.setModalMessage('Failed to load transactions. Please try again later.', true);
      } else if (this.userTransactionResults.length > 0) {
        this.showModal = false;
      } else {
        this.setModalMessage('There is no investment analysis to display.', true);
      }

      await this.getResult();
    },

    /**
 * Calcula el resultado de la inversión por tipo de criptomoneda y actualiza el estado de las filas.
 *
 * Recorre las transacciones, calcula el total de monedas compradas y vendidas, obtiene el valor actual
 * de las criptomonedas, y calcula el resultado de la inversión para cada tipo de criptomoneda.
 *
 * @returns {Promise<void>} No devuelve ningún valor.
 */
    async getResult() {
      let investmentResult = 0;
      let money = 0;

      // Primero extraemos esa propiedad de array y luego le aplicamos el new Set. Me creara un nuevo array con nombres unicos
      this.arrayTypes = [...new Set(this.userTransactionResults.map((typeMoney) => typeMoney.crypto_code))];

      // Para cada nombre unico, recorre todas las transacciones. Obteniendo todas las transacciones de un tipo, luego del otro y asi.
      for (const typeCrypto of this.arrayTypes) {
        const cryptoTransfers = this.userTransactionResults.filter((type) => type.crypto_code === typeCrypto);

        // Calculo totales por cada transacción. Porque en cryptoTransfers estan guardados por separado cada tipo de transaccion
        cryptoTransfers.forEach((transaction) => {
          if (transaction.action === 'purchase') {
            this.totalCoins += parseFloat(transaction.crypto_amount);
            this.totalMoneyInvested += parseFloat(transaction.money);
          } else if (transaction.action === 'sale') {
            this.totalCoins -= parseFloat(transaction.crypto_amount);
            this.totalMoneyInvested -= parseFloat(transaction.money); // DINERO QUE RECIBI EN LA VENTA
          }
        });

        if (this.totalCoins > 0) {
          await this.fetchCryptoPrice({
            exchange: '',
            crypto: typeCrypto,
            quantity: 1,
            type: 'sale',
          });

          money = (this.sellPrice * this.totalCoins).toFixed(2);
          investmentResult = (money - this.totalMoneyInvested).toFixed(2);

          console.log(`MONDEDA:  ${typeCrypto} | CANTIDAD DE MONEDAS: ${this.totalCoins} | 'TOTAL DINERO ACTUAL: ' ${money} 
          | RESULTADO INVERSION: ${investmentResult}`);

          const investmentObject = {
            type_money: typeCrypto,
            total_coins: this.totalCoins,
            total_money: money,
            investment_result: investmentResult,
          };
          this.filas.push(investmentObject);
        }
        this.totalCoins = 0;
        this.totalMoneyInvested = 0;
      }
    },

    ...mapActions({
      getUserTransactionData: 'userTransactionData/getUserTransactionData',
      fetchCryptoPrice: 'getPricesApi/fetchCryptoPrice',
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
    }),
  },
};

</script>

<style scoped>

.messageData{
  margin: 0 auto;
  margin-top: 50px;
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
  white-space: pre-line;
  font-weight: bold;
  font-size: 30px;
}
</style>
