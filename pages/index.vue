<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-subtitle-1 mb-3">
          Want to see where your friends are thinking of going to the Feast?
          Choose a location below to see who's going there.
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- <select v-model="selected" label="Select">
          <option selected value="">--Please choose a location--</option>
          <option v-for="(item, key) in locations" :key="key" :value="item">
            {{ item }}
          </option>
        </select>
        <div>{{ selected }}</div> -->
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Location</th>
              <th class="text-left">Attendance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(location, key) in locations" :key="location">
              <td>{{ location.name }}</td>
              <td>{{ location.attendance }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import locations2023 from "@/content/locations_2023.json";

const locations = locations2023;
// const selected = ref(null);
</script>

<style>
select {
  border: 1px solid black;
}
</style>
