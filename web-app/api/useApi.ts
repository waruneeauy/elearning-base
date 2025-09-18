const useApi = async function (
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: any,
  params?: any
) {
  const config = useRuntimeConfig();
  const { accessToken } = useUserStores();
  const { toastData, toggleToast } = useConfigsStores();
  const { resetUserInfo } = useUserStores();

  const options: any = {
    baseURL: config.public.API_URL,
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: body,
    params: params,
  };

  try {
    const response: any = await $fetch(url, options);

    toastData.value.status = response.status;

    if (response.status === "success") {
      return { status: response.status, data: response.result };
    } else if (response.status === 401) {
      resetUserInfo();
      navigateTo("/");
    } else {
      return { error: response.data.message };
    }
  } catch (e: any) {
    if (e.status === 401) {
      resetUserInfo();
      navigateTo("/");
    }
    toastData.value.message = e.data.message;
    return { error: e.data.message };
  }
};
export { useApi };
