export default defineNuxtRouteMiddleware((to) => {
  const { accessToken } = useUserStores();
  if (!accessToken) return navigateTo("/");
});
