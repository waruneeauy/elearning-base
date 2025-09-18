// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: "/admin/",
    buildAssetsDir: "/_nuxt/",
    head: {
      title: "ระบบบริหารจัดการการเรียนรู้ - HRMS LMS",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    },
  },

  devtools: { enabled: false },

  modules: [
    "nuxt-quasar-ui",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],

  piniaPersistedstate: {
    storage: "localStorage",
  },

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },

  css: ["@/assets/styles.css"],

  quasar: {
    config: {
      brand: {
        primary: "#02A998",
        secondary: "#028174",
        accent: "#3D3D3D",
      },
    },
    plugins: ["Dialog", "Loading", "Notify"],
  },

  runtimeConfig: {
    public: {
      API_URL: process.env.VITE_API_ENDPOINT || "",
      VERSION: process.env.VERSION || "v0.0.1",
      COPYRIGHT: process.env.COPYRIGHT || "warunee",
    },
  },

  ssr: false,
  compatibilityDate: "2025-08-29",
});
