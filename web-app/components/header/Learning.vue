<template>
  <div
    class="my-learning__top d-flex flex-wrap gap-20px justify-content-between pt-15px pb-15px pe-30px ps-30px"
    style="z-index: 9999"
  >
    <router-link
      to="/courses/1"
      class="my-learning__top_return d-flex align-items-center gap-20px transition-all"
    >
      <div class="my-learning__top_icon transition-all">
        <i class="iconify fs-26" data-icon="basil:arrow-left-outline"></i>
      </div>
      <h5 class="fw-bolder transition-all">
        {{ title }}
      </h5>
    </router-link>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
