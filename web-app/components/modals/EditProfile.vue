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
              <h5 class="fw-bolder mb-30px">Edit Profile</h5>
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
                  v-model="form.name"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                />
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  pattern="^[0-9]{10}$"
                  title="Please enter a valid 10-digit phone number"
                  required
                />
                <Vue3DatePicker
                  v-model="form.profile.birthday"
                  inputFormat="dd/MM/yyyy"
                  placeholder="dd/mm/yyyy"
                  :enableTimePicker="false"
                />

                <div class="d-flex gap-10px mb-20px">
                  <div class="d-flex align-items-center gap-10px">
                    <input
                      type="radio"
                      v-model="form.profile.gender"
                      value="Male"
                      class="m-0"
                    />
                    <label
                      class="cursor-pointer text-nowrap"
                      for="direct-bank-transfer"
                      >Male
                    </label>
                  </div>
                  <div class="d-flex align-items-center gap-10px">
                    <input
                      type="radio"
                      v-model="form.profile.gender"
                      value="Female"
                      class="m-0"
                    />
                    <label
                      class="cursor-pointer text-nowrap"
                      for="cheque-payment"
                      >Female</label
                    >
                  </div>
                </div>

                <input
                  v-model="form.profile.position"
                  type="text"
                  name="position"
                  placeholder="Position"
                />
                <input
                  v-model="form.profile.address"
                  type="text"
                  name="address"
                  placeholder="address"
                />
                <input
                  type="submit"
                  value="Submit"
                  class="form-register__submit transition-all"
                />
              </form>

              <div
                class="d-flex align-items-center justify-content-center gap-10px mt-20px"
              >
                <a
                  @click="handleChangePassword()"
                  href="#"
                  class="form-register__register transition-all handle-login"
                  >Change Password?</a
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
import Vue3DatePicker from "vue3-datepicker";

const emit = defineEmits(["changePassword"]);
const { userInfo, getUserInfo } = useUserStores();
const { toastData, toggleToast } = useConfigsStores();
const { useApi } = useApis();

function handleChangePassword() {
  emit("changePassword");
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

  // แปลง ISO String ให้เป็น Date object ก่อนนำไปใช้กับ v-model
  if (form.value.profile.birthday) {
    form.value.profile.birthday = new Date(form.value.profile.birthday);
  }
  form.value.profile.gender = form.value.profile.gender || "Male";
});

const submitting = ref<boolean>(false);

const form = ref<any>({
  name: "",
  phoneNumber: "",
  profile: {
    birthday: "",
    gender: "",
    position: "",
    address: "",
  },
});

async function onSubmit(): Promise<void> {
  submitting.value = true;

  // แปลงวันที่ให้เป็นรูปแบบ YYYY-MM-DD
  let birthday = "";
  if (form.value.profile.birthday) {
    const date = new Date(form.value.profile.birthday);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // เพิ่ม 1 เนื่องจาก getMonth() เริ่มนับจาก 0
    const day = String(date.getDate()).padStart(2, "0");

    birthday = `${year}-${month}-${day}`; // สร้างรูปแบบ YYYY-MM-DD
  }

  const response: any = await useApi("PUT", "profile", {
    name: form.value.name,
    phoneNumber: form.value.phoneNumber,
    profile: {
      birthday: birthday,
      gender: form.value.profile?.gender,
      position: form.value.profile?.position,
      address: form.value.profile?.address,
    },
  });

  if (response.data) {
    await getUserInfo();
    toastData.value.status = response.status;
    toastData.value.message = "Profile edit completed successfully.";
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
