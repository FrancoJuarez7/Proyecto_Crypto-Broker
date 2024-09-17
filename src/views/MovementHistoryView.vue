<template>
  <div class="container">
    <NavigationBar></NavigationBar>
    <div v-if="transactions.length === 0"> Obtaining historical movements ...</div>
    <div v-else><CryptoDataTable :columnasProp="columnas" :filasProps="filas" :actionsButton="actions" @deletedRow="removeRow"
    @editRow="updateRow"> </CryptoDataTable></div>

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
        _id: 'USUARIO',
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
      visibleColumn: ['_id', 'action', 'crypto_code', 'crypto_amount', 'money', 'datetime'], // Claves a mostaar en orden
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

      // Cada clave de visibleColumn, se mapea con la clave de cada columnasMap para que sea mas legible y se guarda en columnas.
      this.columnas = this.visibleColumn.map((key) => this.columnasMap[key] || key);

      // Mapea las transacciones a filas
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
    },
    // Cada indice es una fila, debe ser >= 0 y < la cantidad total de filas para garantizar que se elimina una fila válida.
    removeRow(rowIndex) {
      console.log('Removing row at index:', rowIndex);
      if (rowIndex >= 0 && rowIndex < this.filas.length) {
        this.filas.splice(rowIndex, 1);
        /* Esto elimina un valor de la variable filas esto al estar declarado en el data() de VUE, y debido a la reactivida, las filas se
       actualizará automáticamente en la vista del componente CryptoDataTable. Como this.filas está vinculado al componente a través de las
       props (:filasProps="filas"), cualquier cambio en this.filas se reflejará automáticamente en la vista. Esto también aplica cuando los
       datos se pasan al componente usando getRowsAndColumns() que tambien utiliza la variable filas. La reactividad en Vue asegura que las
       actualizaciones en this.filas se muestren en el componente sin necesidad de actualizaciones manuales. */
      } else {
        console.error('Invalid rowIndex:', rowIndex);
      }
    },
    updateRow(idTransaction, updateTransaction) {
      /* Recorre las filas y busca la primer coincidencia de la fila [CERO] que sea igual al idTransaction. Cuando lo encuentra deja de
      recorrer. */
      const rowIndex = this.filas.findIndex((row) => row[0] === idTransaction);

      // -1 es el resultado que devuelve el metodo si no encuentra nada. Pero si encuentra edito [FILA] [COLUMNA]
      if (rowIndex !== -1) {
        this.filas[rowIndex][3] = updateTransaction.crypto_amount;
        this.filas[rowIndex][4] = updateTransaction.money;
      }
    },
  },
  computed: {
    ...mapGetters(['password']),
  },
};
</script>

<style scoped>

</style>
