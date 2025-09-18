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
              <h5 class="fw-bolder mb-10px">Input Code</h5>
              <form @submit.prevent="confirm()">
                <input
                  v-model="form.code"
                  type="text"
                  name="code"
                  placeholder="Add your code here"
                  class="mt-4"
                  pattern="^[a-zA-Z0-9]{6}$"
                  maxlength="6"
                  title="Must be exactly 6 characters (A-Z, a-z, 0-9)"
                  required
                />
                <div
                  class="d-flex align-items-center justify-content-end gap-10px"
                >
                  <input
                    @click="closeIfOutside()"
                    value="Cancel"
                    type="submit"
                    class="w-100px border-0 mb-0"
                    :disabled="submitting"
                  />
                  <input
                    value="Submit"
                    type="submit"
                    class="w-100px btn btn-primary border-0 transition-all mb-0"
                    :disabled="submitting"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { useApi } = useApis();
const { toastData, toggleToast } = useConfigsStores();
const route = useRoute();

const form: any = ref({
  code: "",
});

const emit = defineEmits(["reCheckIsLock"]);

const submitting = ref(false);
async function confirm() {
  submitting.value = true;

  const response: any = await useApi("POST", "submit-code", {
    code: form.value.code,
    courseId: route.params.id,
  });

  if (response.status === "success") {
    toastData.value.status = response.status;
    toastData.value.message = "Add code successfully.";
    submitting.value = false;
    toggleToast();
    hide();
    emit("reCheckIsLock");
    window.location.reload();
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    submitting.value = false;
    toggleToast();
  }
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
