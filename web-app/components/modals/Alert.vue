<template>
  <div :class="{ 'set-form-login-overlay': isShow }" @click="closeIfOutside">
    <div
      class="modal-form-login mkp-form-login"
      :class="{ active: isShow }"
      @click.stop
    >
      <div class="container">
        <div class="row">
          <div class="form-login">
            <div class="form-login__wrapper p-30px text-start">
              <div class="close-button" @click="closeIfOutside">
                <i class="fa-solid fa-xmark"></i>
              </div>
              <h5 class="fw-bolder mb-10px">{{ label }}</h5>
              <p class="mb-20px">{{ subLabel }}</p>
              <div
                class="d-flex align-items-center justify-content-end gap-10px"
              >
                <input
                  @click="closeIfOutside()"
                  value="Cancel"
                  type="submit"
                  class="w-100px border-0 mb-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: "Confirm Modal!",
  },
  subLabel: {
    type: String,
    default: "You cannot undo this action.",
  },
});
const emit = defineEmits(["confirm"]);
function confirm() {
  emit("confirm");
}

const isShow = ref<boolean>(false);

function show(): void {
  isShow.value = true;
}
function hide(): void {
  isShow.value = false;
}

function closeIfOutside(): void {
  hide();
}

defineExpose({ show, hide });
</script>

<style lang="css" scoped>
.set-form-login-overlay {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100vw;
  height: 100vh;
}
</style>
