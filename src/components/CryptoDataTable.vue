<template>
  <div>
    <table border="2" style="border-color: whitesmoke; color:  #ffffff;;">
      <thead>
        <tr>
          <th v-for="(columna, index) in columnasProp" :key="index">
            {{ columna }}
          </th>
          <th v-if="actionsButton">
            ACTIONS
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Itera sobre cada fila en filasProps -->
        <tr v-for="(row, rowIndex) in filasProps" :key="rowIndex">
          <!-- Itera sobre cada columna de la fila -->
          <td v-for="(value, colIndex) in row" :key="colIndex">
            {{ value }}
          </td>
          <td v-if="actionsButton">
            <button>VIEW</button>
            <button>EDIT</button>
            <button>DELETE</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
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
  name: 'CryptoDataTable',
};
</script>

<style scoped>
/* Aquí va tu CSS */
</style>
