import type { LoginRequest } from "~/types/request/main";

const useAuth = async function (username: string, password: string) {
  const config = useRuntimeConfig();

  const body = reactive<LoginRequest>({
    email: username,
    password: password,
  });

  const options: any = {
    baseURL: config.public.API_URL,
    method: "POST",
    body: body,
  };

  try {
    const response: any = await $fetch("login", options);
    return { data: response.result };
  } catch (e: any) {
    return { error: e.data.message };
  }
};

export { useAuth };
