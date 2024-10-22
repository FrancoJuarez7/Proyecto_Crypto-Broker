<template>
  <div class="container">

    <NavigationBar></NavigationBar>

    <div v-if= "isLoading"> Obtaining historical movements ...</div>
    <div v-else-if="userTransactionResults && userTransactionResults.length > 0">
      <CryptoDataTable
        :columnasProp="columnas"
        :filasProps="filas"
        :actionsButton="actions"
        @deletedRow="removeRow"
        @editRow="updateRow">
      </CryptoDataTable>
    </div>
    <div v-else-if="!hasData">
      <p>THE DATA SAVED IN THE API COULD NOT BE ACCESSED</p>
    </div>
    <div v-else>
      <p>NO TRANSACTION DATA TO DISPLAY</p>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import CryptoDataTable from '@/components/CryptoDataTable.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MovementHistoryView',
  components: {
    NavigationBar,
    CryptoDataTable,
  },
  async created() {
    const hasData = await this.getUserTransactionData(); // TRAE EL EL ARRAY DE OBJETOS CON LAS TRANSACCIONES DEL USUARIO

    if (!hasData) {
      this.hasData = false;
      this.isLoading = false;
      return;
    }
    this.hasData = true;
    this.getRowsAndColumns();
    this.isLoading = false;
  },
  data() {
    return {
      columnas: [],
      filas: [],
      errorMessage: '',
      actions: true,
      isLoading: true,
      hasData: false,
    };
  },
  methods: {
    ...mapActions('userTransactionData', ['getUserTransactionData']),

    getRowsAndColumns() {
      if (this.userTransactionResults.length === 0) {
        return;
      }

      // Asignar las columnas como un array de nombres
      this.columnas = [
        'USUARIO',
        'TRANSACTION',
        'CURRENCY',
        'AMOUNT',
        'MONEY (ARS)',
        'TRANSACTION TIME',
      ];

      // Mapea las transacciones a filas usando this.columnas
      this.filas = this.userTransactionResults.map((transaction) => [
        transaction._id, // Asegúrate de que estos nombres coincidan con tus datos
        transaction.action,
        transaction.crypto_code,
        transaction.crypto_amount,
        transaction.money,
        this.formatDatetime(transaction.datetime),
      ]);
    },

    formatDatetime(datetime) {
      // Verifica si el datetime está definido o es un valor válido
      if (!datetime) {
        console.error('El datetime no está definido o es nulo:', datetime);
        return 'Fecha inválida';
      }

      // Asegúrate de que el objeto Date interprete la fecha como UTC
      const date = new Date(datetime);

      // Establece las opciones de formateo para la fecha y la hora según la zona horaria local
      const optionsDate = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Formato de 24 horas
      };

      // Usa toLocaleDateString y toLocaleTimeString sin la opción timeZone para la hora local
      const formattedDate = date.toLocaleDateString('es-AR', optionsDate);
      const formattedTime = date.toLocaleTimeString('es-AR', optionsTime);

      // Devuelve en el formato correcto: hora primero, luego fecha
      return `${formattedTime}, ${formattedDate}`;
    },
    removeRow(rowIndex) {
      console.log('Removing row at index:', rowIndex);
      if (rowIndex >= 0 && rowIndex < this.filas.length) {
        this.filas.splice(rowIndex, 1);
      } else {
        console.error('Invalid rowIndex:', rowIndex);
      }
    },
    updateRow(idTransaction, updateTransaction) {
      const rowIndex = this.filas.findIndex((row) => row[0] === idTransaction);
      if (rowIndex !== -1) {
        this.filas[rowIndex][1] = updateTransaction.action;
        this.filas[rowIndex][2] = updateTransaction.crypto_code;
        this.filas[rowIndex][3] = updateTransaction.crypto_amount;
        this.filas[rowIndex][4] = updateTransaction.money;
        this.filas[rowIndex][5] = this.formatDatetime(updateTransaction.datetime);
      }
    },
  },
  computed: {
    ...mapGetters(['password']),
    ...mapGetters('userTransactionData', ['userTransactionResults']),
  },
};
</script>

<style scoped>
</style>
