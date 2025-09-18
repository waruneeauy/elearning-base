import { defineStore } from "pinia";

export const useBannerStore = defineStore(
  "managebanner",
  () => {
    const bannerType = ref<string>("ALL TEST");

    return {
      bannerType,
    };
  },
  { persist: true }
);
