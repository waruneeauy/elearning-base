<template>
  <nav
    class="my-learning-navigation d-flex flex-wrap align-items-center gap-30px justify-content-between mt-30px"
    :style="`${isShowSidebar ? '' : 'width: 95%'}`"
  >
    <a
      @click="onPrevios()"
      class="my-learning-navigation__items transition-all d-flex align-items-center gap-10px cursor-pointer"
      :class="{ disabled: !isPrevios }"
    >
      <div
        class="navigation-icon d-flex align-items-center justify-content-center"
      >
        <i class="iconify fs-24" data-icon="lets-icons:arrow-left-light"></i>
      </div>
      <div class="my-learning-navigation__pre">
        <p class="mb-5px">Previous</p>
      </div>
    </a>
    <a
      @click="onNext()"
      class="my-learning-navigation__items transition-all d-flex align-items-center gap-10px cursor-pointer"
      :class="{ disabled: !isNext }"
    >
      <div class="my-learning-navigation__next">
        <p class="mb-5px">Next</p>
      </div>
      <div
        class="navigation-icon d-flex align-items-center justify-content-center"
      >
        <i class="iconify fs-24" data-icon="lets-icons:arrow-right-light"></i>
      </div>
    </a>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits(["onPreviousCourse", "onNextCourse"]);
const onPrevios = () => {
  emit("onPreviousCourse");
};

const onNext = () => {
  emit("onNextCourse");
};

defineProps({
  isShowSidebar: {
    type: Boolean,
    default: false,
  },
  isPrevios: {
    type: Boolean,
    default: false,
  },
  isNext: {
    type: Boolean,
    default: false,
  },
});
</script>
