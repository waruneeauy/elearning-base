import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { useConfigsStore } from "@/stores/configs";
import { useQuizStore } from "@/stores/quiz";

export const useUserStores = () => {
  const { accessToken, setAccessToken, resetAccessToken } = useAuthStore();
  const { getUserInfo, resetUserInfo } = useUserStore();
  const configsRef = useUserStore();

  return {
    accessToken,
    setAccessToken,
    resetAccessToken,
    userInfo: computed(() => configsRef.userInfo),
    getUserInfo,
    resetUserInfo,
    configsRef,
    storeToRefs,
  };
};

export const useConfigsStores = () => {
  const configsStore = useConfigsStore();

  return {
    fontSize: computed(() => configsStore.fontSize),
    volume: computed(() => configsStore.volume),
    setfontSize: configsStore.setfontSize,
    setVolume: configsStore.setVolume,
    toastShow: computed(() => configsStore.toastShow),
    toastData: computed(() => configsStore.toastData),
    toggleToast: configsStore.toggleToast,
    closeToast: configsStore.closeToast,
  };
};

export const useQuizStores = () => {
  const quizStore = useQuizStore();

  return {
    setNo: computed(() => quizStore.setNo),
    learnerCodeId: computed(() => quizStore.learnerCodeId),
    selectedCourse: computed(() => quizStore.selectedCourse),
    setSelectedCourse: quizStore.setSelectedCourse,
    resetSelectedCourse: quizStore.resetSelectedCourse,
    setSetNo: quizStore.setSetNo,
    resetSetNo: quizStore.resetSetNo,
    startTime: computed(() => quizStore.startTime),
    setStartTime: quizStore.setStartTime,
    resetStartTime: quizStore.resetStartTime,
    userSectionId: quizStore.userSectionId,
    setUserSectionId: quizStore.setUserSectionId,
  };
};
