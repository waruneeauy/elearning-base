import { defineStore } from "pinia";
import type { ProfileResponse } from "~/types/response/main";

export const useUserStore = defineStore(
  "user",
  () => {
    const { useApi } = useApis();
    // const $q = useQuasar();

    const userInfo = ref<ProfileResponse>();

    async function getUserInfo(): Promise<void> {
      const response: any = await useApi("GET", "profile");

      if (response.data) {
        userInfo.value = response.data;
      }
    }

    function resetUserInfo(): void {
      userInfo.value = undefined;
    }

    return { userInfo, getUserInfo, resetUserInfo };
  },
  { persist: true }
);
