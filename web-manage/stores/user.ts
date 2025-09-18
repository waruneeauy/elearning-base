import { defineStore } from "pinia";
import type { AccountResponse, RoomResponse } from "~/types/response/main";

export const useUserStore = defineStore(
  "manageuser",
  () => {
    const { useApi } = useApis();
    const $q = useQuasar();

    const userInfo = ref<AccountResponse>();

    async function getUserInfo(): Promise<void> {
      const response: any = await useApi("GET", "/profile");
      if (response.data) {
        userInfo.value = response.data;
      }
      return;
    }

    function resetUserInfo(): void {
      userInfo.value = undefined;
    }

    async function getRooms(): Promise<RoomResponse | null> {
      const response: any = await useApi("GET", "rooms");
      if (response.data) {
        return response.data;
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
        return null;
      }
    }

    return { userInfo, getUserInfo, resetUserInfo, getRooms };
  },
  { persist: true }
);
