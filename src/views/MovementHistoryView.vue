<template>
  <div class="container">
    <NavigationBar></NavigationBar>
    <div v-if="transactions.length === 0"> Obtaining historical movements ...</div>
    <div v-else><CryptoDataTable :columnasProp="columnas" :filasProps="filas" :actionsButton="actions"> </CryptoDataTable></div>

      <!-- Muestra el mensaje de error si existe -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

  </div>
</template>

<script>

import CryptoDataTable from '@/components/CryptoDataTable.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import CryptoService from '@/services/CryptoService';
import { mapGetters } from 'vuex';

export default {
  name: 'MovementHistoryView',
  components: {
    NavigationBar,
    CryptoDataTable,
  },
  created() {
    this.getUserTransactions();
  },
  data() {
    return {
      columnasMap: {
        action: 'TRANSACTION',
        crypto_code: 'CURRENCY',
        crypto_amount: 'AMOUNT',
        money: 'MONEY (ARS)',
        datetime: 'TRANSACTION TIME',
      },
      columnas: [],
      filas: [],
      transactions: [],
      errorMessage: '',
      visibleColumn: ['action', 'crypto_code', 'crypto_amount', 'money', 'datetime'],
      actions: true,
    };
  },
  methods: {
    getUserTransactions() {
      try {
        CryptoService.savedPurchase(this.password)
          .then((response) => {
            this.transactions = response.data;
            console.log(this.transactions);
            this.errorMessage = '';
            this.getRowsAndColumns();
          });
      } catch (error) {
        this.errorMessage = `No se pudieron obtener las transacciones: ${error.message}`;
        console.log(this.errorMessage);// MEJORAR ESTO POR SI HUBO ERROR MOSTRARSELO AL USUARIO EN EL TEMPLATE
      }
    },
    getRowsAndColumns() {
      if (this.transactions.length === 0) {
        return;
      }

      // Extrae las claves de la primera transacción para las columnas
      this.columnas = this.visibleColumn.map((key) => this.columnasMap[key] || key);

      // Mapea las transacciones a filas, eliminando el ID si es necesario
      this.filas = this.transactions.map((transaction) => this.visibleColumn.map((key) => (key === 'datetime'
        ? this.formatDatetime(transaction[key]) : transaction[key])));
    },
    formatDatetime(datetime) {
      const date = new Date(datetime);
      const optionsDate = {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      const optionsTime = {
        timeZone: 'UTC',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Formato de 24 horas
      };

      // Obtén las partes de fecha y hora por separado
      const formattedDate = date.toLocaleDateString('es-AR', optionsDate);
      const formattedTime = date.toLocaleTimeString('es-AR', optionsTime);

      // Devuelve en el formato correcto: hora primero, luego fecha
      return `${formattedTime}, ${formattedDate}`;
    }
    ,
  },
  computed: {
    ...mapGetters(['password']),
  },
};
</script>

<style scoped>

</style>
