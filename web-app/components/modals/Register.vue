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
              <h5 class="fw-bolder mb-30px">Register a new account</h5>
              <form @submit.prevent="onSubmit()">
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
                <input
                  v-model="form.name"
                  type="name"
                  name="name"
                  placeholder="Full Name"
                  required
                />
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
                <input
                  v-model="form.confirm_password"
                  type="password"
                  name="confirm_password"
                  placeholder="Confirm Password"
                  required
                />
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  pattern="^[0-9]{10}$"
                  title="Please enter a valid 10-digit phone number"
                />
                <input
                  v-if="!submitting"
                  type="submit"
                  value="Register"
                  class="form-register__submit transition-all"
                />
                <div v-else class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </form>

              <!-- Login with Social Buttons -->
              <!-- <div class="social-login mt-20px">
                <p class="mb-3">Or Register with</p>
                <div class="d-flex justify-content-center gap-15px mt-10px">
                  Google Login Button
                  <button
                    @click="auth('google')"
                    class="btn-google d-flex align-items-center gap-10px transition-all"
                  >
                    <i class="fa-solid fa-envelope"></i>
                    Login with Google
                  </button>

                  Facebook Login Button
                  <button
                    @click="auth('facebook')"
                    class="btn-facebook d-flex align-items-center gap-10px transition-all"
                  >
                    <i class="fa-brands fa-facebook"></i>
                    Login with Facebook
                  </button>
                </div>
              </div> -->

              <div
                class="d-flex align-items-center justify-content-center gap-10px mt-20px"
              >
                <p>Are you a member?</p>
                <a
                  @click="handleLogin()"
                  href="#"
                  class="form-register__register transition-all handle-login"
                  >Login now</a
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
const emit = defineEmits(["login"]);
function handleLogin() {
  emit("login");
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

// About Sign up
import { useAuth } from "~/api/useAuth";
import type { RegisterRequest } from "~/types/request/main";

const config = useRuntimeConfig();
const { setAccessToken, getUserInfo } = useUserStores();
const { toastData, toggleToast } = useConfigsStores();

onMounted(() => {});

const isShowPassword = ref<boolean>(false);
const isShowConfirmPassword = ref<boolean>(false);
const submitting = ref<boolean>(false);

const acceptAgreement = ref<boolean>(false);
const form = reactive<RegisterRequest>({
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  phoneNumber: "",
});

const rules: any = {
  required: (val: string | any[]) =>
    (val && val.length > 0) || "Please fill out this field",
  email: (value: string) => /.+@.+\..+/.test(value) || "Email must be valid.",
};

async function onSubmit(): Promise<void> {
  submitting.value = true;

  if (form.password !== form.confirm_password) {
    toastData.value.status = "fail";
    toastData.value.message = "Password and Confirm Password do not match!";
    toggleToast();
    submitting.value = false;
    return;
  }
  const { confirm_password, ...body } = form;

  const response: any = await useAuth(body, "signup");

  if (response.data) {
    setAccessToken(response.data.result);
    await getUserInfo();
    closeIfOutside();
    submitting.value = false;
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;

    form.password = "";
    form.confirm_password = "";
    submitting.value = false;
  }
}

function auth(provider: string) {
  console.log(provider);
  if (provider === "google") {
    window.location.href = `${config.public.AUTHEN_URL}/google`;
  } else {
    window.location.href = `${config.public.AUTHEN_URL}/facebook`;
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

/* Social Login Button Styles */
.btn-google {
  background-color: #db4437;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-facebook {
  background-color: #1877f2;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-google:hover,
.btn-facebook:hover {
  opacity: 0.9;
}
</style>
