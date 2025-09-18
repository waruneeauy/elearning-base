<template>
  <div class="reviews">
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
            new Date(progressList?.usedAt).toLocaleString("th-TH", {
              timeZone: "UTC",
            })
          }}
        </button>
        <div
          class="dropdown-menu"
          :class="{ block: isOpen }"
          aria-labelledby="dropdownMenuButton"
        >
          <a
            v-for="item in data"
            class="dropdown-item"
            href="#"
            @click="selectOption(item.learnerCodeId)"
            >{{
              new Date(item.usedAt).toLocaleString("th-TH", {
                timeZone: "UTC",
              })
            }}</a
          >
        </div>
      </div>

      <h6 class="fw-bold">Total Score {{ progressList?.score }}</h6>
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
            <a @click="toggleCollapse(index)" class="remove-hover">
              <i
                class="fa-solid cursor-pointer"
                :class="
                  curriculum.collapsed ? 'fa-chevron-up' : 'fa-chevron-down'
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
              >{{ curriculum.totatScore }}</span
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
                <div
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
                  <p class="curriculum-section__content_title">
                    {{ item.label }}
                  </p>
                </div>
                <div class="d-flex align-items-center gap-10px">
                  {{ item.score }}
                </div>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(["closeDropdown"]);
const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
});

onMounted(() => {
  progressList.value = props.data[0];
});

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
  progressList.value = props.data.find((e: any) => e.learnerCodeId === id);
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
    emit("closeDropdown");
    isOpen.value = false; // ปิด dropdown
  }
};
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

.remove-hover:hover {
  text-decoration: none !important;
  color: inherit !important;
  fill: inherit !important;
  background-color: transparent !important;
  transform: none !important;
}

.instructors-details-layout-2 ul li a {
  width: auto;
  height: auto;
}

.active {
  background-color: rgb(242, 247, 255);
  color: var(--regal-blue);
}

.block {
  display: block;
}
</style>
