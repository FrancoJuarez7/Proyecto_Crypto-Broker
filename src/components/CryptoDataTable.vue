<template>
  <div>
    <!-- Tabla y botones -->
    <table border="2" style="border-color: whitesmoke; color: #ffffff;">
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
          <td v-for="(value, colIndex) in (Array.isArray(row) ? row : Object.values(row))" :key="colIndex">
            {{ value }}
          </td>
          <td v-if="actionsButton">

            <button @click="viewTransaction(rowIndex)" @keydown.enter="viewTransaction(rowIndex)"
            @keydown.space="viewTransaction(rowIndex)" tabindex="0"> VIEW </button>

            <button @click="loadEditForm(rowIndex)" @keydown.enter="loadEditForm(rowIndex)"
            @keydown.space="loadEditForm(rowIndex)" tabindex="0">EDIT</button>

            <button @click="deleteTransaction(rowIndex)" @keydown.enter="deleteTransaction(rowIndex)"
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

          <label for="sellExchangeCrypto">SELECT THE EXCHANGE         </label>
              <select id="sellExchangeCrypto" v-model="selectedExchangeCrypto">
                <option value="" disabled selected>CHOOSE THE EXCHANGE</option>
                <option v-for="(nameExchange, index) in getExchanges" :key="index" :value="nameExchange">
                  {{ nameExchange }}
                </option>
              </select><br> <br>

          <label for="saleCrypo">SELECT THE CRYPTO       </label>
           <select id="saleCrypto" v-model="selectedCrypto">
              <option v-for="(nameCoins, index) in getTypesOfCoins" :key="index" :value="nameCoins">
                {{ nameCoins }}
              </option>
           </select><br> <br>

           <label for="transactionType">TRANSACTION TYPE       </label>
           <select id="transactionType" v-model="selectTransaction">
              <option value="purchase"> PURCHASE </option>
              <option value="sale"> SALE </option>
           </select><br> <br>

          <label>AMOUNT   <input type="number" v-model="Amount" min="0.000001" max="100"></label> <br> <br>
          <label>PRICE   <input type="number" v-model="Price" readonly></label> <br> <br>

          <button @click="updateTransaction">EDITAR</button> <button @click="closeModal" >CANCELAR</button>

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
    viewTransaction(rowIndex) {
      /* Recibo el indice de la fila desde el template, con eso puedo acceder a una fila en particular this.filasProps[rowIndex] y
      con esto [0] accedo a un valor en especifico de la fila */
      // console.log(this.filasProps[rowIndex][0]);

      /* Como filteredRows (Propiedad computada) devuelve un array con las filas de las transacciones menos la de la columa USUARIOS,
      encontonces le paso el indice de la fila que quiero que me devuelva */
      if (this.selectedRow !== this.filteredRows[rowIndex]) {
        this.selectedRow = this.filteredRows[rowIndex];
        this.showModal = true; // Muestra el modal
        this.modalView = true;
        this.modalEdit = false;
      }
    },
    deleteTransaction(rowIndex) {
      const transactionId = this.filasProps[rowIndex][0]; // Asegúrate de que esto sea correcto
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
    setModalMessage(message, showButton) {
      this.showModalMessage = true;
      this.showButton = showButton;
      this.messagesApp = message;
    },
    closeModal() {
      this.showModal = false; // Oculta el modal
    },

    // - - - - - - - - - - - - - - - > ESTO PARA LA EDICION

    async loadEditForm(rowIndex) { // ABRE EL FORMULARIO
      this.showModal = true;
      this.modalView = false;

      const [idTransaction] = this.filasProps[rowIndex]; // Desectructuramos el array y guardamos el primer valor aqui.
      /* La desestructuración de arrays te permite tomar los valores de un array y asignarlos directamente a variables utilizando una sintaxis
      similar a la de los arrays. Esto elimina la necesidad de acceder a cada elemento del array manualmente por su índice. */
      this.idTransaction = idTransaction; // Luego a ese valor se lo asigno a mi variable en el data().
      this.modalEdit = true;
      this.resetModalValues();

      this.setModalMessage('Filling out the form data.', false);
      await this.getUserTransactionData(); // TRAE EL EL ARRAY DE OBJETOS CON LAS TRANSACCIONES DEL USUARIO
      this.showModalMessage = false;

      this.formCompletion();
    },

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

    async updateTransaction() {
      if (!this.isValidForm()) {
        this.setModalMessage('Check that the data is incomplete.', true);
        this.resetModalValues();
        return;
      }

      if ((this.selectTransaction).toLocaleLowerCase() === 'purchase') { // PURCHASE: SI ESTO ES IGUAL, COMPRO. LISTO
        await this.handlingEditedData();
      } else { // SALE: ESTO ES SOLAMENTE PARA SABER SI PUEDE VENDER
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

    async handlingEditedData() {
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

    // - - - - - - - - - - - - - - - > FINALIZA LA EDICION
    getDateandTime() {
      const now = new Date();
      const options = {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
      };
      return `${now.toLocaleString('sv-SE', options).replace(' ', 'T')}Z`; // Formato: YYYY-MM-DDTHH:mm:ssZ
    },

    resetModalValues() {
      this.selectedExchangeCrypto = '';
      this.selectedCrypto = '';
      this.selectTransaction = '';
      this.Amount = '';
      this.Price = '';
    },
    // LO PODRIA HABER HECHO ASI:
    // const isValid = this.selectedCrypto && this.selectTransaction && this.Amount && this.Amount >= 0;
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
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  color: black;
  border: 1px solid #888;
  width: 80%;
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
