<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="changeLeftDrawer" />

        <q-toolbar-title>LMS</q-toolbar-title>

        <q-btn dense flat round icon="logout" @click="logout">
          <q-tooltip>ออกจากระบบ</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list bordered>
        <q-item
          v-for="item in menuList.filter((menu) => menu.group === 'home')"
          :key="item.name"
          clickable
          v-ripple
          :to="item.path"
          :active="item.code === activeName"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="secondary" :name="item.icon" />
          </q-item-section>

          <q-item-section>{{ item.name }}</q-item-section>
        </q-item>

        <q-separator />
        <q-item-label header>Main Content</q-item-label>

        <q-item
          v-for="item in menuList.filter(
            (menu) => menu.group === 'General learner'
          )"
          :key="item.name"
          clickable
          v-ripple
          :to="item.path"
          :active="item.code === activeName"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="secondary" :name="item.icon" />
          </q-item-section>

          <q-item-section>{{ item.name }}</q-item-section>
        </q-item>

        <q-item
          v-for="item in menuList.filter((menu) => menu.group === 'School')"
          :key="item.name"
          clickable
          v-ripple
          :to="item.path"
          :active="item.code === activeName"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="secondary" :name="item.icon" />
          </q-item-section>

          <q-item-section>{{ item.name }}</q-item-section>
        </q-item>

        <q-separator />
        <q-item-label header>System</q-item-label>

        <q-item
          v-for="item in menuList.filter((menu) => menu.group === 'System')"
          :key="item.name"
          clickable
          v-ripple
          :to="item.path"
          :active="item.code === activeName"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon color="secondary" :name="item.icon" />
          </q-item-section>

          <q-item-section>{{ item.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <slot />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
const { resetAccessToken, resetUserInfo } = useUserStores();

const leftDrawerOpen = ref(false);
const route = useRoute();
const router = useRouter();
const activeName = ref<string>(
  route.name !== "index" ? route.name?.toString() || "" : "home"
);
const menuList = [
  {
    name: "หน้าหลัก",
    icon: "home",
    code: "home",
    path: "/",
    group: "home",
  },
  {
    name: "จัดการหลักสูตร/คอร์ส",
    icon: "menu_book",
    code: "contents",
    path: "/contents",
    group: "General learner",
  },
  {
    name: "จัดการกลุ่มผู้อบรม",
    icon: "domain",
    code: "organization",
    path: "/organization",
    group: "General learner",
  },
  // {
  //   name: "Config Text",
  //   icon: "settings",
  //   code: "config",
  //   path: "/config",
  //   group: "System",
  // },
  {
    name: "รายการผู้ใช้งาน",
    icon: "account_circle",
    code: "user",
    path: "/user",
    group: "System",
  },
];

function changeLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function logout() {
  await resetAccessToken();
  await resetUserInfo();
  router.push("/login");
}

watch(
  () => route.name,
  () => {
    activeName.value =
      route.name !== "index" ? route.name?.toString() || "" : "home";
  }
);
</script>

<style>
.my-menu-link {
  background: #e8e8e8;
}
</style>
