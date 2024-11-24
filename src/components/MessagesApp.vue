<template>
    <div v-if="isVisible" class="modal-app">
        <div class="modal-content">
            <p>{{ message }}</p>
            <button id="btn" v-if="showCloseButton" @click="$emit('close')"> CLOSE </button>
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

<style scoped>

.modal-app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content {
  background: #fff;
  padding: 25px;
  border-radius: 12px;
  border: 2px solid rgb(247, 166, 0);
  text-align: center;
  font-family: system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #333;
}

.modal-content #btn {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-content #btn:hover {
  background-color: darkred;
}

</style>
