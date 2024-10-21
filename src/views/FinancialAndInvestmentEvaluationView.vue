<template>
  <NavigationBar></NavigationBar>
  <div v-if="transactions.length === 0"> Retrieve financial evaluation and investment analysis data ...</div>
  <div v-else>
    <CryptoDataTable
        :columnasProp="columnas"
        :filasProps="filas"
        :actionsButton="actions">
      </CryptoDataTable>
    <div v-if="errorMessage">{{ errorMessage }}</div>
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
  created() {
    this.getTransactions();
  },
  data() {
    return {
      transactions: [],
      errorMessage: '',
      columnas: [],
      filas: [],
      buyPrice: null,
      errorMessageBuy: '',
      arrayTipos: [],
      suma: 0,
      nombresUnicos: [],
      actions: false,
      totalCoins: 0,
      value: 0,
      moneyInvested: 0,
      moneyRecibi: 0,
    };
  },
  methods: {

    // Método para establecer las columnas
    getRowsAndColumns() {
      this.columnas = [
        'CURRENCY',
        'QUANTITY',
        'VALUE',
        'BALANCE',
      ];
    },

    // PASO 1: OBTENER LAS TRANSACCIONES DEL USUARIO.
    // PASO 2: RECORRER LAS TRANSACCIONES, SUMANDO Y RESTANTO LAS COMPRAS Y VENTAS DEPENDIENDO SI ES PURCHASE O SALE
    // PASO 3: OBTENER EL PRECIO ACTUAL DE LA MONEDA CON LA QUE ESTOY TRABAJANDO.
    // PASO 4: MULTIPLICAR LA CANTIDAD DE MONEDAS QUE TENGO CON EL PRECIO ACTUAL PARA SABER CUANTO DINERO TENGO DE ESA MONEDA.
    // PASO 5: SUMAR EL TOTAL DE TODAS LAS MONEDAS QUE TENGO PARA MOSTRAR EL TOTAL DE DINERO QUE TENGO.
    // PASO 6: ANALIZAR COMO HACER LA PANTALLA DE INVERSIONES

    // Método para obtener transacciones
    async getTransactions() {
      await this.getUserTransactionData();

      if (this.userTransactionResults) { /* VER QUE ESTO EN LOS OTROS 2 LO BORRE PORQUE ES COMO INNECESARIO, LO DEBERIA MANAJER SINO OBTEGO
        LOS EN EL this.userTransactionResults. CONTROLAR LA APP ENTERA PARA VER SI FUNCIONA */
        console.log('TRANSACCIONES: ', this.userTransactionResults);
      } else {
        console.log('NO HAY TRANSACCIONES');
      }
    },

    // Método para obtener resultados
    getResult() {
    // --------------------------------------------- SEGUNDA COLUMNA: MOSTRAR CANTIDAD DE MONEDAS, SI ES "0" NO SE MUESTRA ESE TIPO DE MONEDA
      this.uniqueNames();

      this.nombresUnicos.forEach((typeMoney) => {
        this.totalNumberOfCoins(typeMoney);

        // this.profitAndLoss(typeMoney);

        if (this.totalCoins > 0) {
          this.coinValue(typeMoney, this.totalCoins);
        }
      });
    },
    /*
    uniqueNames() {
      this.arrayTipos = []; // Asegúrate de reiniciar el arrayTipos
      this.transactions.forEach((transaction) => {
        this.arrayTipos.push(transaction.crypto_code);
      });
      this.nombresUnicos = [...new Set(this.arrayTipos)];
      console.log(`Nombres unicos: ${this.nombresUnicos}`);
    },

    totalNumberOfCoins(typeMoney) {
      this.totalCoins = 0;
      this.moneyInvested = 0;

      this.nombresUnicos.filter(

        // RECORRER EL DE NOMBRES UNICOS Y LUEGO EL DE TRANSACTIONS PORQUE SINO NO ESTOY IMPLEMENTANDO LO DE NOMBRES UNICOS

        (nomUnico) => {
          if (typeMoney === transaction.crypto_code && transaction.action === 'purchase') {
            this.totalCoins += parseFloat(transaction.crypto_amount);
            this.moneyInvested += parseFloat(transaction.money); // DINERO QUE GASTE EN LA COMPRA
          } else if (typeMoney === transaction.crypto_code && transaction.action === 'sale') {
            this.totalCoins -= parseFloat(transaction.crypto_amount);
            this.moneyInvested -= parseFloat(transaction.money); // DINERO QUE RECIBI EN LA VENTA
          }
        },
      );

      console.log('TOTAL MONEDAS: ', this.totalCoins);
      this.profitAndLoss(typeMoney, this.moneyInvested, this.totalCoins);
    },

    // ESTE METODO LO ESTOY DESARROLLANDO PARA LA ULTIMA COLUMNA DEL ANALISIS DE INVERSIONES
    async profitAndLoss(typeMoney, moneyInvested, totalCoins) {
      let resultado = 0;

      if (totalCoins >= 0) {
        await this.coinValue(typeMoney, totalCoins);

        resultado = (this.value - moneyInvested).toFixed(2);

        console.log(`RESULTADO INVERSION  ${typeMoney}: `, resultado);
      }
    },

    async coinValue(typeMoney, totalCoins) {
      try {
        await this.getPrice(typeMoney, totalCoins); // Esperamos a que se resuelva la llamada a la API

        this.value = (parseFloat(totalCoins) * parseFloat(this.buyPrice)).toFixed(2);
        console.log(`Precio: ${typeMoney} | ${totalCoins} |`, this.value);
      } catch (error) {
        console.error('Error en la llamada a la API:', error);
        this.errorMessageBuy = 'Hubo un error al consultar los precios de compra en la API de www.criptoya.com.';
      }
      return this.value;
      // this.profitAndLoss(this.value);
    },
*/
    ...mapActions('userTransactionData', ['getUserTransactionData']),
  },

  computed: {
    ...mapGetters(['password']),
    ...mapGetters('userTransactionData', ['userTransactionResults']),
  },
};

// const r = await this.coinValue(typeMoney, totalCoins);
/* console.log('NOMBRE: ', typeMoney);
        console.log('VALOR: ', r);
        console.log('MONEDAS: ', totalCoins);
        console.log('valor 2: ', moneyInvested); */
</script>

<style scoped>
  /* Aquí va tu CSS */
</style>
