<template>
  <div
    class="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-[#CCCCCC]/100 p-5 flex flex-col justify-center"
  >
    <q-img
      src="/images/logo.png"
      alt="logo"
      class="max-w-[100px] mx-auto mb-4"
    />
    <div class="align-center mb-4">
      <h1
        class="text-4xl font-bold text-center text-primary mb-2 text-uppercase"
      >
        E-Learning Management
      </h1>
      <!-- <h5 class="text-center">MANAGEMENT</h5> -->
    </div>

    <div class="flex justify-center items-center mt-4">
      <q-card class="max-w-md w-full p-6 rounded-2xl bg-white">
        <q-form @submit.prevent="onSubmit" class="q-gutter-y-xs login-form">
          <p class="ml-1">Username</p>
          <q-input
            class="q-pb-xs overflow-hidden"
            outlined
            rounded
            dense
            bg-color="white"
            v-model="form.email"
            :rules="[rules.required]"
            :disable="submitting"
          />
          <p class="ml-1">Password</p>
          <q-input
            class="q-pb-xs overflow-hidden mb-5"
            outlined
            rounded
            dense
            bg-color="white"
            bottom-slots
            v-model="form.password"
            :type="isShowPassword ? 'text' : 'password'"
            :rules="[rules.required]"
            :disable="submitting"
          >
            <template #append>
              <q-icon
                :name="isShowPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isShowPassword = !isShowPassword"
              />
            </template>
          </q-input>

          <q-btn
            rounded
            label="Login"
            type="submit"
            color="accent"
            class="full-width"
            :disable="submitting"
            :loading="submitting"
          />
        </q-form>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// API
import { useAuth } from "~/api/useAuth";
// TYPE
import type { LoginRequest } from "~/types/request/main";

definePageMeta({
  layout: "blank",
});

const $q = useQuasar();
const { setAccessToken, resetAccessToken, getUserInfo, resetUserInfo } =
  useUserStores();

const isShowPassword = ref<boolean>(false);
const submitting = ref<boolean>(false);
const route = useRoute();

const form = reactive<LoginRequest>({
  email: "",
  password: "",
});

const rules: any = {
  required: (val: string | any[]) =>
    (val && val.length > 0) || "Please fill out this field",
};

async function onSubmit(): Promise<void> {
  submitting.value = true;
  const response = await useAuth(form.email, form.password);
  if (response.data) {
    await setAccessToken(response.data);
    await getUserInfo();
    navigateTo("/");
  } else {
    $q.notify({
      message: response.error,
      color: "negative",
      position: "top",
      actions: [
        {
          label: "Close",
          color: "white",
          handler: () => undefined,
        },
      ],
    });
    form.password = "";
    submitting.value = false;
  }
}

onMounted(() => {
  $q.loading.hide();
  resetAccessToken();
  resetUserInfo();
});
</script>
