<template>
  <div v-if="!loading">
    <home-banner />
    <div style="height: 500px"></div>
    <!-- <home-partner />
    <home-popular :courses />
    <home-out-standing />
    <home-release :courses />
    <home-eduma-courses />
    <home-learn-press /> -->
  </div>
</template>

<script setup lang="ts">
const { useApi } = useApis();
const { toastData, toggleToast } = useConfigsStores();
const { setAccessToken, getUserInfo } = useUserStores();

onMounted(async () => {
  fetchItems();

  // Check Email already exists
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const error: string = urlParams.get("error") as string;
  if (token || error) {
    if (token) {
      setAccessToken(token);
      await getUserInfo();
      toastData.value.status = "success";
      toastData.value.message = "Login successfully";
      toggleToast();
    } else if (error) {
      toastData.value.status = "fail";
      toastData.value.message = "Email already exists!";
      toggleToast();
    }
  }
});

const loading = ref(true);
const courses = ref();
const fetchItems = async () => {
  const response: any = await useApi("GET", "course");

  if (response.data) {
    courses.value = response.data;
    loading.value = false;
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    toggleToast();
    loading.value = false;
  }
};
</script>
