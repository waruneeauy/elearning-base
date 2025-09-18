<script setup lang="ts">
const { closeToast } = useConfigsStores();

onMounted(() => {
  closeToast();
});
</script>

<template>
  <toast />
  <nuxt-layout>
    <nuxt-page />
  </nuxt-layout>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.3;
  filter: blur(2rem);
}
</style>
