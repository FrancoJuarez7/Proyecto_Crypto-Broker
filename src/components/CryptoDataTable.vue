<template>
  <div class="table-container">
    <!-- Tabla y botones -->
    <table class="table-crypto">
      <thead>
        <tr>
          <th v-for="(columna, index) in visibleColumns" :key="index">
            {{ columna }}
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
            {{ visibleColumns[index] ? visibleColumns[index] : 'Columna no visible' }}: {{ value }}
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

          <button class= "btn-table" @click="updateTransaction">EDITAR</button> <button class= "btn-table" @click="closeModal" >CANCELAR</button>

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
    columnasProp: {
      type: Array,
      required: true,
    },
    filasProps: {
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
 * Utiliza el índice de fila (`rowIndex`) para acceder a una transacción en `filteredRows` (excluyendo filas de usuarios).
 * Si la transacción seleccionada no coincide con `selectedRow`, actualiza `selectedRow`, muestra el modal y
 * habilita el modo de visualización.
 *
 * @param {number} rowIndex - El índice de la fila seleccionada desde el template.
 * @returns {void} Este método no devuelve ningún valor, solo actualiza el estado de `selectedRow` y del modal.
 */

    viewTransaction(rowIndex) {
      /* filteredRows devuelve un array con las filas de las transacciones menos la de la columa USUARIOS. */
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
 * Obtiene el `transactionId` de la fila seleccionada (`rowIndex`), muestra un mensaje de carga,
 * y luego intenta eliminar la transacción mediante `CryptoService.deleteTransaction`.
 * Si la eliminación es exitosa, emite un evento para actualizar la tabla en el componente padre.
 * Si ocurre un error, muestra un mensaje de error.
 *
 * @param {number} rowIndex - Índice de la fila a eliminar.
 * @returns {void} Esta función no devuelve ningún valor; solo gestiona el estado de la interfaz y emite eventos.
 */

    deleteTransaction(rowIndex) {
      const transactionId = this.filasProps[rowIndex][0];
      console.log('Transaction ID:', transactionId);
      console.log('Deleting transaction at index:', rowIndex);

      this.setModalMessage('Deleting transaction...', false);

      CryptoService.deleteTransaction(this.filasProps[rowIndex][0]) // Primero: elimino la fila.
        .then(() => {
          this.$emit('deletedRow', rowIndex); /* Segundo: emito un evento para actualizarlo en la tabla porque como tengo que eliminar algo
          que se guarda en filasProps que es una props y no puedo modificarla desde un componente hijo . Le debo pasar el indice de la fila a
          eliminar. IR A ESTE METODO EN EL PADRE */

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
 * Muestra un modal con el mensaje proporcionado y define si el botón debe mostrarse.
 *
 * @param {string} message - El mensaje a mostrar en el modal.
 * @param {boolean} showButton - Indica si el botón debe mostrarse en el modal.
 * @returns {void} Esta función no devuelve ningún valor; solo actualiza el estado del modal.
 */

    setModalMessage(message, showButton) {
      this.showModalMessage = true;
      this.showButton = showButton;
      this.messagesApp = message;
    },

    /**
 * Cierra el modal de la interfaz de usuario.
 *
 * Este método cambia el estado de `showModal` a `false` para ocultar el modal.
 * No devuelve ningún valor y solo altera el estado de la interfaz.
 *
 * @returns {void} Esta función no devuelve ningún valor.
 */

    closeModal() {
      this.showModal = false;
    },

    /**
 * Abre el formulario de edición y carga los datos de la transacción seleccionada.
 *
 * Este método muestra un modal para editar una transacción específica. Obtiene el `idTransaction` de la fila seleccionada
 * y lo usa para cargar los datos correspondientes. Lueo, llena el formulario con la información de la transacción
 * y muestra un mensaje de carga hasta que los datos estén disponibles.
 *
 * @param {number} rowIndex - Índice de la fila seleccionada en la tabla de transacciones.
 *
 * @returns {void} Este método no devuelve un valor. Solo maneja la visualización y carga de datos para el formulario.
 */

    async loadEditForm(rowIndex) {
      this.showModal = true;
      this.modalView = false;

      const [idTransaction] = this.filasProps[rowIndex]; // Desectructuramos el array y guardamos el primer valor aqui.
      /* La desestructuración de arrays te permite tomar los valores de un array y asignarlos directamente a variables utilizando una sintaxis
    similar a la de los arrays. Esto elimina la necesidad de acceder a cada elemento del array manualmente por su índice. */

      this.idTransaction = idTransaction; // Luego a ese valor se lo asigno a mi variable en el data().
      this.modalEdit = true;
      this.resetModalValues();

      this.setModalMessage('Filling out the form data.', false);
      await this.getUserTransactionData();
      this.showModalMessage = false;

      this.formCompletion();
    },

    /**
 * Abre el formulario de edición y carga los datos de la transacción seleccionada.
 *
 * Este método muestra un modal para editar una transacción específica. Obtiene el `idTransaction` de la fila seleccionada
 * y lo usa para cargar los datos correspondientes. Llena el formulario con la información de la transacción y muestra un
 * mensaje de carga hasta que los datos estén disponibles.
 *
 * @param {number} rowIndex - Índice de la fila seleccionada en la tabla de transacciones.
 *
 * @returns {void} Este método no devuelve un valor. Solo maneja la visualización y carga de datos para el formulario.
 */

    async formCompletion() {
    // Recorre las transacciones del usuario y la compara con el id de la columna que guarda el ID de la transaccion del usuaio
      const dataUser = this.userTransactionResults.find((user) => user._id === this.idTransaction);

      // Si coinciden, los datos que obtengo del objeto de las transacciones, se los asigno al modal:
      if (dataUser) {
        this.selectedCrypto = dataUser.crypto_code; // MONEDA
        this.selectTransaction = (dataUser.action).toLowerCase(); // ACCION: PURCHASE O SALE
        this.Amount = parseFloat(dataUser.crypto_amount); // CANTIDAD DE MONEDA

        if (this.isValidForm()) {
          await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
        }
      }
    },

    // LO QUE PODRIA REPASAR ES PORQUE CUANDO ELIJO EL TIPO DE EXCHANGE ANTES DE QUE SE OBTENLA LOS DATOS DE LA API LUEGO ME MUESTRA:
    /* LETSBIT DAI 1 sale
    LETSBIT DAI 1 sale
    LETSBIT DAI 1 sale
    LETSBIT DAI 1 sale
    LETSBIT DAI 1 sale
    SI SELECCIONO EXCHANGE ANTES QUE SE AUTOCOMPELTEN LOS DATOS ME PASA ESO DE QUE LLAMA VARIAS VECES AL AWAIT
    */

    /**
 * Actualiza el precio de la transacción en función de la criptomoneda seleccionada, la cantidad y el tipo de transacción.
 *
 * Este método calcula el precio de la criptomoneda dependiento de de los parámetros (como el tipo de transacción, la criptomoneda seleccionada).
 * Actualiza la interfaz del usuario con los valores correspondientes. Si el cálculo del precio falla o los datos son inválidos, se muestra un
 * mensaje de error.
 *
 * @param {string} selectedCrypto - Criptomoneda seleccionada (ejemplo: 'BTC', 'ETH').
 * @param {number} Amount - Cantidad de criptomoneda.
 * @param {string} selectTransaction - Tipo de transacción (puede ser 'purchase' o 'sale').
 *
 * @returns {Promise<void>} Este método es asíncrono y no devuelve un valor, pero puede actualizar el estado de la aplicación
 * y mostrar mensajes de error en caso de fallos durante el cálculo del precio.
 */

    async updatePrice(selectedCrypto, Amount, selectTransaction) {
      try {
        if (this.selectedExchangeCrypto) {
          // debugger en chrome que es cuando mas tarda en cargar donde puedo probar esto;
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
 * Este método valida los datos del formulario, y dependiendo de si la acción es una compra o venta,
 * realiza diferentes verificaciones. Si la acción es una compra, simplemente se procesan los datos.
 * Si la acción es una venta, verifica si el usuario tiene suficientes monedas de la criptomoneda seleccionada
 * para realizar la transacción. Si no es así, muestra un mensaje de error.
 *
 * @returns {Promise<void>} Este método es asíncrono y puede actualizar el estado de la interfaz de usuario,
 * mostrando mensajes de error si los datos no son válidos o si el usuario no tiene suficiente saldo para realizar una venta.
 */

    async updateTransaction() {
      if (!this.isValidForm()) {
        this.setModalMessage('Check that the data is incomplete.', true);
        this.resetModalValues();
        return;
      }

      if ((this.selectTransaction).toLocaleLowerCase() === 'purchase') {
        await this.handlingEditedData();
      } else {
        let totalCoins = 0;

        this.userTransactionResults.forEach((transactionData) => {
          if (this.selectedCrypto === transactionData.crypto_code) {
            totalCoins += transactionData.crypto_amount; // Si es igual, suma para ver si tengo esa moneda a vender
          }
        });

        if (totalCoins === 0) {
          this.setModalMessage('Does not have that type of currency available for sale.', true);
          console.log('No cuenta con esa tipo de moneda para vender');
          this.resetModalValues();
          return;
        }

        if (this.Amount > totalCoins) {
          this.setModalMessage('Does not have that amount of currency available for sale.', true);
          console.log('No cuenta con esa cantidad de moneda para vender');
          this.resetModalValues();
          return;
        }

        await this.handlingEditedData();
      }
    },

    /**
 * Maneja la edición de una transacción, enviando los datos actualizados al servicio correspondiente
 * y emitiendo un evento para actualizar la fila en la interfaz de usuario.
 *
 * Este método crea un objeto con los nuevos datos de la transacción (acción, criptomoneda, cantidad, precio y fecha),
 * luego llama al servicio `CryptoService.editTransaction` para actualizar la transacción en el backend.
 * Si la actualización es exitosa, emite un evento para actualizar la fila en la interfaz de usuario.
 * En caso de error, muestra un mensaje de error en el modal.
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
 * Esta función obtiene la fecha y hora actuales en UTC y las formatea en el estándar ISO 8601, eliminando los
 * milisegundos para obtener la precisión de segundos. Es útil en aplicaciones donde se requiere un formato
 * uniforme y sin zonas horarias locales, como al enviar datos a una API.
 *
 * @returns {string} La fecha y hora actual en formato `YYYY-MM-DDTHH:mm:ssZ`, en UTC.
 * Ejemplo: "2024-11-09T11:15Z"
 */
    getDateandTime() {
      const now = new Date();
      return `${now.toISOString().slice(0, -5)}Z`; // Recorta los milisegundos
    },

    /**
 * Resetea los valores del formulario del modal a su estado inicial.
 * Este método se llama generalmente después de realizar una operación (como editar o agregar una transacción)
 * para limpiar todos los campos del modal y preparar el formulario para una nueva interacción.
 *
 * @returns {void} Este método no retorna nada, solo restablece las variables de estado del formulario.
 */
    resetModalValues() {
      this.selectedExchangeCrypto = '';
      this.selectedCrypto = '';
      this.selectTransaction = '';
      this.Amount = '';
      this.Price = '';
    },

    /**
 * Verifica si los campos del formulario son válidos para realizar la operación. Este método realiza una evaluación
 * lógica de los valores de las propiedades del formulario y devuelve `true` si todos los campos son válidos, o
 * `false` si alguno de los campos no lo es. Se asegura de que todos los campos necesarios tengan un valor asignado
 * y que la cantidad (`Amount`) sea un valor positivo o igual a cero.
 *
 * @returns {boolean} Devuelve `true` si todos los campos son válidos, de lo contrario devuelve `false`.
 */

    isValidForm() {
      return (/* CUANDO LA LLAME, EVALUARA LA EXPRESION Y DEVOLVERA EL RESULTADO (BOOLEANO) DE LA EXPRESION LOGICA QUE LO PUEDO UTILIZAR PARA
      REALIZAR VALIDACIONES */
        this.selectedExchangeCrypto
        && this.selectedCrypto
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
      if (this.isValidForm()) {
        await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
      }
    },
    async selectTransaction() {
      if (this.isValidForm()) {
        await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
      }
    },
    async selectedExchangeCrypto() {
      if (this.isValidForm()) {
        await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
      }
    },
    async Amount() {
      if (this.isValidForm()) {
        await this.updatePrice(this.selectedCrypto, this.Amount, this.selectTransaction);
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
      if (!this.columnasProp) {
        // Devuelve un array vacío si columnasProp es undefined o null
        return [];
      } if (this.columnasProp.includes('USUARIO')) {
        // Si 'USUARIO' está en columnasProp, devuelve todas las columnas excepto 'USUARIO'
        return this.columnasProp.filter((columna) => columna !== 'USUARIO');
      }
      // Si 'USUARIO' no está en columnasProp, devuelve todas las columnas sin modificación
      return this.columnasProp;
    },

    /* ESTO ME DEVUELVE UN ARRAY de cada fila filtrando que no se muestren los datos de la columna "USUARIO". filasProps.map recorre
    cada fila de las transacciones que recibo de la API, dentro de cada fila, aplica `filter` eliminando losbvalores correspondientes a
    la columna "USUARIO".  De este modo, se excluyen los datos de la columna "USUARIO" en la visualización de la tabla, pero estos datos
    permanecen disponibles en el código para su uso posterior. */

    filteredRows() {
      if (!this.filasProps) {
        return [];
      }

      return this.filasProps.map((row) => {
        // Verifica si 'row' es un array antes de aplicar .filter()
        if (Array.isArray(row)) {
          return row.filter((_, index) => this.columnasProp[index] !== 'USUARIO');
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
  border: 3px groove #74a7c9; /* Borde discontinuo azul */
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
