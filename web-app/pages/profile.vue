<template>
  <section
    class="instructors-details pt-40px pb-80px"
    @click="handleOutsideClick"
  >
    <div class="container">
      <div class="instructors-details-layout-2">
        <div
          class="bg-image"
          style="
            background-image: url(&quot;/images/template/coursera/bg-counting.png&quot;);
          "
        ></div>
        <div
          class="instructors-details-layout-2_wrap d-flex align-items-center justify-content-between mb-30px"
        >
          <div
            class="instructors-details-layout-2_thumb d-flex align-items-end"
          >
            <div>
              <div class="profile-container">
                <!-- รูปภาพโปรไฟล์ -->
                <div class="profile-image-container">
                  <img
                    :src="userInfo?.photo || `/images/profile-default.png`"
                    alt="Instructors Details Image"
                    class="profile-image"
                  />

                  <!-- ไอคอนดินสอที่มุมขวาล่าง -->
                  <i
                    class="fa fa-pencil-alt edit-icon"
                    @click.stop="triggerFileInput"
                    aria-hidden="true"
                  ></i>
                </div>

                <!-- ข้อมูลผู้ใช้ -->
                <div class="instructors-details-layout-2_intro">
                  <h1 class="fs-36 fw-bolder mb-10px">{{ userInfo?.name }}</h1>
                  <p>{{ userInfo?.profile?.position || "" }}</p>
                </div>
              </div>

              <!-- ปุ่มเลือกไฟล์ -->
              <input
                type="file"
                @change="handleFileChange"
                style="display: none"
                ref="fileInput"
              />
            </div>
          </div>
          <div
            class="instructors-details-layout-2_social d-flex align-items-center justify-content-between gap-20px"
          >
            <a
              @click="onEditProfile"
              class="cursor-pointer button button-type-01 fs-14 fw-semibold text-white text-capitalize transition-all"
              >Edit Profile</a
            >
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-lg-3 mb-30px mb-lg-0 breakpoint-left">
            <div class="instructors-details-layout-2_box mb-30px">
              <div class="instructors-details-layout-2_info">
                <div class="item">
                  <h5 class="mb-10 fw-bold item-title1">
                    {{ myCourse?.length ? "1" : "-" }}
                  </h5>
                  <p class="fs-14">My Courses</p>
                </div>
                <div class="item">
                  <h5 class="mb-10 fw-bold item-title2">
                    {{
                      myrank?.find((e: any) => e.isYou === true)?.rankNo || "-"
                    }}
                  </h5>
                  <p class="fs-14">Ranking</p>
                </div>
                <!-- <div class="item">
                  <h5 class="mb-10 fw-bold item-title3">99%</h5>
                  <p class="fs-14">Positive reviews</p>
                </div>
                <div class="item">
                  <h5 class="mb-10 fw-bold item-title4">2nd</h5>
                  <p class="fs-14">Student</p>
                </div> -->
              </div>
            </div>
            <div class="instructors-details-layout-2_box">
              <h5 class="fw-bold title">Personal details</h5>
              <div class="d-flex align-items-center gap-20px mb-20px">
                <span>
                  <i
                    class="iconify fs-20"
                    data-icon="carbon:phone"
                    aria-hidden="true"
                  ></i>
                </span>
                <div class="info-block">
                  <p>Phone</p>
                  <p class="fw-semibold">{{ userInfo?.phoneNumber ?? "-" }}</p>
                </div>
              </div>
              <div class="d-flex align-items-center gap-20px mb-20px">
                <span>
                  <i
                    class="iconify fs-20"
                    data-icon="ic:outline-mail"
                    aria-hidden="true"
                  ></i>
                </span>
                <div class="info-block">
                  <p>Email</p>
                  <p class="fw-semibold">{{ userInfo?.email ?? "-" }}</p>
                </div>
              </div>
              <div
                v-if="userInfo?.profile?.birthday"
                class="d-flex align-items-center gap-20px mb-20px"
              >
                <span>
                  <i
                    class="iconify fs-20"
                    data-icon="ph:star-fill"
                    aria-hidden="true"
                  ></i>
                </span>
                <div class="info-block">
                  <p>Birthday</p>
                  <p class="fw-semibold">
                    {{
                      new Date(userInfo?.profile?.birthday).toLocaleDateString(
                        "en-GB"
                      ) ?? "-"
                    }}
                  </p>
                </div>
              </div>
              <!-- <div class="d-flex align-items-center gap-20px">
                <span>
                  <i
                    class="iconify fs-20"
                    data-icon="tdesign:location"
                    aria-hidden="true"
                  ></i>
                </span>
                <div class="info-block">
                  <p>Location</p>
                  <p class="fw-semibold">
                    {{ userInfo?.profile?.address ?? "-" }}
                  </p>
                </div>
              </div> -->
            </div>
          </div>
          <div class="col-12 col-lg-9 breakpoint-right">
            <div
              class="tabs-default d-flex align-items-center gap-30px mb-30px"
            >
              <h6
                v-for="(tab, index) in tabs"
                :key="index"
                :class="[
                  'tab-default',
                  'fw-semibold',
                  'transition-all',
                  'cursor-pointer',
                  { active: activeTab === tab.id },
                ]"
                @click="setActiveTab(tab.id)"
              >
                {{ tab.title }}
              </h6>
            </div>
            <div class="tab-content">
              <!-- <div v-if="activeTab === 'tab-1'">
                <ProfileOverview />
              </div> -->
              <div v-if="activeTab === 'tab-2'">
                <!-- v-if="progressList" -->
                <div v-if="myCourse && myCourse.length > 0" class="reviews">
                  <div class="d-flex justify-content-between mb-3">
                    <div class="dropdown">
                      <button
                        class="btn border-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        @click.stop="toggleDropdown"
                      >
                        {{
                          new Date(progressList?.usedAt).toLocaleDateString()
                        }}
                      </button>
                      <div
                        class="dropdown-menu"
                        :class="{ block: isOpen }"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a
                          v-for="item in myCourse"
                          class="dropdown-item cursor-pointer"
                          @click="selectOption(item.learnerCodeId)"
                          >{{ new Date(item.usedAt).toLocaleDateString() }}</a
                        >
                      </div>
                    </div>

                    <div
                      class="d-flex flex-wrap gap-20px w-100 justify-content-end align-items-center"
                    >
                      <div class="w-50 my-2 text-center">
                        <p>
                          Your progress :
                          {{ parseInt(progressList?.progress) }}%
                        </p>
                        <div class="progress">
                          <div
                            class="progress-bar"
                            role="progressbar"
                            :style="`width: ${progressList?.progress}%`"
                          ></div>
                        </div>
                      </div>

                      <h6 class="fw-bold">
                        Score
                        {{ progressList?.score }}/{{
                          progressList?.scoreFullAll
                        }}
                      </h6>
                    </div>
                  </div>
                  <div class="courses-details__curriculum">
                    <ul class="curriculum-section">
                      <li
                        v-for="(curriculum, index) in progressList?.curriculum"
                        :key="index"
                        class="curriculum-section__items"
                      >
                        <div
                          class="curriculum-section__header d-flex align-items-center gap-20px justify-content-between"
                        >
                          <a
                            @click="toggleCollapse(index)"
                            class="remove-hover"
                          >
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
                          <span
                            class="d-block fw-semibold curriculum-section__header_quantity"
                            >{{ curriculum.totatScore }}/{{
                              curriculum.fullScore
                            }}</span
                          >
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
                              <!-- :class="{ active: item.status === 'DONE' }" -->
                              <a
                                @click="onStart(item)"
                                class="d-flex gap-20px align-items-center w-auto remove-hover"
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
                                  style="color: var(--regal-blue)"
                                ></i>
                                <p
                                  class="curriculum-section__content_title"
                                  :class="{
                                    'text-primary cursor-pointer':
                                      item.status !== 'LOCKED' &&
                                      progressList.isView,
                                  }"
                                >
                                  {{ item.label }}
                                </p>
                              </a>
                              <div class="d-flex align-items-center gap-10px">
                                {{
                                  item.type === "QUIZ"
                                    ? `${item.score}/${item.fullScore || 0}`
                                    : ""
                                }}
                              </div>
                            </li>
                          </ul>
                        </transition>
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-else>
                  <div class="d-flex justify-content-center">
                    <h5 class="fw-bold">No course</h5>
                  </div>
                </div>
              </div>
              <div v-if="activeTab === 'tab-3'">
                <ProfileRanking v-if="myrank" :data="myrank" />
              </div>
              <!-- <div v-if="activeTab === 'tab-4'">
                <ProfileReviews />
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <modals-edit-profile
    ref="modalEditProfile"
    @change-password="onChangePassword"
  />
  <modals-change-password
    ref="modalChangePassword"
    @edit-profile="onEditProfile"
  />
</template>
<script lang="ts" setup>
const { setSetNo, setSelectedCourse } = useQuizStores();
const { userInfo, getUserInfo } = useUserStores();
const { useApi } = useApis();
const { toastData, toggleToast } = useConfigsStores();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  loading.value = true;
  await fetchMyCourse();
  await fetchMyrank();
  loading.value = false;
});

const onStart = async (item: any) => {
  if (item.status !== "LOCKED" && progressList.value.isView) {
    setSetNo("1", progressList.value.learnerCodeId);
    setSelectedCourse(item?.id);

    router.push("/courses/learning");
  }
};

const loading = ref(true);
const myCourse = ref();
const fetchMyCourse = async () => {
  const response: any = await useApi("GET", "my-course");

  if (response.data) {
    myCourse.value = response.data;
    progressList.value = myCourse.value[0];
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    toggleToast();
  }
};

const myrank = ref();
const fetchMyrank = async () => {
  const response: any = await useApi("GET", "my-rank");

  if (response.data) {
    myrank.value = response.data;
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    toggleToast();
  }
};

// ฟังก์ชันเปิด file input เมื่อคลิกที่ภาพ
const triggerFileInput = () => {
  const fileInput = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  fileInput?.click();
};

// ฟังก์ชันสำหรับจัดการการเลือกไฟล์
const handleFileChange = async (event: Event) => {
  const fileInput = event.target as HTMLInputElement;
  if (!fileInput?.files?.length) return;

  const file = fileInput.files[0];

  // ใช้ FileReader เพื่อแปลงไฟล์เป็น Base64
  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result as string;

    // เรียกใช้ API เพื่ออัปโหลดไฟล์ใหม่
    await changePhoto(base64Image);
  };
  reader.readAsDataURL(file);
};

// ฟังก์ชันสำหรับอัปโหลดรูปโปรไฟล์
const changePhoto = async (base64Image: string) => {
  const response: any = await useApi("PUT", "profile/photo", {
    photo: base64Image, // ส่ง Base64 image ไปใน body request
  });
  if (response.data) {
    getUserInfo();
  }
};

const modalEditProfile = ref();
const onEditProfile = () => {
  modalChangePassword.value.hide();
  modalEditProfile.value.show();
};

const modalChangePassword = ref();
const onChangePassword = () => {
  modalEditProfile.value.hide();
  modalChangePassword.value.show();
};

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
};

const activeTab = ref("tab-2"); // Default active tab
const tabs = [
  {
    id: "tab-2",
    title: "My Courses",
  },
  {
    id: "tab-3",
    title: "Ranking",
  },
];

const progressList = ref();
const toggleCollapse = (index: any) => {
  progressList.value.curriculum[index].collapsed =
    !progressList.value.curriculum[index].collapsed;
};

const isOpen = ref<boolean>(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (id: any) => {
  progressList.value = myCourse.value.find((e: any) => e.learnerCodeId === id);
  isOpen.value = false;
};

const handleOutsideClick = (event: MouseEvent) => {
  // เช็คถ้าไม่ได้คลิกใน dropdown หรือปุ่ม
  const dropdownButton = document.getElementById("dropdownMenuButton");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (
    dropdownButton &&
    dropdownMenu &&
    !dropdownButton.contains(event.target as Node) &&
    !dropdownMenu.contains(event.target as Node)
  ) {
    isOpen.value = false; // ปิด dropdown
  }
};
</script>

<style scoped>
.profile-container {
  position: relative;
  display: inline-block;
}

.profile-image-container {
  position: relative;
  display: inline-block;
}

.profile-image {
  width: 150px; /* ปรับขนาดตามต้องการ */
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
}

.edit-icon {
  position: absolute;
  bottom: 10px; /* ระยะห่างจากขอบล่าง */
  right: 10px; /* ระยะห่างจากขอบขวา */
  font-size: 20px;
  color: white; /* สีของไอคอน */
  background-color: rgba(0, 0, 0, 0.5); /* พื้นหลังโปร่งใส */
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-icon:hover {
  background-color: rgba(0, 0, 0, 0.8); /* เปลี่ยนสีพื้นหลังเมื่อ hover */
}

.block {
  display: block;
}

.instructors-details-layout-2 ul li a:hover {
  background-color: transparent;
}
</style>
