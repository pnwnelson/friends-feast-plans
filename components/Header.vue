<template>
  <v-app-bar>
    <v-toolbar-title @click="$router.push('/')">
      Friends Feast Plans
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="!store.isAuthenticated" @click="$router.push('/Register')">
      Register
    </v-btn>
    <v-btn v-if="!store.isAuthenticated" @click="$router.push('/login')">
      Login
    </v-btn>
    <v-col v-if="store.isAuthenticated" cols="auto">
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
import { useUserStore } from "./../stores/userStore";
const store = useUserStore();

function handleLogout() {
  store.isAuthenticated = false;
}
</script>
