<template>
  <div class="mkp-layout">
    <header-head-navbar />
    <header-navbar @login="handleLogin()" @logout="handleLogout()" />

    <!-- <div class="flex flex-col min-h-screen max-w-screen-lg mx-auto shadow-xl"> -->
    <slot />
    <!-- </div> -->
    <scroll-page />

    <!-- <footer-contact-us /> -->
    <footer-copyright />

    <modals-login ref="modalLogin" @register="handleRegister()" />
    <modals-register ref="modalRegister" @login="handleLogin()" />
    <modals-confirm
      ref="modalLogout"
      label="Log Out"
      sub-label="Are you sure you want to log out?"
      @confirm="handleConfirmLogout()"
    />
  </div>
</template>
<script setup lang="ts">
const { resetAccessToken, resetUserInfo } = useUserStores();
const { toastData, toggleToast } = useConfigsStores();
const router = useRouter();

const modalLogin = ref<any>(null);
const modalRegister = ref<any>(null);
const modalLogout = ref<any>(null);

const handleLogin = () => {
  modalRegister.value.hide();
  modalLogin.value.show();
};

const handleRegister = () => {
  modalLogin.value.hide();
  modalRegister.value.show();
};

const handleLogout = () => {
  modalLogout.value.show();
};

const handleConfirmLogout = () => {
  resetAccessToken();
  resetUserInfo();
  toastData.value.status = "success";
  toastData.value.message = "Logged out!";
  toggleToast();
  router.push("/");
};
</script>
