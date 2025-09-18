import { defineStore } from "pinia";

export const useQuestionStore = defineStore(
  "managequestion",
  () => {
    const courseId = ref<string>("");
    const setNoOrg = ref<string>("");
    const sectionTypes = ref<string[]>([]);
    const sectionOptionTypes = ref<string[]>([]);

    const templateOptions = ref<string[]>([]);

    const choiceIndex = ref<string[]>([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
    ]);

    return {
      sectionTypes,
      sectionOptionTypes,
      templateOptions,
      choiceIndex,
      courseId,
      setNoOrg,
    };
  },
  { persist: true }
);
