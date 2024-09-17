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

            <button @click="editTransaction(rowIndex)" @keydown.enter="editTransaction(rowIndex)"
            @keydown.space="editTransaction(rowIndex)" tabindex="0">EDIT</button>

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
          <h3>Transaction details</h3>
          <ul>
            <li v-for="(value, index) in selectedRow" :key="index">
            {{ visibleColumns[index] ? visibleColumns[index] : 'Columna no visible' }}: {{ value }}
            </li>
          </ul>
        </div>
        <div v-if="modalEdit">
          <h3>Transaction EDIT</h3>
          <label>AMOUNT<input type="number" v-model="newAmount"></label><br>
          <label>MONEY (ARS)<input type="number" v-model="newPrice"></label><br>
          <button @click="modifyTransaction">EDITAR</button> <button @click="closeModal" >CANCELAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import CryptoService from '@/services/CryptoService';
import { mapGetters } from 'vuex';

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
      selectedRow: null,
      showModal: false, // Controla la visibilidad del modal
      modalView: false,
      modalEdit: false,
      newAmount: '',
      newPrice: '',
      idTransaction: null,
    };
  },
  methods: {
    viewTransaction(rowIndex) {
      /* Recibo el indice de la fila desde el template, con eso puedo acceder a una fila en particular this.filasProps[rowIndex] y
      con esto [0] accedo a un valor en especifico de la fila */
      // console.log(this.filasProps[rowIndex][0]);

      /* Como filteredRows (Propiedad computada) devuelve un array con las filas de las transacciones menos la de la columa USUARIOS,
      encontonces le paso el indice de la fila que quiero que me devuelva */
      this.selectedRow = this.filteredRows[rowIndex];

      this.showModal = true; // Muestra el modal
      this.modalView = true;
      this.modalEdit = false;
    },
    deleteTransaction(rowIndex) {
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
    editTransaction(rowIndex) {
      // Implementa la lógica para editar una transacción
      this.showModal = true;
      this.modalView = false;
      this.modalEdit = true;

      // Desestructuración para obtener el idTransaction
      //this.filasProps[rowIndex] --> Se obtiene la fila entera del indice de la fila que hice clic en EDIT;
      //En [idTransaction] se va a guardar el primer elemento de la fila () sino pongo los [] se asigna la fila entera.
      // Por ultimo le asigno ese valor a la variable mia del data();
      const [idTransaction] = this.filasProps[rowIndex];
      this.idTransaction = idTransaction;
    },
    modifyTransaction() {
      const updateTransaction = {
        crypto_amount: this.newAmount,
        money: this.newPrice,
      };

      CryptoService.editTransaction(this.idTransaction, updateTransaction)
        .then(() => {
          alert('Transaction edited successfully');
          this.$emit('editRow', this.idTransaction, updateTransaction); // Emito un evento para editar la fila
        })
        .catch((error) => {
          console.error(error);
          alert('Error editing transaction');
        });

      this.newAmount = '';
      this.newPrice = '';
      this.closeModal();
    },
  },
  computed: {
    ...mapGetters(['password']),

    visibleColumns() {
      // Devuelve un ARRAY con los nombres de todaslas columnas, excluyendo a 'USUARIO' de las columnas visibles.
      return this.columnasProp.filter((columna) => columna !== 'USUARIO');
    },

    /* ESTO ME DEVUELVE UN ARRAY de cada fila filtrando que no se muestren los datos de la columna "USUARIO". filasProps.map recorre
    cada fila de las transacciones que recibo de la API, dentro de cada fila, aplica `filter` eliminando losbvalores correspondientes a
    la columna "USUARIO".  De este modo, se excluyen los datos de la columna "USUARIO" en la visualización de la tabla, pero estos datos
    permanecen disponibles en el código para su uso posterior. */

    filteredRows() {
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
