import { defineStore } from "pinia";

export const useAuthStore = defineStore(
  "manageauth",
  () => {
    const accessToken = ref<string>();

    function setAccessToken(access_token: string): void {
      accessToken.value = access_token;
    }
    function resetAccessToken(): void {
      accessToken.value = undefined;
    }

    return {
      accessToken,
      setAccessToken,
      resetAccessToken,
    };
  },
  { persist: true }
);
