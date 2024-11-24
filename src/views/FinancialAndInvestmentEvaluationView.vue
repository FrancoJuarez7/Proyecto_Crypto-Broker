<template>
  <div>
    <NavigationBar></NavigationBar>
    <MessagesApp :isVisible="showModal" :message="messageApp" :showCloseButton="showButton"  @click="showModal = false"></MessagesApp>

     <!-- Mostrar datos si están disponibles -->
     <div v-if=" !isLoading && columns.length > 0 && rows.length > 0">
      <CryptoDataTable
        :columnsProp="columns"
        :rowsProps="rows"
        :actionsButton="actions">
      </CryptoDataTable>
    </div>

    <div v-else-if=" !isLoading && !hasData" class="message-data">
      <p>THE DATA SAVED IN THE API COULD NOT BE ACCESSED</p>
    </div>

    <div v-else-if="!isLoading && (this.userTransactionResults.length <= 0 || this.totalCoins === 0)" class="message-data">
      <p>NO TRANSACTION DATA TO DISPLAY</p>
    </div>

</div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import CryptoDataTable from '@/components/CryptoDataTable.vue';
import MessagesApp from '@/components/MessagesApp.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'FinancialAndInvestmentEvaluationView',
  components: {
    NavigationBar,
    CryptoDataTable,
    MessagesApp,
  },
  async created() {
    try {
      await this.getRowsAndColumns();
    } catch (error) {
      console.error('Error loading rows and columns:', error);
      this.setModalMessage('An error occurred while loading data. Please try again later.', true);
    } finally {
      this.isLoading = false;
    }
  },
  data() {
    return {
      showModal: false,
      showButton: false,
      isLoading: true,
      hasData: false,
      messageApp: '',
      columns: [],
      rows: [],
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
 * @returns {Promise<void>} No retorna ningún valor.
 */
    async getRowsAndColumns() {
      try {
        this.columns = [
          'CURRENCY',
          'QUANTITY',
          'VALUE',
          'BALANCE',
        ];

        await this.getTransactions();
      } catch (error) {
        console.error('Error loading rows and columns:', error);
        this.setModalMessage('An error occurred while loading data. Please try again later.', true);
      }
    },

    /**
 * Obtiene las transacciones y actualiza el estado del modal. Establece el mensaje del modal según el estado de
 * carga de las transacciones y los resultados.
 *
 * @returns {Promise<void>} No retorna ningún valor.
 */
    async getTransactions() {
      try {
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
      } catch (error) {
        console.error('Error loading transactions:', error);
        this.setModalMessage('An error occurred while loading transaction data. Please try again later.', true);
      }
    },

    /**
 * Calcula el resultado de la inversión por tipo de criptomoneda y actualiza el estado de las filas.
 *
 * @returns {Promise<void>} No retorna ningún valor.
 */
    async getResult() {
      try {
        let investmentResult = 0;
        let money = 0;
        this.arrayTypes = [...new Set(this.userTransactionResults.map((typeMoney) => typeMoney.crypto_code))];

        for (const typeCrypto of this.arrayTypes) {
          const cryptoTransfers = this.userTransactionResults.filter((type) => type.crypto_code === typeCrypto);

          cryptoTransfers.forEach((transaction) => {
            if (transaction.action === 'purchase') {
              this.totalCoins += parseFloat(transaction.crypto_amount);
              this.totalMoneyInvested += parseFloat(transaction.money);
            } else if (transaction.action === 'sale') {
              this.totalCoins -= parseFloat(transaction.crypto_amount);
              this.totalMoneyInvested -= parseFloat(transaction.money); // Dinero que recibi de la venta
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
            this.rows.push(investmentObject);
          }
          this.totalCoins = 0;
          this.totalMoneyInvested = 0;
        }
      } catch (error) {
        console.error('Error calculating investment results:', error);
        this.setModalMessage('An error occurred while calculating investment results. Please try again later.', true);
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

.message-data{
  margin: 0 auto;
  margin-top: 50px;
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
  white-space: pre-line;
  font-weight: bold;
  font-size: 30px;
}
</style>
