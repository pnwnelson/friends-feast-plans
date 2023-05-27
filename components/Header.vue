<template>
  <v-app-bar>
    <v-toolbar-title @click="$router.push('/')">
      <v-btn class="d-none d-sm-flex">Friends Feast Plans</v-btn>
      <v-btn class="d-flex d-sm-none">FFP</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      v-if="!store.isAuthenticated"
      class="bg-blue-grey-lighten-4 mr-2"
      @click="$router.push('/Register')"
    >
      Register
    </v-btn>
    <v-btn
      v-if="!store.isAuthenticated"
      dark
      class="bg-blue-grey-lighten-1"
      variant="flat"
      @click="$router.push('/login')"
    >
      Login
    </v-btn>
    <v-col v-if="store.isAuthenticated" cols="auto">
      <v-btn
        class="bg-blue-grey-lighten-4 mr-2"
        @click="$router.push('/profile')"
      >
        Profile
      </v-btn>
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-account" size="large" v-bind="props"> </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-btn @click="handleLogout">Logout</v-btn>
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
