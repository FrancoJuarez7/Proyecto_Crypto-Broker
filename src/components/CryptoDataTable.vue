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
          <td v-for="(value, colIndex) in row" :key="colIndex">
            {{ value }}
          </td>
          <td v-if="actionsButton">

            <button @click="viewTransaction(rowIndex)" @keydown.enter="viewTransaction(rowIndex)"
            @keydown.space="viewTransaction(rowIndex)" tabindex="0"> VIEW </button>

            <button @click="modifyTransaction(rowIndex)" @keydown.enter="modifyTransaction(rowIndex)"
            @keydown.space="modifyTransaction(rowIndex)" tabindex="0">EDIT</button>

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
                <option v-for="(nameExchange, index) in Exchanges" :key="index" :value="nameExchange">
                  {{ nameExchange }}
                </option>
              </select><br> <br>

          <label for="saleCrypo">SELECT THE CRYPTO       </label>
           <select id="saleCrypto" v-model="selectedCrypto">
              <option v-for="(nameCoins, index) in typesOfCoins" :key="index" :value="nameCoins">
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
  </div>
</template>

<script>

import CryptoService from '@/services/CryptoService';
import { mapGetters, mapActions } from 'vuex';

export default {
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
      selectedCrypto: '',
      selectTransaction: '',
      selectedExchangeCrypto: '',
      Amount: 0,
      Price: 0,
      selectedRow: null,
      showModal: false, // Controla la visibilidad del modal
      modalView: false,
      modalEdit: false,
      idTransaction: null,
      typesOfCoins: ['BTC', 'ETH', 'USDT', 'USDC', 'DAI', 'UXD', 'USDP', 'WLD', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOGE', 'TRX', 'LINK', 'DOT', 'MATIC',
        'SHIB', 'LTC', 'BHC', 'EOS', 'XLM', 'FTM', 'AAVE', 'UNI', 'ALGO', 'BAT', 'PAXG', 'CAKE', 'AXS', 'SLP', 'MANA', 'SAND', 'CHZ'],
      Exchanges: ['LETSBIT', 'BITSOALPHA', 'CRYPTOMKT', 'BITGETP2P', 'BUENBIT', 'ELUTER', 'ELDORADOP2P', 'RIPIO', 'BITSO', 'PAXFULP2P', 'FIWIND', 'BINANCEP2P',
        'SATOSHITANGO', 'KRIPTONMARKET', 'ARGENBTC', 'OKEXP2P', 'TIENDACRYPTO', 'LEMONCASH', 'COCOSCRYPTO', 'BYBIT', 'BINANCE', 'PAYDECEP2P', 'TRUBIT',
        'KUCOINP2P', 'RIPIOEXCHANGE', 'VIBRANT', 'PLUSCRYPTO', 'BYBITP2P', 'CRYPTOMKTPRO', 'BELO', 'CALYPSO', 'BITMONEDERO', 'COINEXP2P', 'DECRYPTO', 'SALDO',
        'HUOBIP2P', 'LEMONCASHP2P', 'BINGXP2P', 'TRUBITP2P', 'LNP2PBOTP2P', 'SYKLOP2P', 'XAPO'],
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
      CryptoService.deleteTransaction(this.filasProps[rowIndex][0]) // Primero: elimino la fila.
        .then(() => {
          alert('Transaction deleted');
          this.$emit('deletedRow', rowIndex); /* Segundo: emito un evento para actualizarlo en la tabla porque como tengo que eliminar algo
          que se guarda en filasProps que es una props y no puedo modificarla desde un componente hijo . Le debo pasar el indice de la fila a
          eliminar. IR A ESTE METODO EN EL PADRE */
        })
        .catch((error) => {
          console.error(error);
          alert('Error deleting transaction');
        });
    },
    closeModal() {
      this.showModal = false; // Oculta el modal
    },

    // - - - - - - - - - - - - - - - > ESTO PARA LA EDICION

    async modifyTransaction(rowIndex) {
      this.showModal = true;
      this.modalView = false;

      const [idTransaction] = this.filasProps[rowIndex]; // Desectructuramos el array y guardamos el primer valor aqui.
      /* La desestructuración de arrays te permite tomar los valores de un array y asignarlos directamente a variables utilizando una sintaxis
      similar a la de los arrays. Esto elimina la necesidad de acceder a cada elemento del array manualmente por su índice. */
      this.idTransaction = idTransaction; // Luego a ese valor se lo asigno a mi variable en el data().
      this.modalEdit = true;
      this.resetModalValues();

      const hasData = await this.getUserTransactionData(); // TRAE EL EL ARRAY DE OBJETOS CON LAS TRANSACCIONES DEL USUARIO

      if (!hasData) {
        return;
      }
      this.editTransaction();
    },

    async editTransaction() {
      // Recorre las transacciones del usuario y la compara con el id de la columna que guarda el ID de la transaccion del usuaio
      const dataUser = this.userTransactionResults.find((user) => user._id === this.idTransaction);

      // Si coinciden, los datos que obtengo del objeto de las transacciones, se los asigno al modal:
      if (dataUser) {
        this.selectedCrypto = dataUser.crypto_code; // MONEDA
        this.selectTransaction = dataUser.action; // ACCION: PURCHASE O SALE
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

          await this.fetchCryptoPrice({
            exchange: this.selectedExchangeCrypto,
            crypto: selectedCrypto,
            quantity: Amount,
            type: selectTransaction,
          });

          if ((this.purchasePrice === null || Number.isNaN(this.purchasePrice)) && this.selectTransaction === 'purchase') {
            console.log('ENTRO ACA COMPRA:', this.buyErrorMessage);
            return;
          } if ((this.sellPrice === null || Number.isNaN(this.sellPrice)) && this.selectTransaction === 'sale') {
            console.log('ENTRO ACA VENTA: ', this.saleErrorMessage);
            return;
          }

          this.Price = this.selectTransaction === 'purchase' ? this.purchasePrice : this.sellPrice;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async updateTransaction() {
      if (!this.isValidForm()) {
        console.log('LOS DATOS ESTAN INCOMPLETOS');
        this.resetModalValues();
        return;
      }

      let totalCoins = 0;

      this.userTransactionResults.forEach((transactionData) => {
        if (this.selectedCrypto === transactionData.crypto_code && transactionData.action === 'purchase') {
          totalCoins += transactionData.crypto_amount;
        } else if (this.selectedCrypto === transactionData.crypto_code && transactionData.action === 'sale') {
          totalCoins -= transactionData.crypto_amount;
        }
      });

      const updateTransaction = {
        action: this.selectTransaction,
        crypto_code: this.selectedCrypto,
        crypto_amount: this.Amount,
        money: this.Price,
        datetime: this.getDateandTime(),
      };

      if (totalCoins === 0) {
        console.log('No cuenta con ese tipo de moneda para vender');
        this.resetModalValues();
        return;
      }
      if (this.Amount > totalCoins) {
        console.log('No cuenta con esa cantidad de moneda para vender');
        this.resetModalValues();
        return;
      }

      try {
        await CryptoService.editTransaction(this.idTransaction, updateTransaction);
        alert('Transaction edited successfully');
        this.$emit('editRow', this.idTransaction, updateTransaction); // Emito un evento para editar la fila
        this.resetModalValues();
      } catch (error) {
        console.error('Error editing transaction:', error);
        alert('Error editing transaction');
      } finally {
        this.newAmount = '';
        this.newPrice = '';
        this.closeModal();
      }

      console.log('TOTAL MONEDAS: ', totalCoins);
      console.log('OBJETO FINAL: ', this.userTransactionResults);
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

    ...mapActions('userTransactionData', ['getUserTransactionData']),
    ...mapActions('getPricesApi', ['fetchCryptoPrice']),
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
    ...mapGetters(['password']),
    ...mapGetters('userTransactionData', ['userTransactionResults']),
    ...mapGetters('getPricesApi', ['purchasePrice']),
    ...mapGetters('getPricesApi', ['sellPrice']),
    ...mapGetters('getPricesApi', ['buyErrorMessage']),
    ...mapGetters('getPricesApi', ['saleErrorMessage']),

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

      return this.filasProps.map((row) => row.filter((_, index) => this.columnasProp[index] !== 'USUARIO'));
    },
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
