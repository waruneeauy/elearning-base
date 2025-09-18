<template>
  <div class="min-h-screen bg-primary flex justify-center items-center p-5" />
</template>

<script setup lang="ts">
import { QSpinnerHourglass } from "quasar";

const { userInfo, getUserInfo } = useUserStore();

definePageMeta({
  layout: "blank",
});

const $q = useQuasar();
const route = useRoute();

const { getRooms } = useUserStore();

const timeoutId = ref<any>();

async function fetchData() {
  timeoutId.value = setTimeout(async () => {
    const currentStepNo = await userInfo?.room.step_no;
    const currentSubStepNo = await userInfo?.room.sub_step_no;

    const data = await getRooms();
    if (
      currentStepNo != data?.step_no ||
      currentSubStepNo != data?.sub_step_no
    ) {
      if (currentStepNo == 1 && data?.step_no == 2) {
        navigateTo("/study");
      } else if (
        (currentStepNo == 2 &&
          currentSubStepNo == 3 &&
          data?.step_no == 3 &&
          data?.sub_step_no == 0) ||
        (currentStepNo == 2 &&
          currentSubStepNo == 3 &&
          data?.step_no == 3 &&
          data?.sub_step_no == 0) ||
        (currentStepNo == 3 &&
          currentSubStepNo == 3 &&
          data?.step_no == 4 &&
          data?.sub_step_no == 0) ||
        (currentStepNo == 2 &&
          currentSubStepNo == 1 &&
          data?.step_no == 2 &&
          data?.sub_step_no == 2) ||
        (currentStepNo == 3 &&
          currentSubStepNo == 1 &&
          data?.step_no == 3 &&
          data?.sub_step_no == 2) ||
        (currentStepNo == 4 &&
          currentSubStepNo == 1 &&
          data?.step_no == 4 &&
          data?.sub_step_no == 2)
      ) {
        navigateTo("/study");
      } else if (
        (currentStepNo == 2 &&
          currentSubStepNo == 0 &&
          data?.step_no == 2 &&
          data?.sub_step_no == 1) ||
        (currentStepNo == 3 &&
          currentSubStepNo == 0 &&
          data?.step_no == 3 &&
          data?.sub_step_no == 1) ||
        (currentStepNo == 4 &&
          currentSubStepNo == 0 &&
          data?.step_no == 4 &&
          data?.sub_step_no == 1) ||
        (currentStepNo == 2 &&
          currentSubStepNo == 2 &&
          data?.step_no == 2 &&
          data?.sub_step_no == 3) ||
        (currentStepNo == 3 &&
          currentSubStepNo == 2 &&
          data?.step_no == 3 &&
          data?.sub_step_no == 3) ||
        (currentStepNo == 4 &&
          currentSubStepNo == 2 &&
          data?.step_no == 4 &&
          data?.sub_step_no == 3)
      ) {
        await getUserInfo();
        navigateTo("/result");
      } else if (
        (currentStepNo == 4 && data?.step_no == 5 && data?.sub_step_no == 0) ||
        (currentStepNo == 5 && data?.step_no == 6 && data?.sub_step_no == 0) ||
        (currentStepNo == 6 && data?.step_no == 7 && data?.sub_step_no == 0) ||
        (currentStepNo == 7 && data?.step_no == 8 && data?.sub_step_no == 0) ||
        (currentStepNo == 8 && data?.step_no == 9 && data?.sub_step_no == 0)
      ) {
        navigateTo({
          path: "/study",
          query: {
            age: route.query.age,
          },
        });
      } else if (
        (currentStepNo == 5 &&
          currentSubStepNo == 0 &&
          data?.step_no == 5 &&
          data?.sub_step_no == 1) ||
        (currentStepNo == 6 &&
          currentSubStepNo == 0 &&
          data?.step_no == 6 &&
          data?.sub_step_no == 1) ||
        (currentStepNo == 7 &&
          currentSubStepNo == 0 &&
          data?.step_no == 7 &&
          data?.sub_step_no == 1) ||
        (currentStepNo == 8 &&
          currentSubStepNo == 0 &&
          data?.step_no == 8 &&
          data?.sub_step_no == 1) ||
        (currentStepNo == 9 &&
          currentSubStepNo == 0 &&
          data?.step_no == 9 &&
          data?.sub_step_no == 1)
      ) {
        navigateTo({
          path: "/study/work/manage-saving",
          query: {
            age: route.query.age,
          },
        });
      } else if (
        (currentStepNo == 6 &&
          currentSubStepNo == 1 &&
          data?.step_no == 6 &&
          data?.sub_step_no == 2) ||
        (currentStepNo == 7 &&
          currentSubStepNo == 1 &&
          data?.step_no == 7 &&
          data?.sub_step_no == 2) ||
        (currentStepNo == 8 &&
          currentSubStepNo == 1 &&
          data?.step_no == 8 &&
          data?.sub_step_no == 2) ||
        (currentStepNo == 9 &&
          currentSubStepNo == 1 &&
          data?.step_no == 9 &&
          data?.sub_step_no == 2)
      ) {
        navigateTo({
          path: "/study/work/event",
          query: {
            age: route.query.age,
          },
        });
      } else if (
        (currentStepNo == 5 &&
          currentSubStepNo == 1 &&
          data?.step_no == 5 &&
          data?.sub_step_no == 3) ||
        (currentStepNo == 6 &&
          currentSubStepNo == 2 &&
          data?.step_no == 6 &&
          data?.sub_step_no == 3) ||
        (currentStepNo == 7 &&
          currentSubStepNo == 2 &&
          data?.step_no == 7 &&
          data?.sub_step_no == 3) ||
        (currentStepNo == 8 &&
          currentSubStepNo == 2 &&
          data?.step_no == 8 &&
          data?.sub_step_no == 3) ||
        (currentStepNo == 9 &&
          currentSubStepNo == 2 &&
          data?.step_no == 9 &&
          data?.sub_step_no == 3)
      ) {
        navigateTo({
          path: "/study/work/manage-invest",
          query: {
            age: route.query.age,
          },
        });
      } else if (
        (currentStepNo == 5 &&
          currentSubStepNo == 3 &&
          data?.step_no == 5 &&
          data?.sub_step_no == 4) ||
        (currentStepNo == 6 &&
          currentSubStepNo == 3 &&
          data?.step_no == 6 &&
          data?.sub_step_no == 4) ||
        (currentStepNo == 7 &&
          currentSubStepNo == 3 &&
          data?.step_no == 7 &&
          data?.sub_step_no == 4) ||
        (currentStepNo == 8 &&
          currentSubStepNo == 3 &&
          data?.step_no == 8 &&
          data?.sub_step_no == 4) ||
        (currentStepNo == 9 &&
          currentSubStepNo == 3 &&
          data?.step_no == 9 &&
          data?.sub_step_no == 4)
      ) {
        await getUserInfo();
        navigateTo({
          path: "/result/work",
          query: {
            age: route.query.age,
          },
        });
      }
    }

    // switch (route.query.target) {
    //   case "study":
    //     if (!route.query.name && !route.query.type && !route.query.age) {
    //       // step list มาจากหน้า introlduction
    //       if (data?.step_no! >= 2) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       route.query.name === "middle" &&
    //       route.query.type === "normal"
    //     ) {
    //       // step list มัธยมศึกษาตอนต้น เปิดเทอม
    //       if (data?.step_no! >= 2 && data?.sub_step_no! >= 2) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       route.query.name === "middle" &&
    //       route.query.type === "close"
    //     ) {
    //       // step list มัธยมศึกษาตอนต้น ปิดเทอม
    //       if (data?.step_no! >= 3 && data?.sub_step_no! >= 0) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.name === "high" && route.query.type === "normal") {
    //       // step list มัธยมศึกษาตอนปลาย เปิดเทอม
    //       if (data?.step_no! >= 3 && data?.sub_step_no! >= 2) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.name === "high" && route.query.type === "close") {
    //       // step list มัธยมศึกษาตอนปลาย ปิดเทอม
    //       if (data?.step_no! >= 4 && data?.sub_step_no! >= 0) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       route.query.name === "university" &&
    //       route.query.type === "normal"
    //     ) {
    //       // step list มหาวิทยาลัย เปิดเทอม
    //       if (data?.step_no! >= 4 && data?.sub_step_no! >= 2) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       route.query.name === "university" &&
    //       route.query.type === "close"
    //     ) {
    //       // step list มหาวิทยาลัย ปิดเทอม
    //       if (data?.step_no! >= 5 && data?.sub_step_no! >= 0) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "23to26") {
    //       // step list วัยทำงาน (อายุ 23-26 ปี)
    //       if (data?.step_no! >= 6 && data?.sub_step_no! >= 0) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "27to30") {
    //       // step list วัยทำงาน (อายุ 27-30 ปี)
    //       if (data?.step_no! >= 7 && data?.sub_step_no! >= 0) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "31to40") {
    //       // step list วัยทำงาน (อายุ 31-40 ปี)
    //       if (data?.step_no! >= 8 && data?.sub_step_no! >= 0) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "41to50") {
    //       // step list วัยทำงาน (อายุ 41-50 ปี)
    //       if (data?.step_no! >= 9 && data?.sub_step_no! >= 0) {
    //         navigateTo("/study");
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "51to60") {
    //       // step list วัยทำงาน (อายุ 51-60 ปี)
    //       navigateTo("/study");
    //     } else {
    //       $q.loading.hide();
    //       navigateTo("/");
    //     }
    //     break;
    //   case "result":
    //     if (route.query.name === "middle" && route.query.type === "normal") {
    //       // result มัธยมศึกษาตอนต้น เปิดเทอม
    //       if (data?.step_no! >= 2 && data?.sub_step_no! >= 1) {
    //         navigateTo({
    //           path: "/result",
    //           query: {
    //             name: route.query.name,
    //             type: route.query.type,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       // result มัธยมศึกษาตอนต้น ปิดเทอม
    //       route.query.name === "middle" &&
    //       route.query.type === "close"
    //     ) {
    //       if (data?.step_no! >= 2 && data?.sub_step_no! >= 3) {
    //         navigateTo({
    //           path: "/result",
    //           query: {
    //             name: route.query.name,
    //             type: route.query.type,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       // result มัธยมศึกษาตอนปลาย เปิดเทอม
    //       route.query.name === "high" &&
    //       route.query.type === "normal"
    //     ) {
    //       if (data?.step_no! >= 3 && data?.sub_step_no! >= 1) {
    //         navigateTo({
    //           path: "/result",
    //           query: {
    //             name: route.query.name,
    //             type: route.query.type,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       // result มัธยมศึกษาตอนปลาย ปิดเทอม
    //       route.query.name === "high" &&
    //       route.query.type === "close"
    //     ) {
    //       if (data?.step_no! >= 3 && data?.sub_step_no! >= 3) {
    //         navigateTo({
    //           path: "/result",
    //           query: {
    //             name: route.query.name,
    //             type: route.query.type,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       // result มหาวิทยาลัย เปิดเทอม
    //       route.query.name === "university" &&
    //       route.query.type === "normal"
    //     ) {
    //       if (data?.step_no! >= 4 && data?.sub_step_no! >= 1) {
    //         navigateTo({
    //           path: "/result",
    //           query: {
    //             name: route.query.name,
    //             type: route.query.type,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (
    //       // result มหาวิทยาลัย ปิดเทอม
    //       route.query.name === "university" &&
    //       route.query.type === "close"
    //     ) {
    //       if (data?.step_no! >= 4 && data?.sub_step_no! >= 3) {
    //         navigateTo({
    //           path: "/result",
    //           query: {
    //             name: route.query.name,
    //             type: route.query.type,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else {
    //       $q.loading.hide();
    //       navigateTo("/");
    //     }
    //     break;
    //   case "study/work/manage-saving":
    //     if (route.query.age === "23to26") {
    //       // manage-saving วัยทำงาน (อายุ 23-26 ปี)
    //       if (data?.step_no! >= 5 && data?.sub_step_no! >= 1) {
    //         navigateTo({
    //           path: "/study/work/manage-saving",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "27to30") {
    //       // manage-saving วัยทำงาน (อายุ 27-30 ปี)
    //       if (data?.step_no! >= 6 && data?.sub_step_no! >= 1) {
    //         navigateTo({
    //           path: "/study/work/manage-saving",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "31to40") {
    //       // manage-saving วัยทำงาน (อายุ 31-40 ปี)
    //       if (data?.step_no! >= 7 && data?.sub_step_no! >= 1) {
    //         navigateTo({
    //           path: "/study/work/manage-saving",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "41to50") {
    //       // manage-saving วัยทำงาน (อายุ 41-50 ปี)
    //       if (data?.step_no! >= 8 && data?.sub_step_no! >= 1) {
    //         navigateTo({
    //           path: "/study/work/manage-saving",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "51to60") {
    //       // manage-saving วัยทำงาน (อายุ 51-60 ปี)
    //       if (data?.step_no! >= 9 && data?.sub_step_no! >= 1) {
    //         navigateTo({
    //           path: "/study/work/manage-saving",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else {
    //       $q.loading.hide();
    //       navigateTo("/");
    //     }
    //     break;
    //   case "study/work/event":
    //     if (route.query.age === "27to30") {
    //       // manage-invest วัยทำงาน (อายุ 27-30 ปี)
    //       if (data?.step_no! >= 6 && data?.sub_step_no! >= 2) {
    //         navigateTo({
    //           path: "/study/work/event",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "31to40") {
    //       // manage-invest วัยทำงาน (อายุ 31-40 ปี)
    //       if (data?.step_no! >= 7 && data?.sub_step_no! >= 2) {
    //         navigateTo({
    //           path: "/study/work/event",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "41to50") {
    //       // manage-invest วัยทำงาน (อายุ 41-50 ปี)
    //       if (data?.step_no! >= 8 && data?.sub_step_no! >= 2) {
    //         navigateTo({
    //           path: "/study/work/event",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "51to60") {
    //       // manage-invest วัยทำงาน (อายุ 51-60 ปี)
    //       if (data?.step_no! >= 9 && data?.sub_step_no! >= 2) {
    //         navigateTo({
    //           path: "/study/work/event",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else {
    //       $q.loading.hide();
    //       navigateTo("/");
    //     }
    //     break;
    //   case "study/work/manage-invest":
    //     if (route.query.age === "23to26") {
    //       // manage-invest วัยทำงาน (อายุ 23-26 ปี)
    //       if (data?.step_no! >= 5 && data?.sub_step_no! >= 3) {
    //         navigateTo({
    //           path: "/study/work/manage-invest",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "27to30") {
    //       // manage-invest วัยทำงาน (อายุ 27-30 ปี)
    //       if (data?.step_no! >= 6 && data?.sub_step_no! >= 3) {
    //         navigateTo({
    //           path: "/study/work/manage-invest",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "31to40") {
    //       // manage-invest วัยทำงาน (อายุ 31-40 ปี)
    //       if (data?.step_no! >= 7 && data?.sub_step_no! >= 3) {
    //         navigateTo({
    //           path: "/study/work/manage-invest",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "41to50") {
    //       // manage-invest วัยทำงาน (อายุ 41-50 ปี)
    //       if (data?.step_no! >= 8 && data?.sub_step_no! >= 3) {
    //         navigateTo({
    //           path: "/study/work/manage-invest",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "51to60") {
    //       // manage-invest วัยทำงาน (อายุ 51-60 ปี)
    //       if (data?.step_no! >= 9 && data?.sub_step_no! >= 3) {
    //         navigateTo({
    //           path: "/study/work/manage-invest",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else {
    //       $q.loading.hide();
    //       navigateTo("/");
    //     }
    //     break;
    //   case "result/work":
    //     if (route.query.age === "23to26") {
    //       // result วัยทำงาน (อายุ 23-26 ปี)
    //       if (data?.step_no! >= 5 && data?.sub_step_no! >= 4) {
    //         navigateTo({
    //           path: "/result/work",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "27to30") {
    //       // result วัยทำงาน (อายุ 27-30 ปี)
    //       if (data?.step_no! >= 6 && data?.sub_step_no! >= 4) {
    //         navigateTo({
    //           path: "/result/work",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "31to40") {
    //       // result วัยทำงาน (อายุ 31-40 ปี)
    //       if (data?.step_no! >= 7 && data?.sub_step_no! >= 4) {
    //         navigateTo({
    //           path: "/result/work",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "41to50") {
    //       // result วัยทำงาน (อายุ 41-50 ปี)
    //       if (data?.step_no! >= 8 && data?.sub_step_no! >= 4) {
    //         navigateTo({
    //           path: "/result/work",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else if (route.query.age === "51to60") {
    //       // result วัยทำงาน (อายุ 51-60 ปี)
    //       if (data?.step_no! >= 9 && data?.sub_step_no! >= 4) {
    //         navigateTo({
    //           path: "/result/work",
    //           query: {
    //             age: route.query.age,
    //           },
    //         });
    //       } else {
    //         timeoutId.value = setTimeout(() => {
    //           fetchData();
    //         }, 5000);
    //       }
    //     } else {
    //       $q.loading.hide();
    //       navigateTo("/");
    //     }
    //     break;
    //   default:
    //     $q.loading.hide();
    //     navigateTo("/");
    //     break;
    // }
    fetchData();
    getUserInfo();
  }, 5000);
}

$q.loading.show({
  message: "Waiting...",
  backgroundColor: "transparent",
  spinner: QSpinnerHourglass,
});

onMounted(() => {
  console.log("target==>", route.query.target);

  if (route.query.target) {
    fetchData();
  } else {
    navigateTo("/");
    $q.loading.hide();
  }
});

onBeforeUnmount(() => {
  clearTimeout(timeoutId.value);
});
</script>
