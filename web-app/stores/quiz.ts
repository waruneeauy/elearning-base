import { defineStore } from "pinia";

export const useQuizStore = defineStore(
  "quiz",
  () => {
    const setNo = ref<string>("");
    const learnerCodeId = ref<string>("");
    const selectedCourse = ref<string>("");
    const startTime = ref<number | null>(0);
    const userSectionId = ref<string>(""); // สำหรับส่งไปยัง API อัปโหลดถ่ายรูป

    const setSetNo = (_setNo: string, _learnerCodeId: string) => {
      setNo.value = _setNo;
      learnerCodeId.value = _learnerCodeId;
    };

    const setSelectedCourse = (_selectedCourse: string) => {
      selectedCourse.value = _selectedCourse;
    };

    const resetSelectedCourse = () => {
      selectedCourse.value = "";
    };

    const resetSetNo = () => {
      setNo.value = "";
      learnerCodeId.value = "";
    };

    const setStartTime = (_startTime: number) => {
      startTime.value = _startTime;
    };

    const resetStartTime = () => {
      startTime.value = null;
    };

    const setUserSectionId = (val: string) => {
      userSectionId.value = val;
    };

    return {
      setNo,
      learnerCodeId,
      selectedCourse,
      setSelectedCourse,
      resetSelectedCourse,
      setSetNo,
      resetSetNo,
      startTime,
      setStartTime,
      resetStartTime,
      userSectionId,
      setUserSectionId,
    };
  },
  { persist: true }
);
