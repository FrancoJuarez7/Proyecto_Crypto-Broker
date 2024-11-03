<template>
  <div class="container">

    <NavigationBar></NavigationBar>

    <div v-if=" !isLoading && userTransactionResults?.length > 0">
      <CryptoDataTable
        :columnasProp="columnas"
        :filasProps="filas"
        :actionsButton="actions"
        @deletedRow="removeRow"
        @editRow="updateRow">
      </CryptoDataTable>
    </div>
    <div v-else-if=" !isLoading && !hasData">
      <p>THE DATA SAVED IN THE API COULD NOT BE ACCESSED</p>
    </div>
    <div v-else-if="!isLoading">
      <p>NO TRANSACTION DATA TO DISPLAY</p>
    </div>

    <MessagesApp :isVisible="showModal" :message="messageApp" :showCloseButton="showButton" @close="showModal = false"></MessagesApp>

  </div>
</template>

<script>
import CryptoDataTable from '@/components/CryptoDataTable.vue';
import NavigationBar from '@/components/NavigationBar.vue';
import MessagesApp from '@/components/MessagesApp.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MovementHistoryView',
  components: {
    NavigationBar,
    CryptoDataTable,
    MessagesApp,
  },
  async created() {
    this.setModalMessage('Loading your transaction data, please wait...', false);

    this.hasData = await this.getUserTransactionData();
    this.isLoading = false; // Sea true o false deja de cargar

    // Verifica si hay datos y actualiza el estado según el resultado
    if (!this.hasData) {
      this.setModalMessage('Failed to obtain transaction data. Please refresh the page or try again later.', true);
    } else if (this.userTransactionResults.length > 0) {
      this.showModal = false;
      this.getRowsAndColumns();
    } else {
      this.setModalMessage('There are currently no transactions to display.', true);
    }
  },
  data() {
    return {
      showModal: false,
      showButton: false,
      isLoading: true, // Esta cargando ?
      hasData: false, // Tiene datos ?
      actions: true,
      messageApp: '',
      columnas: [],
      filas: [],
    };
  },
  methods: {
    ...mapActions('userTransactionData', ['getUserTransactionData']),

    setModalMessage(message, showButton) {
      this.showModal = true;
      this.showButton = showButton;
      this.messageApp = message;
    },
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
    ...mapGetters({
      password: 'password', // Getter del módulo raíz
      userTransactionResults: 'userTransactionData/userTransactionResults', // Getter del módulo userTransactionData
    }),
  },
};
</script>

<style scoped>
</style>
