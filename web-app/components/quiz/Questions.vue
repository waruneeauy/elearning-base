<template>
  <div class="col-12 col-lg-6">
    <div v-if="data.description">
      <div>
        <div class="d-flex justify-content-between align-items-center">
          <p class="fw-bold mb-3">{{ data?.no }}.</p>
          <button
            class="btn btn-outline-secondary border-0"
            @click="openDialog"
          >
            <i class="fa-regular fa-image"></i>
          </button>
        </div>
        <div class="mt-3">
          <div class="border rounded overflow-hidden">
            <img
              :src="data.description"
              class="img-fluid rounded"
              @click="openDialog"
              style="cursor: pointer"
            />
          </div>
        </div>
      </div>
    </div>

    <modals-image ref="modalRef" :image="data.description" />
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

defineProps({
  data: {
    type: Object,
    default: null,
  },
  isOneTime: {
    type: Boolean,
    default: false,
  },
});

const modalRef = ref<any>(null);
const openDialog = () => {
  modalRef.value.show();
};
</script>

<style scoped>
img {
  cursor: pointer;
}
</style>
