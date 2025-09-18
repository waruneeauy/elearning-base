<template>
  <section class="mkp-banner pt-40px pb-80px">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-7 mb-30px mb-md-0">
          <div class="mkp-banner__left text-center text-md-start pe-20px">
            <h1 class="fw-bolder mb-15px wow fadeInUp" data-wow-duration="1.5s">
              ระบบฝึกอบรมออนไลน์
              <span class="hl-style">HRMS</span>
            </h1>
            <p class="mb-25px wow fadeInUp" data-wow-duration="1.5s">
              การสอนนี้มีวัตถุประสงค์เพื่อแนะนำและอธิบายวิธีการใช้งานระบบบริหารทรัพยากรบุคคล<br />
              ของข้าราชการกรุงเทพมหานครสามัญ และบุคลากรกรุงเทพมหานคร
              (กลุ่มลูกจ้างประจำ)
            </p>
            <div
              class="mkp-banner__btn d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-30px"
            >
              <router-link
                :to="`/courses`"
                class="button button-type-01 fs-14 fw-semibold text-white text-capitalize transition-all wow fadeInLeft"
                data-wow-duration="1.5s"
                >View Courses</router-link
              >
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <div
            class="mkp-banner__right ps-35px wow fadeInRight"
            data-wow-duration="1.5s"
          >
            <img src="/images/banner.png" alt="banner" />
          </div>
        </div>
      </div>
    </div>

    <modals-login ref="modalLogin" @register="handleRegister()" />
    <modals-register ref="modalRegister" @login="handleLogin()" />
  </section>
</template>

<script setup lang="ts">
defineProps({
  course: {
    type: Object,
    default: null,
  },
});

const modalLogin = ref<any>(null);
const modalRegister = ref<any>(null);

const handleLogin = () => {
  modalRegister.value.hide();
  modalLogin.value.show();
};

const handleRegister = () => {
  modalLogin.value.hide();
  modalRegister.value.show();
};
</script>
