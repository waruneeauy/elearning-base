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
            <div class="form-login__wrapper p-50px pb-80px text-center">
              <div class="close-button" @click="closeIfOutside">
                <i class="fa-solid fa-xmark"></i>
              </div>
              <h5 class="fw-bolder mb-30px">Login with your site account</h5>
              <form @submit.prevent="onSubmit()">
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
                <div class="password-container">
                  <input
                    v-model="form.password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                  />
                  <span id="pw-show-hide" class="pw-show-hide">
                    <i
                      class="iconify fs-18 eye-on"
                      data-icon="fa-solid:eye"
                    ></i>
                    <i
                      class="iconify fs-20 eye-off"
                      data-icon="ion:eye-off"
                    ></i>
                  </span>
                </div>
                <!-- <div
                  class="form-login__remember d-flex align-items-center justify-content-between"
                >
                  <label
                    class="d-flex align-items-center gap-5px cursor-pointer"
                  >
                    <input type="checkbox" name="remember_me" /> Remember Me
                  </label>
                  <a href="#" class="form-login__lost transition-all"
                    >Lost your password?</a
                  >
                </div> -->
                <input
                  v-if="!submitting"
                  type="submit"
                  value="Login"
                  class="form-login__submit transition-all"
                />
                <div v-else class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </form>

              <!-- Login with Social Buttons -->
              <!-- <div class="social-login mt-20px">
                <p class="mb-3">Or login with</p>
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
                <p>Not a member yet?</p>
                <a
                  @click="handleRegister()"
                  href="#"
                  class="form-login__register transition-all handle-register"
                  >Register now</a
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
import { useAuth } from "~/api/useAuth";
import type { LoginRequest } from "~/types/request/main";
const config = useRuntimeConfig();
const { setAccessToken, resetAccessToken, getUserInfo, resetUserInfo } =
  useUserStores();

const emit = defineEmits(["register"]);
function handleRegister() {
  emit("register");
}

const isShow = ref<boolean>(false);

async function show(): Promise<void> {
  resetAccessToken();
  resetUserInfo();

  form = { email: "", password: "" };
  isShow.value = true;
}
function hide(): void {
  isShow.value = false;
}

function closeIfOutside(): void {
  hide();
}

defineExpose({ show, hide });

const isShowPassword = ref<boolean>(false);
const submitting = ref<boolean>(false);

let form = reactive<LoginRequest>({
  email: "",
  password: "",
});

async function onSubmit(): Promise<void> {
  submitting.value = true;
  const body = reactive<LoginRequest>({
    email: form.email,
    password: form.password,
  });
  const response: any = await useAuth(body, "signin");
  if (response.data) {
    setAccessToken(response.data.result);
    await getUserInfo();
    closeIfOutside();
    window.location.reload();
    submitting.value = false;
  } else {
    form.password = "";
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
