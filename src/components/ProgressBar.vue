<template>
    <div v-if="showBar" class="cartel">
      <div class="progress-bar" :style="{ width: `${loadingProgress}%` }">
        <div class="progress-fill" :style="{ width: `${loadingProgress}%` }"></div>
      </div>
    </div>
  </template>

<script>
export default {
  props: {
    loadingProgress: {
      type: Number,
      required: true,
    },
    showBar: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

  <style scoped>

  .cartel {
    top: 0;
    left: 0;
    width: 50%; /* Cambia esto si deseas un tamaño diferente */
    height: 50%; /* Cambia esto si deseas un tamaño diferente */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .progress-bar {
    background-color: #e0e0e0; /* Color de fondo de la barra */
    border-radius: 4px;
    overflow: hidden;
    height: 20px; /* Altura de la barra */
    width: 100%; /* Asegúrate de que ocupa el 100% de su contenedor padre */
    justify-content: center;
    align-items: center;
  }

  .progress-fill {
    background-color: greenyellow; /* Color de la barra de progreso */
    height: 100%; /* Llenar el 100% de la altura de la barra */
    transition: width 0.2s; /* Transición suave para el cambio de ancho */
  }
  </style>
