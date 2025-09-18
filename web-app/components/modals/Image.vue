<template>
  <div :class="{ 'set-form-login-overlay': isShow }" @click="closeIfOutside">
    <div
      class="modal-form-login mkp-form-login"
      :class="{ active: isShow }"
      @click.stop
    >
      <div class="row">
        <div class="form-login">
          <div
            class="form-login__wrapper p-30px text-start"
            style="width: 100%; height: 100%"
          >
            <div class="close-button" @click="closeIfOutside">
              <i class="fa-solid fa-xmark"></i>
            </div>
            <img
              :src="image"
              class="img-fluid rounded"
              width="2000"
              height="100%"
            />
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
  image: {
    type: String,
    default: "",
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
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
}
.modal-form-login {
  width: 80%;
  height: auto;
}
.close-button {
  right: 15px;
  top: 8px;
}
</style>
