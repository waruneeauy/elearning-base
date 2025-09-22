<template>
  <div v-if="!loading">
    <section class="title-bar pt-20px pb-20px">
      <div class="container">
        <div class="row">
          <nav class="title-bar__nav mb-30px">
            <ul class="title-bar__nav_list">
              <li class="title-bar__nav_items d-inline">
                <router-link to="/" class="title-bar__nav transition-all"
                  >Home</router-link
                >
              </li>
              <li class="title-bar__nav_items d-inline">
                <router-link
                  to="/courses"
                  class="title-bar__nav_before transition-all"
                  >Online Courses</router-link
                >
              </li>
              <li class="title-bar__nav_items d-inline">
                <a
                  class="title-bar__nav_before transition-all pointer-events-none"
                >
                  {{ course.title }}
                </a>
              </li>
            </ul>
          </nav>
          <div class="col-md-8 private-left">
            <div class="courses-details-info mb-50px">
              <h1 class="fs-36 fw-bolder mb-30px line-clamp-2">
                {{ course.title }}
              </h1>
              <span
                class="fw-semibold d-flex align-items-center gap-10px mb-10px"
              >
                <span>A course by</span>
                <a href="#">{{ course.authen }}</a>
              </span>
              <div class="fs-14 d-flex flex-wrap align-items-center gap-20px">
                <span class="d-flex align-items-center gap-5px">
                  <i
                    class="iconify fs-18"
                    data-icon="circum:view-list"
                    aria-label="Lessons icon"
                  ></i>
                  <span>{{ course.lessons }} lessons</span>
                </span>
                <span class="d-flex align-items-center gap-5px">
                  <i
                    class="iconify fs-18"
                    data-icon="solar:global-outline"
                    aria-label="Language icon"
                  ></i>
                  <span>Thai</span>
                </span>
              </div>
            </div>
          </div>

          <div class="col-md-4 private-right">
            <div class="courses-details-hollow"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="courses-details pt-40px pb-80px courses-details-for-mobile">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-8 courses-details__od2">
            <div class="courses-details__content">
              <div
                class="courses-details__tab d-flex flex-wrap align-items-center gap-40px mb-30px pb-5px"
              >
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  :class="[
                    'courses-details__tab_btn',
                    { active: activeTab === tab.id },
                  ]"
                  @click="setActiveTab(tab.id)"
                >
                  {{ tab.label }}
                </button>
              </div>
              <div v-if="activeTab === 'description'">
                <div
                  class="courses-details__what-learn border-radius-10px p-20px mb-30px"
                >
                  <h4 class="fs-20 fw-semibold mb-20px">ผลลัพธ์การเรียนรู้</h4>
                  <div class="courses-details__what-learn_box">
                    <div class="d-flex gap-10px">
                      <i
                        class="iconify fs-18 mt-5px courses-details__what-learn_icon"
                        data-icon="ph:seal-check-fill"
                      ></i>
                      <p>เข้าใจการใช้งานระบบ</p>
                    </div>
                    <div class="d-flex gap-10px">
                      <i
                        class="iconify fs-18 mt-5px courses-details__what-learn_icon"
                        data-icon="ph:seal-check-fill"
                      ></i>
                      <p>สามารถใช้งานระบบได้อย่างมีประสิทธิภาพ</p>
                    </div>
                    <div class="d-flex gap-10px">
                      <i
                        class="iconify fs-18 mt-5px courses-details__what-learn_icon"
                        data-icon="ph:seal-check-fill"
                      ></i>
                      <p>สามารถสอนการใช้งานระบบได้อย่างมีประสิทธิภาพ</p>
                    </div>
                    <div class="d-flex gap-10px">
                      <i
                        class="iconify fs-18 mt-5px courses-details__what-learn_icon"
                        data-icon="ph:seal-check-fill"
                      ></i>
                      <p>สามารถนำไปใช้งานได้</p>
                    </div>
                  </div>
                </div>
                <div class="courses-details__description">
                  <div class="course-content">รายละเอียดหลักสูตร</div>
                </div>
              </div>
              <div v-if="activeTab === 'curriculum'">
                <div class="courses-details__curriculum">
                  <ul class="curriculum-section">
                    <li
                      v-for="(curriculum, index) in curriculumList"
                      :key="index"
                      class="curriculum-section__items"
                      style="list-style: none"
                    >
                      <div
                        class="curriculum-section__header d-flex align-items-center gap-20px justify-content-between"
                      >
                        <a @click="toggleCollapse(index)">
                          <i
                            class="fa-solid cursor-pointer"
                            :class="
                              curriculum.collapsed
                                ? 'fa-chevron-up'
                                : 'fa-chevron-down'
                            "
                          ></i>
                        </a>
                        <h5
                          class="curriculum-section__header_title fs-20 fw-semibold cursor-pointer"
                        >
                          {{ curriculum.label }}
                        </h5>
                        <!-- <span
                        class="d-block fw-semibold curriculum-section__header_quantity"
                        >{{ curriculum.total }}</span
                      > -->
                      </div>
                      <transition name="collapse">
                        <ul
                          v-if="!curriculum.collapsed"
                          class="curriculum-section__content"
                        >
                          <li
                            v-for="(item, idx) in curriculum.list"
                            :key="idx"
                            class="curriculum-section__content_items d-flex flex-wrap gap-20px justify-content-between"
                          >
                            <a
                              v-if="
                                userInfo && !isLocked
                                  ? item.status !== 'LOCKED'
                                  : !item.isLock
                              "
                              @click="onClickList(item.id)"
                              class="d-flex gap-20px align-items-center cursor-pointer"
                            >
                              <i
                                class="iconify fs-20 curriculum-section__content_icon"
                                :data-icon="
                                  item.type === 'DOCUMENT'
                                    ? 'la:file-invoice'
                                    : item.type === 'VIDEO'
                                      ? 'la:video'
                                      : 'heroicons:puzzle-piece'
                                "
                              ></i>
                              <p class="curriculum-section__content_title">
                                {{ item.label }}
                              </p>
                            </a>
                            <div
                              v-else
                              class="d-flex gap-20px align-items-center"
                            >
                              <i
                                class="iconify fs-20 curriculum-section__content_icon"
                                :data-icon="
                                  item.type === 'DOCUMENT'
                                    ? 'la:file-invoice'
                                    : item.type === 'VIDEO'
                                      ? 'la:video'
                                      : 'heroicons:puzzle-piece'
                                "
                              ></i>
                              <p class="curriculum-section__content_title">
                                {{ item.label }}
                              </p>
                            </div>

                            <div class="d-flex align-items-center gap-10px">
                              <span class="fs-14">{{
                                formatMinutesToEnglish(item.duration)
                              }}</span>
                              <a
                                v-if="
                                  userInfo && !isLocked
                                    ? item.status !== 'LOCKED'
                                    : !item.isLock
                                "
                                @click="onClickList(item.id)"
                                class="cursor-pointer"
                              >
                                <i
                                  class="iconify fs-20 eye_icon"
                                  data-icon="lucide:eye"
                                ></i>
                              </a>
                              <div v-else>
                                <i
                                  class="iconify fs-20 lock_icon"
                                  data-icon="ph:lock-simple-light"
                                ></i>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </transition>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- <courses-reviews /> -->
            </div>
          </div>
          <div class="col-12 col-lg-4 courses-details__od1">
            <div class="courses-details__wrapper">
              <!-- <div class="courses-details__video">
                <img src="/images/bg-course.jpg" width="100%" height="auto" />
              </div> -->
              <div class="courses-details__info mb-30px">
                <h2
                  class="courses-details__info_price-status fw-semibold mb-30px"
                >
                  Study
                </h2>

                <div
                  @click="onStart()"
                  class="cursor-pointer courses-details__info_button button-type-01 fs-14 fw-semibold text-white text-capitalize transition-all d-flex align-items-center justify-content-center gap-5px mb-15px"
                >
                  <i
                    v-if="!isLocked"
                    class="iconify fs-24"
                    data-icon="mdi:play"
                  ></i>
                  <span>{{ isLocked ? "Add code" : "Start Now" }}</span>
                </div>
                <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="el:hand-right"
                  ></i>
                  <span>100% positive feedback</span>
                </span>
                <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="tdesign:user"
                  ></i>
                  <span>523 students</span>
                </span>
                <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="mdi:video-outline"
                  ></i>
                  <span>9 VDOs (2 hours)</span>
                </span>
                <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="ant-design:global-outlined"
                  ></i>
                  <span>Language: Thai</span>
                </span>
                <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="material-symbols:quiz-outline"
                  ></i>
                  <span>1 Quiz (2-3 mins)</span>
                </span>
                <!-- <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="material-symbols:assignment-outline"
                  ></i>
                  <span>Homework: No</span>
                </span> -->
                <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="mdi:devices"
                  ></i>
                  <span>Device: Notebook</span>
                </span>
                <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="mdi:google-chrome"
                  ></i>
                  <span>Browser: Google Chrome</span>
                </span>
                <!-- <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="iconoir:link"
                  ></i>
                  <span>Access: Limited time</span>
                </span> -->
                <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="carbon:skill-level"
                  ></i>
                  <span>Difficulty:</span>
                  <span class="rank-level fw-semibold">⭐☆☆☆☆ (1/5)</span>
                </span>
                <!-- <span class="fs-14 d-flex align-items-center gap-10px mb-15px">
                  <i
                    class="iconify fs-18 courses-details__info_icon"
                    data-icon="mdi:school"
                  ></i>
                  <span>Onsite class: Business simulation</span>
                </span> -->
              </div>
              <!-- <div class="courses-details__advertise border-radius-10px">
              <img
                src="/images/logo.png"
                alt="logo"
                class="courses-details__advertise_logo mb-10px"
              />
              <h5 class="fw-semibold text-white mb-10px">Newest template</h5>
              <p class="text-white fs-14 mb-20px">
                Create a landing page for this course to maximize conversion.
              </p>
              <img
                src="/images/template/courses/courses-02.png"
                class="courses-details__advertise_banner mb-20px"
              />
              <router-link
                to="/"
                class="courses-details__advertise_button button-type-01 fs-14 fw-semibold text-white text-capitalize transition-all"
              >
                Try for free
              </router-link>
            </div> -->
            </div>
          </div>
        </div>

        <!-- <courses-interested /> -->
      </div>
    </section>

    <modals-login ref="modalLogin" @register="handleRegister()" />
    <modals-register ref="modalRegister" @login="handleLogin()" />
    <modals-input-code
      ref="modalInputCode"
      @recheck-is-lock="reCheckIsLock()"
    />
  </div>
</template>
<script lang="ts" setup>
const { userInfo } = useUserStores();
const router = useRouter();
const route = useRoute();
const { useApi } = useApis();
const { toastData, toggleToast } = useConfigsStores();
const { setSetNo, resetSetNo, setSelectedCourse, resetSelectedCourse } =
  useQuizStores();

const isLocked = ref<boolean>(true);
onMounted(async () => {
  resetSetNo();
  resetSelectedCourse();

  if (userInfo.value) isLocked.value = await checkIsLock();

  fetchItems();
  fetchCurriculum();
});

const onClickList = async (_id: string) => {
  const response: any = await useApi("GET", "curriculum/" + route.params.id);
  setSetNo(route.params.id.toString(), response.data?.learnerCodeId);
  setSelectedCourse(_id);

  router.push("/courses/learning");
};

const reCheckIsLock = async () => {
  isLocked.value = await checkIsLock();
};
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

const onStart = async () => {
  if (userInfo.value) {
    isLocked.value = await checkIsLock();
    if (isLocked.value === true) {
      modalInputCode.value.show();
    } else {
      const response: any = await useApi(
        "GET",
        "curriculum/" + route.params.id
      );

      setSetNo(route.params.id.toString(), response.data?.learnerCodeId);
      router.push("/courses/learning");
    }
  } else {
    modalLogin.value.show();
  }
};

const modalInputCode = ref();

const checkIsLock = async () => {
  const response: any = await useApi(
    "GET",
    "curriculum/status/" + route.params.id
  );

  if (response.data?.isLocked) {
    return true;
  } else {
    return false;
  }
};

const loading = ref(true);
const course = ref();
const fetchItems = async () => {
  const response: any = await useApi("GET", "course/detail/" + route.params.id);
  if (response.data) {
    course.value = response.data;
    loading.value = false;
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    toggleToast();
    loading.value = false;
  }
};

const curriculumList = ref();
const fetchCurriculum = async () => {
  if (userInfo.value && !isLocked.value) {
    const response: any = await useApi("GET", "curriculum/" + route.params.id);
    if (response.data) {
      curriculumList.value = response.data.curriculum;
      loading.value = false;
    } else {
      toastData.value.status = "fail";
      toastData.value.message = response.error;
      toggleToast();
      loading.value = false;
    }
  } else {
    const response: any = await useApi("GET", "course/curriculum");
    if (response.data) {
      curriculumList.value = response.data;
      loading.value = false;
    } else {
      toastData.value.status = "fail";
      toastData.value.message = response.error;
      toggleToast();
      loading.value = false;
    }
  }
};

const tabs = [
  {
    id: "description",
    label: "รายละเอียดหลักสูตร",
    contentClass: "description-class",
    contentTitle: "What You'll Learn",
    content: "Detailed description of the course.",
  },
  {
    id: "curriculum",
    label: "หลักสูตร",
    contentClass: "curriculum-class",
    contentTitle: "Course Curriculum",
    content: "A breakdown of the course content.",
  },
];

const toggleCollapse = (index: any) => {
  curriculumList.value[index].collapsed =
    !curriculumList.value[index].collapsed;
};

const activeTab = ref("description"); // Default active tab
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
};

function formatMinutesToEnglish(minutes: number): string {
  const hours = Math.floor(minutes / 60); // คำนวณจำนวนชั่วโมง
  const remainingMinutes = minutes % 60; // คำนวณจำนวนนาทีที่เหลือ

  let result = "";
  if (hours > 0) {
    result += `${hours} ${hours === 1 ? "hour" : "hours"}`; // hour หรือ hours
  }
  if (remainingMinutes > 0) {
    if (hours > 0) {
      result += " "; // เพิ่มช่องว่างระหว่างชั่วโมงและนาที
    }
    result += `${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}`; // minute หรือ minutes
  }

  return result.trim(); // ตัดช่องว่างท้ายข้อความ
}
</script>

<style scoped>
/* Transition Effect */
.collapse-enter-active,
.collapse-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px; /* สูงสุดที่คาดว่าจะใช้ */
  opacity: 1;
}

.course-content {
  padding: 0 15px;
}

:deep(ul li) {
  list-style: disc;
}
</style>
