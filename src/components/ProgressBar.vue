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
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-bar {
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  height: 20px;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
}

.progress-fill {
  background-color: greenyellow;
  height: 100%; /* Llenar el 100% de la altura de la barra */
  transition: width 0.2s; /* Transición suave para el cambio de ancho */
}
</style>
