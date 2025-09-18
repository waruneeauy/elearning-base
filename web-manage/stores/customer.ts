import { defineStore } from "pinia";

export const useCustomerStore = defineStore(
  "managecustomer",
  () => {
    const courseId = ref<string>("");
    const statusUsed = ref<boolean | null>(null);

    return {
      courseId,
      statusUsed,
    };
  },
  { persist: true }
);
