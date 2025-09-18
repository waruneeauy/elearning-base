import { defineStore } from "pinia";

export const useConfigsStore = defineStore(
  "configs",
  () => {
    const fontSize = ref<string>("md");
    const volume = ref<number>(50);

    const toastShow = ref<boolean>(false);
    const toastData = ref<any>({
      title: "",
      subTitle: "",
      status: "error",
    });

    const setfontSize = (size: string) => {
      fontSize.value = size;
    };

    const setVolume = (vol: number) => {
      volume.value = vol;
    };

    function toggleToast(title?: string): void {
      if (!toastShow.value) {
        if (title !== undefined) {
          toastData.value!.title = title;
          toastData.value!.subTitle = "";
          toastData.value!.status = "error";
        }
        toastShow.value = true;
      }
    }
    function closeToast(): void {
      toastShow.value = false;
    }

    return {
      fontSize,
      volume,
      setfontSize,
      setVolume,
      toastShow,
      toastData,
      toggleToast,
      closeToast,
    };
  },
  { persist: true }
);
