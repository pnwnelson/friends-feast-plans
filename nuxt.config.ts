// https://nuxt.com/docs/api/configuration/nuxt-config
// import { defineNuxtConfig } from "nuxt";
import eslintPlugin from "vite-plugin-eslint";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      FB_API_KEY: process.env.FB_API_KEY,
      FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
      FB_PROJECT_ID: process.env.FB_PROJECT_ID,
      FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
      FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
      FB_APP_ID: process.env.FB_APP_ID,
      FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID,
    },
  },
  app: {
    head: {
      title: "Friends' Feast Plans",
      meta: [
        {
          name: "description",
          content:
            "Quickly find out where the different age groups will be attending the Feast of Tabernacles",
        },
        {
          property: "og:title",
          content: "Friends' Feast Plans",
        },
        {
          name: "og:description",
          content:
            "Quickly find out where the different age groups will be attending the Feast of Tabernacles",
        },
        {
          property: "og:image",
          content:
            "https://friendsfeastplans.org/images/FFP_Tent_LOGO_720x440.png",
        },
        {
          property: "twitter:title",
          content: "Friends' Feast Plans",
        },
        {
          property: "twitter:description",
          content:
            "Quickly find out where the different age groups will be attending the Feast of Tabernacles",
        },
        {
          property: "twitter:image",
          content:
            "https://friendsfeastplans.org/images/FFP_Tent_LOGO_720x440.png",
        },
        {
          property: "twitter:url",
          content: "https://friendsfeastplans.org",
        },
      ],
    },
  },
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-gtag",
    "@vite-pwa/nuxt",
  ],
  typescript: {
    // Take Over Mode handles the declaration files for us
    shim: false,
    strict: false,
  },
  ssr: false,
  css: [
    "@mdi/font/css/materialdesignicons.min.css",
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  gtag: {
    id: "G-363983668",
  },
  pwa: {
    manifest: {
      name: "Friends Feast Plans",
      short_name: "FFP",
      theme_color: "#143c84",
      description:
        "Share what you're currenly planning to do for the Feast of Tabernacles and help families with similar age groups assemble together",
      icons: [
        {
          src: "icons/192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      type: "module",
    },
  },
});
