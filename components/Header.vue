<template>
  <v-app-bar>
    <v-img
      class="ma-3"
      src="/images/FFP_Tent_LOGO_720x440.png"
      contain
      max-height="100"
      max-width="100"
      @click="$router.push('/')"
    ></v-img>
    <v-spacer></v-spacer>

    <!-- <v-toolbar-title class="w-100" @click="$router.push('/')">
      <v-btn class="d-none d-sm-flex">Friends Feast Plans</v-btn>
      <v-btn class="d-flex d-sm-none text-button"
        >Friends <br />Feast Plans</v-btn
      >
    </v-toolbar-title> -->
    <v-btn
      v-if="!store.isAuthenticated"
      class="bg-blue-grey-lighten-4 mr-2"
      @click="$router.push('/Register')"
    >
      Sign Up
    </v-btn>
    <v-btn
      v-if="!store.isAuthenticated"
      color="primary"
      dark
      variant="flat"
      @click="$router.push('/login')"
    >
      Login
    </v-btn>
    <v-col cols="auto">
      <v-btn
        v-if="store.isAuthenticated"
        icon="mdi-account"
        color="primary"
        class="mr-2"
        @click="$router.push('/profile')"
      >
      </v-btn>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <!-- <template #activator="{ props }">
          <v-btn icon="mdi-account" size="large" v-bind="props"> </v-btn>
        </template> -->
        <v-list>
          <v-list-item v-if="store.isAuthenticated">
            <v-btn variant="plain" :to="'/faqs'">FAQs</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn variant="plain" :to="'/contact'">Contact</v-btn>
          </v-list-item>
          <v-list-item>
            <v-btn variant="plain" :to="'/about'">About</v-btn>
          </v-list-item>
          <v-list-item v-if="store.isAuthenticated">
            <v-btn variant="plain" @click="handleLogout">Logout</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-app-bar>
</template>

<script setup lang="ts">
import { signOut } from "firebase/auth";
import { useUserStore } from "./../stores/userStore";

const store = useUserStore();
const { $auth } = useNuxtApp();

function handleLogout() {
  signOut($auth)
    .then(() => {
      // Sign-out successful.
      store.resetTheThings();
      navigateTo("/login");
    })
    .catch((error) => {
      console.error(error);
      // An error happened.
    });
}
</script>
