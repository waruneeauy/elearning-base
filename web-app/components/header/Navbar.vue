<template>
  <nav class="mkp-navbar navbar navbar-expand-lg pt-0 pb-0">
    <div class="container">
      <!-- Main Navigation -->
      <div class="col-3 col-lg-9">
        <div class="bars-btn d-none cursor-pointer" @click="onShowSideBar">
          <span class="iconify fs-24" data-icon="fe:bar"></span>
        </div>
        <div class="navbar-custom">
          <ul class="navbar-nav gap-10px">
            <li
              v-for="menu in userInfo
                ? menus
                : menus.filter((e: any) => e.label !== 'Profile')"
              :key="menu.label"
              class="nav-item"
            >
              <router-link
                :to="menu.path"
                class="d-block pt-25px pb-25px pe-25px transition-all"
              >
                {{ menu.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <!-- Right Actions -->
      <div class="col-9 col-lg-3">
        <div class="navbar-act d-flex align-items-center justify-content-end">
          <!-- <a
            href="#"
            class="button button-type-01 fs-14 fw-semibold text-white text-capitalize transition-all"
            >Get started</a
          > -->
          <a
            v-if="!userInfo"
            href="#"
            @click="handleLogin"
            class="navbar-act__login fs-14 ms-25px fw-semibold text-capitalize transition-all d-flex align-items-center gap-5px"
          >
            <i class="iconify fs-16" data-icon="lucide:user"></i>
            <span>Log In</span>
          </a>
          <a
            v-else
            href="#"
            @click="handleLogout"
            class="navbar-act__login fs-14 ms-25px fw-semibold text-capitalize transition-all d-flex align-items-center gap-5px"
          >
            <span>Log Out</span>
            <i class="iconify fs-16" data-icon="lucide:log-out"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div
      :class="['sidebar-overlay', { active: isShow }]"
      @click="onHideSideBar"
    >
      <div class="sidebar-content" @click.stop>
        <ul class="sidebar-nav">
          <li
            class="nav-item navbar-close d-none cursor-pointer px-2"
            @click="onHideSideBar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              class="iconify iconify--teenyicons fs-12"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 15 15"
              data-icon="teenyicons:left-outline"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="square"
                d="M10 14L3 7.5L10 1"
              ></path>
            </svg>
            <span>Close</span>
          </li>

          <li
            v-for="menu in menus"
            :key="menu.label"
            class="p-2 cursor-pointer"
          >
            <a @click="onClickMenu(menu.path)">{{ menu.label }}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { userInfo } = useUserStores();

const emit = defineEmits(["login", "logout"]);

function handleLogin() {
  emit("login");
}

function handleLogout() {
  emit("logout");
}

const menus = ref([
  { label: "Home", path: "/", activePath: "home" },
  { label: "Online Courses", path: "/courses", activePath: "courses" },
  { label: "Profile", path: "/profile", activePath: "profile" },
]);

const isShow = ref(false);

function onShowSideBar() {
  isShow.value = true;
}

function onHideSideBar() {
  isShow.value = false;
}

const router = useRouter();
function onClickMenu(route: string) {
  onHideSideBar();
  router.push(route);
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

.sidebar-content {
  width: 300px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
  transform: translateX(-100%);
}

.sidebar-overlay.active .sidebar-content {
  transform: translateX(0);
}
.navbar ul li a.router-link-active {
  color: var(--regal-blue) !important;
}
</style>
