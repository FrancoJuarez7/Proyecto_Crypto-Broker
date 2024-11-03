<template>
    <div v-if="isVisible" class="modal-app">
        <div class="modal-content">
            <p>{{ message }}</p>
            <button v-if="showCloseButton" @click="$emit('close')"> CLOSE </button>
        </div>
    </div>
</template>

<script>

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    showCloseButton: {
      type: Boolean,
      required: true,
    },
  },
};

</script>

<style>

.modal-app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
}
.modal-content {
  background: black;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

</style>
