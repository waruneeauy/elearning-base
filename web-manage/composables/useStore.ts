import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

export const useUserStores = () => {
  const { accessToken, setAccessToken, resetAccessToken } = useAuthStore();
  const { userInfo, getUserInfo, resetUserInfo, getRooms } = useUserStore();
  const configsRef = useUserStore();

  return {
    accessToken,
    setAccessToken,
    resetAccessToken,
    userInfo,
    getUserInfo,
    resetUserInfo,
    getRooms,
    configsRef,
    storeToRefs,
  };
};
