// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "e-Learning",
      htmlAttrs: { lang: "en" },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      script: [
        { src: "/js/iconify.min.js", defer: true },
        { src: "/js/swiper-bundle.min.js", defer: true },
        { src: "/js/swiper-control.js", defer: true },
        { src: "/js/main.js", defer: true },
        { src: "/js/wow.min.js", defer: true },
      ],
    },
  },

  devtools: { enabled: false },

  modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt"],

  // googleSignIn: {
  //   clientId: process.env.GOOGLE_CLIENT_ID || "",
  // },

  piniaPersistedstate: {
    storage: "localStorage",
  },

  css: [
    "@/assets/styles.css",
    // CSS in index File From Layout
    "@/assets/css/bootstrap.min.css",
    "@/assets/css/swiper-bundle.min.css",
    "@/assets/css/lightbox.css",
    "@/assets/css/nouislider.min.css",
    "@/assets/css/style.css",
    "@/assets/css/demos/marketplace.css",
    "@/assets/css/animate.css",
    "@fortawesome/fontawesome-free/css/all.css",
  ],

  runtimeConfig: {
    public: {
      API_URL: `${process.env.VITE_API_ENDPOINT}/app` || "",
      VERSION: process.env.VERSION || "v0.0.1",
      COPYRIGHT: process.env.COPYRIGHT || "warunee",
    },
  },

  ssr: false,
  compatibilityDate: "2025-08-29",
});
