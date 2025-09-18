const useAuth = async function (body: any, path: any) {
  const config = useRuntimeConfig();
  const { toastData, toggleToast } = useConfigsStores();

  const options: any = {
    baseURL: config.public.API_URL,
    method: "POST",
    body: body,
  };

  try {
    const response: any = await $fetch(path, options);

    toastData.value.status = response.status;
    toastData.value.message = "Login successfully";

    return { data: response };
  } catch (e: any) {
    toastData.value.status = "fail";
    toastData.value.message = e.data.message;
    return { error: e.data.message };
  } finally {
    toggleToast();
  }
};

export { useAuth };
