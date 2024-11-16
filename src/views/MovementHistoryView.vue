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
    <div v-else-if=" !isLoading && !hasData" class="message-data">
      <p>THE DATA SAVED IN THE API COULD NOT BE ACCESSED</p>
    </div>
    <div v-else-if="!isLoading" class="message-data">
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
 * Procesa los resultados de las transacciones del usuario. Asigna las filas y columnas para mostrar en una tabla.
 *
 * Esta función asigna los nombres de las columnas y mapea las transacciones a filas, formateando la hora para su
 * presentación. Si no hay transacciones en `userTransactionResults`, la función no realiza ninguna acción.
 *
 * @returns {void} No retorna ningún valor.
 */
    getRowsAndColumns() {
      if (this.userTransactionResults.length === 0) {
        return;
      }

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
        transaction._id,
        transaction.action,
        transaction.crypto_code,
        transaction.crypto_amount,
        transaction.money,
        this.formatDatetime(transaction.datetime),
      ]);
    },

    /**
 * Formatea una cadena de fecha y hora en un formato específico para visualización en español (Argentina).
 *
 * Esta función toma una fecha y hora y la formatea para ser visualizada en formato local argentino (es-AR).
 *
 * Luego, utiliza `toLocaleDateString` para obtener la fecha en formato `DD/MM/YYYY` y `toLocaleTimeString` en
 * formato de 24 horas (sin AM/PM) para la hora. El formato final presentado es `HH:mm, DD/MM/YYYY`.
 *
 * @param {string|Date} datetime - La fecha y hora a formatear, puede ser una cadena en formato ISO 8601 o un objeto Date.
 * @returns {string} La fecha y hora formateadas en el formato `HH:mm, DD/MM/YYYY`.
 * Devuelve 'Fecha inválida' si el parámetro es nulo o no está definido.
 */
    formatDatetime(datetime) {
      if (!datetime) {
        console.error('El datetime no está definido o es nulo:', datetime);
        return 'Fecha inválida';
      }

      const date = new Date(datetime);

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

    /**
 * Elimina una fila del array `filas` en función del índice proporcionado.
 *
 * Si el índice de la fila es válido, la fila se elimina usando el método `splice`.
 * Si el índice es inválido (fuera del rango), se muestra un error en la consola.
 *
 * @param {number} rowIndex El índice de la fila a eliminar en el array `filas`.
 * @returns {void} Esta función no devuelve ningún valor.
 */
    removeRow(rowIndex) {
      console.log('Removing row at index:', rowIndex);
      if (rowIndex >= 0 && rowIndex < this.filas.length) {
        this.filas.splice(rowIndex, 1);
      } else {
        console.error('Invalid rowIndex:', rowIndex);
      }
    },

    /**
 * Actualiza una fila en el array `filas` basándose en el ID de la transacción.
 *
 * Busca la fila correspondiente al `idTransaction` y, si se encuentra, actualiza sus valores
 * con los datos proporcionados en `updateTransaction`. Si el ID de la transacción no se encuentra,
 * la fila no se actualiza.
 *
 * @param {number} idTransaction El ID de la transacción cuya fila se desea actualizar.
 * @param {Object} updateTransaction Un objeto con los nuevos valores para la transacción.
 * @returns {void} Esta función no devuelve ningún valor, solo actualiza el array `filas`.
 */
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
      password: 'password',
      userTransactionResults: 'userTransactionData/userTransactionResults',
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
