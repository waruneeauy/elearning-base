const useApi = async function (
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  body?: any,
  params?: any
) {
  const config = useRuntimeConfig();
  const { accessToken } = useUserStores();

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
    return { data: response };
  } catch (e: any) {
    if (e.data.status === 401) {
      navigateTo("/login");
    }
    return { error: e.data.message };
  }
};
export { useApi };
