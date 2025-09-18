<template>
  <div :class="{ 'set-form-login-overlay': isShow }" @click="closeIfOutside">
    <div
      class="modal-form-register mkp-form-register"
      :class="{ active: isShow }"
      @click.stop
    >
      <div class="container">
        <div class="row">
          <div class="form-register">
            <div class="form-register__wrapper p-50px pb-80px text-center">
              <div class="close-button" @click="closeIfOutside">
                <i class="fa-solid fa-xmark"></i>
              </div>
              <h5 class="fw-bolder mb-30px">Change Password</h5>
              <form @submit.prevent="onSubmit()">
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  class="disabled"
                  required
                  disabled
                />
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  min="6"
                />
                <input
                  v-model="form.confirm_password"
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  required
                />
                <input
                  v-if="!submitting"
                  type="submit"
                  value="Submit"
                  class="form-register__submit transition-all"
                />
                <div v-else class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </form>

              <div
                class="d-flex align-items-center justify-content-center gap-10px mt-20px"
              >
                <a
                  @click="handleEditProfile()"
                  href="#"
                  class="form-register__register transition-all handle-login"
                  >Back To Edit Profile</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["editProfile"]);
const { userInfo } = useUserStores();
const { toastData, toggleToast } = useConfigsStores();
const { useApi } = useApis();

function handleEditProfile() {
  emit("editProfile");
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

onMounted(() => {
  form.value = JSON.parse(JSON.stringify(userInfo.value));
  const date = new Date(form.value.profile.birthday);
  form.value.profile.birthday = date.toISOString().split("T")[0];
});

const submitting = ref<boolean>(false);

const form = ref<any>({
  password: "",
  confirm_password: "",
});

async function onSubmit(): Promise<void> {
  submitting.value = true;

  // Validate
  if (form.value.password !== form.value.confirm_password) {
    toastData.value.status = "fail";
    toastData.value.message = "Password and Confirm Password do not match!";
    toggleToast();

    form.value.password = "";
    form.value.confirm_password = "";
    submitting.value = false;
    return;
  }

  const response: any = await useApi(
    "PUT",
    "profile/change-password",
    form.value
  );

  if (response.data) {
    toastData.value.status = response.status;
    toastData.value.message = "Password changed successfully.";
    submitting.value = false;
    toggleToast();
    hide();
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    submitting.value = false;
    toggleToast();
  }
}
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
