<template>
  <div class="table-container">
    <!-- Tabla y botones -->
    <table class="table-crypto">
      <thead>
        <tr>
          <th v-for="(column, index) in visibleColumns" :key="index">
            {{ column }}
          </th>
          <th v-if="actionsButton">
            ACTIONS
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex">
          <td v-for="(value, colIndex) in (Array.isArray(row) ? row : Object.values(row))" :key="colIndex"
          :class="{
        'positive-result': value === row.investment_result && value >= 0,
        'negative-result': value === row.investment_result && value < 0
      }">
            {{ value }}
          </td>
          <td v-if="actionsButton">

            <button class= "btn-table" @click="viewTransaction(rowIndex)" @keydown.enter="viewTransaction(rowIndex)"
            @keydown.space="viewTransaction(rowIndex)" tabindex="0"> VIEW </button>

            <button class= "btn-table" @click="loadEditForm(rowIndex)" @keydown.enter="loadEditForm(rowIndex)"
            @keydown.space="loadEditForm(rowIndex)" tabindex="0">EDIT</button>

            <button  class= "btn-table" @click="deleteTransaction(rowIndex)" @keydown.enter="deleteTransaction(rowIndex)"
              @keydown.space="deleteTransaction(rowIndex)" tabindex="0"> DELETE</button>

          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="modal" tabindex="0" @keydown.esc="closeModal">
      <div class="modal-content" tabindex="0">
        <span class="close" @click="closeModal" @keydown.enter="closeModal" @keydown.space="closeModal" tabindex="0">&times;</span>
        <div v-if="modalView">
          <h3>TRANSACTION DETAILS</h3>
          <ul>
            <li v-for="(value, index) in selectedRow" :key="index">
            {{ visibleColumns[index] ? visibleColumns[index] : 'Column no visible' }}: {{ value }}
            </li>
          </ul>
        </div>
        <div v-if="modalEdit">
          <h3>TRANSACTION EDIT</h3>

            <select class="selection-edit" id="sellExchangeCrypto" v-model="selectedExchangeCrypto">
              <option value="" disabled>CHOOSE THE EXCHANGE</option>
              <option v-for="(nameExchange, index) in getExchanges" :key="index" :value="nameExchange">
                  {{ nameExchange }}
              </option>
            </select><br> <br>

           <select class="selection-edit" id="saleCrypto" v-model="selectedCrypto">
              <option v-for="(nameCoins, index) in getTypesOfCoins" :key="index" :value="nameCoins">
                {{ nameCoins }}
              </option>
           </select><br> <br>

           <select class="selection-edit"  id="transactionType" v-model="selectTransaction">
              <option value="purchase"> PURCHASE </option>
              <option value="sale"> SALE </option>
           </select><br> <br>

          <label><input class="selection-edit"  type="number" placeholder="AMOUNT" v-model="Amount" min="0.000001" max="100"></label> <br> <br>
          <label><input class="selection-edit"  type="number" placeholder="PRICE" v-model="Price" readonly></label> <br> <br>

          <button class= "btn-table" @click="updateTransaction">EDIT</button> <button class= "btn-table" @click="closeModal" >CANCEL</button>

        </div>
      </div>
    </div>
    <MessagesApp :isVisible="showModalMessage" :message="messagesApp" :showCloseButton="showButton" @close="showModalMessage = false"> </MessagesApp>
  </div>
</template>

<script>

import CryptoService from '@/services/CryptoService';
import { mapGetters, mapActions } from 'vuex';
import MessagesApp from './MessagesApp.vue';

export default {
  components: {
    MessagesApp,
  },
  props: {
    columnsProp: {
      type: Array,
      required: true,
    },
    rowsProps: {
      type: Array,
      required: true,
    },
    actionsButton: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showButton: false,
      messagesApp: '',
      selectedCrypto: '',
      selectTransaction: '',
      selectedExchangeCrypto: '',
      Amount: 0,
      Price: 0,
      selectedRow: null,
      showModalMessage: false,
      showModal: false, // Controla la visibilidad del modal
      modalView: false,
      modalEdit: false,
      idTransaction: null,
      resultado: 0,
      exchangeSelected: '',
    };
  },
  methods: {

    /**
 * Muestra los detalles de una transacción específica en un modal.
 *
 * @param {number} rowIndex - El índice de la fila seleccionada desde el template.
 * @returns {void} No retorna ningún valor, solo actualiza el estado de `selectedRow` y del modal.
 */
    viewTransaction(rowIndex) {
      /* filteredRows devuelve un array con las filas de las transacciones menos la de la columa USER. */
      if (this.selectedRow !== this.filteredRows[rowIndex]) { // this.filteredRows[0])
        this.selectedRow = this.filteredRows[rowIndex];
        this.showModal = true;
        this.modalView = true;
        this.modalEdit = false;
      }
    },

    /**
 * Elimina una transacción específica y actualiza la tabla principal.
 *
 * @param {number} rowIndex - Índice de la fila a eliminar.
 * @returns {void} No retorna ningún valor, solo gestiona el estado de la interfaz y emite eventos.
 */
    deleteTransaction(rowIndex) {
      const transactionId = this.rowsProps[rowIndex][0];
      console.log('Transaction ID:', transactionId);
      console.log('Deleting transaction at index:', rowIndex);

      this.setModalMessage('Deleting transaction...', false);

      CryptoService.deleteTransaction(this.rowsProps[rowIndex][0]) // Primero: elimino la fila.
        .then(() => {
          this.$emit('deletedRow', rowIndex);
          /* Segundo: Emito un evento para actualizar la tabla, ya que las filas se almacenan en `rowsProps`, que es una
          prop. No puedo modificarla directamente desde un componente hijo. Debo pasar el índice de la fila que quiero
          eliminar. Consultar este método en el componente padre. */

          this.setModalMessage('Transaction deleted successfully.', true);
        })
        .catch((error) => {
          console.error(error);
          this.setModalMessage('Error deleting transaction', true);
        });
    },

    /**
 * Configura el mensaje del modal y controla la visibilidad del botón.
 *
 * @param {string} message - El mensaje a mostrar en el modal.
 * @param {boolean} showButton - Indica si el botón debe mostrarse en el modal.
 * @returns {void} No retorna ningún valor, solo actualiza el estado del modal.
 */

    setModalMessage(message, showButton) {
      this.showModalMessage = true;
      this.showButton = showButton;
      this.messagesApp = message;
    },

    /**
 * Cierra el modal de la interfaz de usuario.
 *
 * @returns {void} No retorna ningún valor.
 */
    closeModal() {
      this.showModal = false;
    },

    /**
 * Abre el formulario de edición y carga los datos de la transacción seleccionada.
 *
 * @param {number} rowIndex - Índice de la fila seleccionada en la tabla de transacciones.
 * @returns {void} No retorna ningún valor. Solo maneja la visualización y carga de datos para el formulario.
 */
    async loadEditForm(rowIndex) {
      try {
        // Muestra el modal y configura la vista para editar
        this.showModal = true;
        this.modalView = false;

        // Desestructura el array y guarda el primer valor como ID de transacción
        const [idTransaction] = this.rowsProps[rowIndex];
        this.idTransaction = idTransaction; // Asigna el valor a idTransaction en data()

        // Configura el modal para la edición y reinicia los valores
        this.modalEdit = true;
        this.resetModalValues();

        // Muestra un mensaje de carga en el modal
        this.setModalMessage('Filling out the form data.', false);

        // Llama a la función para obtener los datos de transacción del usuario
        await this.getUserTransactionData();
        this.showModalMessage = false;

        // Completa el formulario con los datos obtenidos
        await this.formCompletion();
      } catch (error) {
        console.error('Error in loadEditForm:', error);
        this.setModalMessage('An error occurred while loading the edit form. Please try again later.', true);
      }
    },

    /**
 * Completa los campos del formulario con los datos de la transacción seleccionada.
 *
 * @returns {void} No retorna ningún valor..
 */
    async formCompletion() {
      try {
        // Recorre las transacciones del usuario y la compara con el id de la transacción del usuario
        const dataUser = this.userTransactionResults.find((user) => user._id === this.idTransaction);

        // Si coincide, asigna los datos obtenidos al modal
        if (dataUser) {
          this.selectedCrypto = dataUser.crypto_code; // MONEDA
          this.selectTransaction = dataUser.action.toLowerCase(); // ACCION: PURCHASE o SALE
          this.Amount = parseFloat(dataUser.crypto_amount); // CANTIDAD DE MONEDA

          if (this.isValidForm()) {
            // Actualiza el precio basado en la criptomoneda seleccionada, la cantidad, y la acción
            await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
          } else {
            this.setModalMessage('Form data is invalid. Please check the entered values.', true);
            this.closeModal();
          }
        } else {
          // Si no encuentra el ID de la transacción
          this.setModalMessage('Transaction not found. Please verify the transaction ID.', true);
        }
      } catch (error) {
        console.error('Error in formCompletion:', error);
        this.setModalMessage('An error occurred while completing the form. Please try again later.', true);
      }
    },
    /**
 * Actualiza el precio de la transacción en función de la criptomoneda seleccionada, la cantidad y el tipo de transacción.
 *
 * @param {string} selectedCrypto - Criptomoneda seleccionada (ejemplo: 'BTC', 'ETH').
 * @param {number} Amount - Cantidad de criptomoneda.
 * @param {string} selectTransaction - Tipo de transacción (puede ser 'purchase' o 'sale').
 * @returns {Promise<void>} Este método es asíncrono y no retorna ningún valor, pero puede actualizar el estado de la aplicación
 * y mostrar mensajes de error en caso de fallos durante el cálculo del precio.
 */

    async updatePrice(selectedCrypto, Amount, selectTransaction) {
      try {
        if (this.selectedExchangeCrypto) {
          console.log(this.selectedExchangeCrypto, selectedCrypto, Amount, selectTransaction);

          this.setModalMessage('Calculating price...', false);

          if (!await this.fetchCryptoPrice({
            exchange: this.selectedExchangeCrypto, crypto: selectedCrypto, quantity: Amount, type: selectTransaction,
          })) {
            const isPurchase = selectTransaction === 'purchase';
            const isInvalidPrice = Number.isNaN(isPurchase ? this.purchasePrice : this.sellPrice);

            if (isInvalidPrice || (isPurchase ? !this.purchasePrice : !this.sellPrice)) {
              this.showModalMessage = true;
              this.showButton = true;
              this.messagesApp = isPurchase ? this.buyErrorMessage : this.saleErrorMessage;
              this.resetModalValues();
              return;
            }
            this.showModalMessage = false;
            this.Price = isPurchase ? this.purchasePrice : this.sellPrice;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
 * Actualiza la transacción en función del tipo de acción (compra o venta).
 *
 * @returns {Promise<void>} Este método es asíncrono y puede actualizar el estado de la interfaz de usuario,
 * mostrando mensajes de error si los datos no son válidos o si el usuario no tiene suficiente saldo para realizar una venta.
 */

    async updateTransaction() {
      try {
        if (!this.isValidForm()) {
          this.setModalMessage('Check that the data is incomplete.', true);
          this.resetModalValues();
          return;
        }

        if (this.selectTransaction.toLowerCase() === 'purchase') {
          await this.handlingEditedData();
        } else {
          let totalCoins = 0;

          this.userTransactionResults.forEach((transactionData) => {
            if (this.selectedCrypto === transactionData.crypto_code) {
              totalCoins += transactionData.crypto_amount;
            }
          });

          // Verificaciones para la venta
          if (totalCoins === 0) {
            this.setModalMessage('Does not have that type of currency available for sale.', true);
            this.resetModalValues();
            this.closeModal();
            return;
          }

          if (this.Amount > totalCoins) {
            this.setModalMessage('Does not have that amount of currency available for sale.', true);
            this.resetModalValues();
            this.closeModal();
            return;
          }

          // Llama a handlingEditedData si todas las validaciones se cumplen
          await this.handlingEditedData();
        }
      } catch (error) {
        console.error('Error updating transaction:', error);
        this.setModalMessage('An error occurred while updating the transaction. Please try again later.', true);
        this.resetModalValues();
      }
    },

    /**
 * Maneja la edición de una transacción, enviando los datos actualizados al servicio correspondiente y emitiendo un evento
 * para actualizar la fila en la interfaz de usuario.
 *
 * @returns {Promise<void>} Este método es asíncrono y maneja la edición de la transacción. Puede mostrar mensajes
 * de éxito o error según el resultado de la operación.
 */
    async handlingEditedData() {
      // Crea el objeto con los datos de la transacción actualizada
      const updateTransaction = {
        action: this.selectTransaction,
        crypto_code: this.selectedCrypto,
        crypto_amount: this.Amount,
        money: this.Price,
        datetime: this.getDateandTime(),
      };

      this.setModalMessage('Editing transaction...', false);
      try {
        await CryptoService.editTransaction(this.idTransaction, updateTransaction);
        this.$emit('editRow', this.idTransaction, updateTransaction); // Emito un evento para editar la fila
        this.setModalMessage('Edit completed successfully.', true);
        this.resetModalValues();
      } catch (error) {
        console.error('Error editing transaction:', error);
        this.setModalMessage('Error editing transaction.', true);
      } finally {
        this.closeModal();
      }
    },

    /**
 * Genera una cadena de fecha y hora en formato ISO 8601 en UTC, recortando los milisegundos.
 *
 * @returns {string} La fecha y hora actual en formato `YYYY-MM-DDTHH:mm:ssZ`, en UTC.
 * Ejemplo: "2024-11-09T11:15Z"
 */
    getDateandTime() {
      const dateNow = new Date();
      return `${dateNow.toISOString().slice(0, -5)}Z`; // Recorta los milisegundos
    },

    /**
 * Resetea los valores del formulario del modal a su estado inicial.
 *
 * @returns {void} No retorna ningún valor, solo restablece las variables de estado del formulario.
 */
    resetModalValues() {
      this.selectedExchangeCrypto = '';
      this.selectedCrypto = '';
      this.selectTransaction = '';
      this.Amount = '';
      this.Price = '';
    },

    /**
 * Verifica si los campos del formulario son válidos para realizar la operación.
 *
 * @returns {boolean} Devuelve `true` si todos los campos son válidos, de lo contrario devuelve `false`.
 */

    isValidForm() {
      return (/* Al llamarla, evaluará la expresión y devolverá el resultado (un valor booleano) de la expresión lógica,
      el cual se puede utilizar para realizar validaciones. */
        this.selectedCrypto
        && this.selectTransaction
        && this.Amount
        && this.Amount >= 0
      );
    },

    ...mapActions({
      getUserTransactionData: 'userTransactionData/getUserTransactionData',
      fetchCryptoPrice: 'getPricesApi/fetchCryptoPrice',
      initializeExchanges: 'exchangesAndCurrencies/initializeExchanges',
      initializeTypesOfCoins: 'exchangesAndCurrencies/initializeTypesOfCoins',
    }),

  },
  watch: {
    async selectedCrypto() {
      try {
        if (this.isValidForm()) {
          await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
        }
      } catch (error) {
        console.error('Error updating price for selectedCrypto:', error);
        this.setModalMessage('An error occurred while updating the price. Please try again later.', true);
      }
    },
    async selectTransaction() {
      try {
        if (this.isValidForm()) {
          await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
        }
      } catch (error) {
        console.error('Error updating price for selectTransaction:', error);
        this.setModalMessage('An error occurred while updating the price. Please try again later.', true);
      }
    },

    async selectedExchangeCrypto() {
      try {
        if (this.isValidForm()) {
          await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
        }
      } catch (error) {
        console.error('Error updating price for selectedExchangeCrypto:', error);
        this.setModalMessage('An error occurred while updating the price. Please try again later.', true);
      }
    },

    async Amount() {
      try {
        if (this.isValidForm()) {
          await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
        }
      } catch (error) {
        console.error('Error updating price for Amount:', error);
        this.setModalMessage('An error occurred while updating the price. Please try again later.', true);
      }
    },
  },

  computed: {
    ...mapGetters({
      password: 'password',
      userTransactionResults: 'userTransactionData/userTransactionResults',
      purchasePrice: 'getPricesApi/purchasePrice',
      sellPrice: 'getPricesApi/sellPrice',
      buyErrorMessage: 'getPricesApi/buyErrorMessage',
      saleErrorMessage: 'getPricesApi/saleErrorMessage',
      getExchanges: 'exchangesAndCurrencies/getExchanges',
      getTypesOfCoins: 'exchangesAndCurrencies/getTypesOfCoins',
    }),

    visibleColumns() {
      if (!this.columnsProp) {
        // Devuelve un array vacío si columnsProp es undefined o null
        return [];
      } if (this.columnsProp.includes('USER')) {
        // Si 'USUARIO' está en columnsProp, devuelve todas las columnas excepto 'USUARIO'
        return this.columnsProp.filter((column) => column !== 'USER');
      }
      // Si 'USUARIO' no está en columnsProp, devuelve todas las columnas sin modificación
      return this.columnsProp;
    },

    filteredRows() {
      if (!this.rowsProps) {
        return [];
      }

      return this.rowsProps.map((row) => {
        // Verifica si 'row' es un array antes de aplicar .filter()
        if (Array.isArray(row)) {
          return row.filter((_, index) => this.columnsProp[index] !== 'USER');
        }
        // Si no es un array, devuelve el 'row' tal como está o ajusta según lo que necesites
        return row;
      });
    }
    ,
  },
};

</script>

<style scoped>

.positive-result {
  color: green;
  font-weight: bold;
}

.negative-result {
  color: red;
  font-weight: bold;
}

.table-container{
  min-width: 1250px;
  margin: 0px auto;
}

.table-crypto{
  border-color: whitesmoke;
  color: #ffffff;
  border: 5px solid;
  margin: 0 auto;
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
  margin-top: 50px;
  border-collapse: collapse; /* Para que los bordes no se dupliquen */
}

.table-crypto th, .table-crypto td {
  border: 3px groove #74a7c9;
  padding: 8px;
  text-align: center;
  text-transform: uppercase;
}

.btn-table {
  background-color: white;
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
  border-radius: 5px;
  text-align: center;
  color: black;
  background: rgb(255, 255, 255);
  border: 2px solid #081f27;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  width: 100px;
  transition: all 300ms;
}

.btn-table:hover {
  box-shadow: 10px 6px 18px rgba(192, 35, 35, 0.2);
  background-color: #f0f0f0;
  color: #000000;
  border-color: rgb(247, 166, 0);
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1001; /* Z-index para el Modal 1 */
  align-items: center;
  justify-content: center;
  text-align: center;
  list-style: none;
}

.modal-content {
  background-color: #fefefe;
  border: 2px solid rgb(247, 166, 0);
  margin: 10% auto;
  padding: 20px;
  color: black;
  width: 25%;
  text-transform: uppercase;
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: bold;
}

.modal-content ul li {
  padding: 12px;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  color: #152f49;
  transition: background-color 0.3s, color 0.3s;
}

.modal-content ul li:last-child {
  margin-bottom: 0; /* Elimina margen extra para el último elemento */
}

.selection-edit{
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 5px;
  width: 70%;
  height: 70%;
  font-weight: bold;
  font-size: 1rem;
  font-family: 'IBM Plex Sans', -apple-system, system-ui, blinkmacsystemfont, 'Segoe UI', roboto, ubuntu;
  color: #152f49;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

</style>
