<template>
  <div>
    <VitePwaManifest />
    <v-app>
      <Header />
      <v-main>
        <NuxtPage></NuxtPage>
      </v-main>
    </v-app>
  </div>
</template>

<script setup lang="ts">
// useHead({
//   title: "TEST Friends Feast Plans",
//   meta: [
//     {
//       name: "description",
//       content:
//         "TEST Quickly know where the different age groups will be attending the Feast of Tabernacles",
//     },
//   ],
// });

useSeoMeta({
  title: "Friends Feast Plans",
  ogTitle: "Friends Feast Plans",
  description:
    "Quickly know where the different age groups will be attending the Feast of Tabernacles",
  ogDescription:
    "Quickly know where the different age groups will be attending the Feast of Tabernacles",
  ogImage: "https://friendsfeastplans.org/images/FFP_Tent_LOGO_720x440.png",
});
</script>
