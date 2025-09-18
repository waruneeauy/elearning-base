<template>
  <section class="mkp-popular courses-layout-2 mb-130px">
    <div class="container">
      <div
        class="courses-layout-2__top d-flex align-items-center justify-content-between mb-40px"
      >
        <h2 class="fw-bolder"><span class="hl-style">Popular</span> Courses</h2>
        <p class="text-capitalize">
          <a
            href="#"
            class="fs-14 transition-all d-flex align-items-center gap-5px"
          >
            <router-link to="/courses" class="d-none d-sm-block fw-semibold"
              >See More</router-link
            >
            <i class="iconify fs-20" data-icon="radix-icons:arrow-right"></i>
          </a>
        </p>
      </div>
      <div
        class="position-relative swiper-style-1 wow fadeInUp"
        data-wow-duration="1.5s"
      >
        <div
          class="swiper edm-swiper"
          data-slides-per-view="1"
          data-space-between="30"
          data-button-next="edm-swiper-button-next-pcmkp"
          data-button-prev="edm-swiper-button-prev-pcmkp"
          data-pagination="edm-data-pagination-pcmkp"
          data-loop="true"
          data-breakpoints='{"1024": {"slidesPerView": 4, "spaceBetween": 30}, "768": {"slidesPerView": 3, "spaceBetween": 30}, "576": {"slidesPerView": 2, "spaceBetween": 30}}'
        >
          <div v-for="course in courses" class="swiper-wrapper">
            <div class="swiper-slide">
              <article class="courses-layout-2__items">
                <div class="courses-layout-2__items__top position-relative">
                  <figure>
                    <router-link :to="`/courses/${course.id}`">
                      <img
                        src="/images/template/courses/courses-01.jpg"
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
                  <span
                    class="courses-layout-2__items__author text-capitalize d-block mb-10px"
                  >
                    <a href="#" class="fs-14 fw-semibold transition-all">
                      {{ course.authen }}
                    </a>
                  </span>
                  <p
                    class="courses-layout-2__items__brief fs-14 line-clamp-2 mb-12px"
                  >
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
                    class="button button-type-01 fs-14 fw-semibold text-white text-capitalize transition-all d-flex align-items-center justify-content-center gap-5px"
                  >
                    <i class="iconify fs-24" data-icon="mdi:play"></i>
                    <span>Start Learning</span>
                  </router-link>
                </div>
              </article>
            </div>
          </div>
        </div>
        <!-- <div
          class="swiper-button-next swiper-nextBtn-style-01 edm-swiper-button-next-pcmkp transition-all"
        >
          <i class="iconify fs-24" data-icon="radix-icons:arrow-right"></i>
        </div>
        <div
          class="swiper-button-prev swiper-preBtn-style-01 edm-swiper-button-prev-pcmkp transition-all"
        >
          <i class="iconify fs-24" data-icon="radix-icons:arrow-left"></i>
        </div>
        <div
          class="swiper-pagination edm-data-pagination-pcmkp transition-all"
        ></div> -->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  courses: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
.swiper-slide {
  width: 25%;
  padding: 20px;
}
</style>
