<template>
  <v-container>
    <v-row>
      <v-col>
        <p>Thanks!</p>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted, ComputedRef } from "vue";

onMounted(() => {
  setTimeout(() => {
    navitageHome();
  }, 3000);
});

function navitageHome() {
  navigateTo("/");
}
</script>
