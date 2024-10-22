<template>
  <NavigationBar></NavigationBar>
  <div v-if= "isLoading"> Obtaining financial movements ...</div>
  <div v-else-if="columnas.length > 0 && filas.length > 0 ">
    <CryptoDataTable
        :columnasProp="columnas"
        :filasProps="filas"
        :actionsButton="actions">
      </CryptoDataTable>
  </div>
  <div v-else>
      <p>NO FINANCIAL DATA TO SHOW</p>
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar.vue';
import CryptoDataTable from '@/components/CryptoDataTable.vue';
import { mapGetters, mapActions } from 'vuex';
// import CryptoService from '@/services/CryptoService';

export default {
  name: 'FinancialAndInvestmentEvaluationView',
  components: {
    NavigationBar,
    CryptoDataTable,
  },
  async created() {
    try {
      await this.getRowsAndColumns();
    } catch (error) {
      console.log('Failed to load transactions. Please try again later.');
    } finally {
      this.isLoading = false;
    }
  },
  data() {
    return {
      isLoading: true,
      errorMessage: '',
      columnas: [],
      filas: [],
      errorMessageBuy: '',
      arrayTypes: [],
      actions: false,
      totalCoins: 0,
      totalMoneyInvested: 0,
    };
  },
  methods: {

    // Método para establecer las columnas
    async getRowsAndColumns() {
      this.columnas = [
        'CURRENCY',
        'QUANTITY',
        'VALUE',
        'BALANCE',
      ];

      await this.getTransactions();
    },

    // PASO 1: OBTENER LAS TRANSACCIONES DEL USUARIO. ---> xxx HECHO xxx
    // PASO 2: RECORRER LAS TRANSACCIONES, SUMANDO Y RESTANTO LAS COMPRAS Y VENTAS DEPENDIENDO SI ES PURCHASE O SALE. NOMBRES UNICOS, SI LA
    // CANTIDAD DE MONEDAS ES 0, ESA CRYPTO NO DEBE MOSTRARSE.
    // PASO 3: OBTENER EL PRECIO ACTUAL DE LA MONEDA CON LA QUE ESTOY TRABAJANDO.
    // PASO 4: MULTIPLICAR LA CANTIDAD DE MONEDAS QUE TENGO CON EL PRECIO ACTUAL PARA SABER CUANTO DINERO TENGO DE ESA MONEDA.
    // PASO 5: SUMAR EL TOTAL DE TODAS LAS MONEDAS QUE TENGO PARA MOSTRAR EL TOTAL DE DINERO QUE TENGO.
    // PASO 6: ANALIZAR COMO HACER LA PANTALLA DE INVERSIONES

    // Método para obtener transacciones
    async getTransactions() {
      debugger;
      const response = await this.getUserTransactionData();
      if (!response) {
        return;
      }

      if (this.userTransactionResults.length > 0) { /* VER QUE ESTO EN LOS OTROS 2 LO BORRE PORQUE ES COMO INNECESARIO, LO DEBERIA MANAJER SINO OBTEGO
        LOS EN EL this.userTransactionResults. CONTROLAR LA APP ENTERA PARA VER SI FUNCIONA */
        console.log('TRANSACCIONES: ', this.userTransactionResults); // REVISAR SI ESTA BIEN LA VALIDACION
      } else {
        console.log('NO HAY TRANSACCIONES');
      }
      await this.getResult();
    },

    async getResult() {
      let investmentResult = 0;

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
            quantity: this.totalCoins,
            type: 'sale',
          });

          investmentResult = (this.sellPrice - this.totalMoneyInvested).toFixed(2);

          console.log(`MONDEDA:  ${typeCrypto} | CANTIDAD DE MONEDAS: ${this.totalCoins} | 'TOTAL DINERO ACTUAL: ' ${this.sellPrice} 
          | RESULTADO INVERSION: ${investmentResult}`);

          const investmentObject = {
            type_money: typeCrypto,
            total_coins: this.totalCoins,
            total_money: this.sellPrice,
            investment_result: investmentResult,
          };
          this.filas.push(investmentObject);
          console.log(this.filas);
        }
        this.totalCoins = 0;
        this.totalMoneyInvested = 0;
      }
    },
    ...mapActions('userTransactionData', ['getUserTransactionData']),
    ...mapActions('getPricesApi', ['fetchCryptoPrice']),
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
  /* Aquí va tu CSS */
</style>
