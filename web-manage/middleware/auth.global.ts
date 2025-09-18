export default defineNuxtRouteMiddleware((to) => {
  const { accessToken } = useUserStores();
  if (to.name !== "login") {
    if (!accessToken) return navigateTo("/login");
  }
});
