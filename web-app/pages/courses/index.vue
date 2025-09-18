<template>
  <div v-if="!loading">
    <section class="courses-page courses-list courses-layout-2 pt-40px pb-80px">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-9 mb-30px mb-lg-0">
            <div class="row gy-30px" style="min-height: 350px">
              <div
                v-if="filteredCourses?.length"
                v-for="(course, index) in filteredCourses"
                class="col-12"
              >
                <article class="courses-layout-2__items">
                  <div class="courses-layout-2__items__top position-relative">
                    <figure>
                      <router-link :to="`/courses/${course.id}`">
                        <img
                          :src="`/images/template/courses/courses-${index}.jpg`"
                          alt="Introduction LearnPress &#x2013; LMS plugin"
                        />
                      </router-link>
                      <figcaption
                        class="courses-layout-2__items__cate text-capitalize"
                      >
                        <router-link
                          :to="`/courses/${course.id}`"
                          class="text-white"
                          >{{ course.category.name }}</router-link
                        >
                      </figcaption>
                    </figure>
                  </div>
                  <div
                    class="courses-layout-2__items__bottom pt-20px pb-20px pe-15px ps-15px"
                  >
                    <h4
                      class="courses-layout-2__items__title fs-20 fw-semibold text-capitalize mb-12px"
                    >
                      <router-link
                        :to="`/courses/${course.id}`"
                        class="transition-all line-clamp-2"
                        >{{ course.title }}</router-link
                      >
                    </h4>

                    <p class="courses-layout-2__items__brief fs-14 mb-12px">
                      {{ course.description }}
                    </p>
                    <span
                      class="courses-layout-2__items__lesson d-flex align-items-center gap-5px mb-12px fs-14"
                    >
                      <i class="iconify" data-icon="circum:view-list"></i>
                      <span>{{ course.lessons }} Lessons</span>
                    </span>
                    <router-link
                      :to="`/courses/${course.id}`"
                      class="button button-type-01 fs-14 fw-semibold text-white text-capitalize transition-all d-flex align-items-center justify-content-center gap-5px mt-50px"
                    >
                      <i class="iconify fs-24" data-icon="mdi:play"></i>
                      <span>View Details</span>
                    </router-link>
                  </div>
                </article>
              </div>
              <div v-else class="text-center mt-100px">No Data Match.</div>
            </div>
            <div class="pagination">
              <a
                href="#"
                class="pagination-prev pagination__page-numbers btn disabled"
              >
                <i class="iconify fs-18" data-icon="mingcute:left-line"></i>
              </a>
              <a href="#" class="pagination__page-numbers active">1</a>
              <!-- <a href="#" class="pagination__page-numbers">2</a>
                <a href="#" class="pagination__page-numbers">3</a> -->
              <a
                href="#"
                class="pagination-next pagination__page-numbers btn disabled"
              >
                <i class="iconify fs-18" data-icon="mingcute:right-line"></i>
              </a>
            </div>
          </div>
          <aside class="col-12 col-lg-3 side-part">
            <div
              class="courses-page__filter courses-page__courses-cate mb-40px"
            >
              <h4 class="fs-20 fw-semibold mb-20px">Course Categories</h4>
              <ul class>
                <li
                  class="d-flex align-items-center gap-10px justify-content-between mb-10px"
                >
                  <a href="/courses" class="transition-all"> การใช้งานระบบ </a>
                  <span class>({{ filteredCourses?.length }})</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { useApi } = useApis();
const { toastData, toggleToast } = useConfigsStores();
const { setAccessToken, getUserInfo } = useUserStores();

const route = useRoute();

onMounted(async () => {
  fetchItems();

  // Check Email already exists
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const error: string = urlParams.get("error") as string;
  if (token || error) {
    if (token) {
      setAccessToken(token);
      await getUserInfo();
      toastData.value.status = "success";
      toastData.value.message = "Login successfully";
      toggleToast();
    } else if (error) {
      toastData.value.status = "fail";
      toastData.value.message = "Email already exists!";
      toggleToast();
    }
  }
});

const loading = ref(true);
const courses = ref();
const fetchItems = async () => {
  const response: any = await useApi("GET", "course");

  if (response.data) {
    courses.value = response.data;
    loading.value = false;
  } else {
    toastData.value.status = "fail";
    toastData.value.message = response.error;
    toggleToast();
    loading.value = false;
  }
};

// ฟังก์ชันกรองคอร์สที่ตรงกับ searchQuery
const filteredCourses = computed(() => {
  const keyword = Array.isArray(route.query.searchQuery)
    ? route.query.searchQuery[0]?.toLowerCase() // ถ้าเป็น array ให้ใช้ index [0]
    : route.query.searchQuery?.toLowerCase() || ""; // ถ้าเป็น null หรือ undefined ให้เป็น ""

  if (!keyword) return courses.value; // ถ้าไม่มีคำค้นหา แสดงทั้งหมด

  return courses.value.filter((course: any) => {
    return (
      course.title.toLowerCase().includes(keyword) ||
      course.description.toLowerCase().includes(keyword) ||
      course.authen.toLowerCase().includes(keyword) ||
      course.category.name.toLowerCase().includes(keyword)
    );
  });
});

const categoryFilter = ref("");
// Reset the search input
const resetCategoryFilter = () => {
  categoryFilter.value = "";
};
</script>
