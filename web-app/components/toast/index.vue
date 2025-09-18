<script setup lang="ts">
const { toastShow, toastData, closeToast } = useConfigsStores();

const fadeShow = ref<boolean>(false);
const duration = ref<number>(4000);
const setDelay = ref<NodeJS.Timeout>();

watch(
  () => toastShow.value,
  (value) => {
    if (value) {
      fadeShow.value = false;
      setTimeout(() => {
        fadeShow.value = value;
      }, 100);
      setDelay.value = setTimeout(() => {
        hide();
      }, duration.value);
    }
  }
);
function hide(): void {
  clearTimeout(setDelay.value);
  fadeShow.value = false;
  setTimeout(() => {
    closeToast();
  }, 100);
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="toastShow && fadeShow"
      class="toast align-items-center border-0"
      :class="
        toastData?.status === 'success' ? 'text-bg-success' : 'text-bg-danger'
      "
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          {{ toastData.message }}
        </div>
        <button
          @click="hide()"
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.toast {
  display: block;
  position: fixed;
  top: 20px;
  right: 10px;
  z-index: 999;
}
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Toast styling */
.toast {
  display: block;
  position: fixed;
  top: 20px;
  right: 10px;
  z-index: 999;
}
</style>
