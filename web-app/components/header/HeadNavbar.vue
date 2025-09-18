<template>
  <section class="mkp-head pt-10px">
    <div class="container">
      <div class="head-line pb-10px">
        <div class="row align-items-center justify-content-between">
          <div class="col-4 col-sm-2 col-lg-1">
            <router-link to="/" class="head__logo">
              <img src="/images/logo.png" alt="logo" width="70" />
            </router-link>
          </div>
          <div class="col-sm-3 col-lg-4 d-none d-md-block">
            <strong>e-Learning</strong>
            <p>Human Resource Management System</p>
            <!-- <ul class="head__nav">
              <li class="main-dropdown-menu">
                <a href="#" class="transition-all">
                  หมวดหมู่
                  <i class="iconify fs-12" data-icon="grommet-icons:down"></i>
                </a>
                <ul class="main-dropdown-menu__sub">
                  <li class="main-dropdown-menu__sub_items">
                    <router-link to="/courses" class="transition-all">
                      การใช้งานระบบบริหารทรัพยากรบุคคลของกรุงเทพมหานคร
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul> -->
          </div>
          <div class="col-8 col-sm-7 col-lg-7">
            <form
              action="#"
              class="head__search position-relative cursor-pointer"
            >
              <i
                class="iconify fs-20 search__icon"
                data-icon="iconamoon:search"
              ></i>
              <input
                type="text"
                value
                name="searchQuery"
                placeholder="Search courses..."
                class
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (route.query.searchQuery) {
    router.push({
      path: "/courses",
      query: { searchQuery: route.query.searchQuery },
    });
  }
});
</script>
<style scoped>
.main-dropdown-menu__sub {
  min-width: 250px;
}
</style>
