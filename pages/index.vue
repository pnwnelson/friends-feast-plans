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
              <th class="text-left">Preteens</th>
              <th class="text-left">Teens</th>
              <th class="text-left">Young Adults</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(location, index) in locations"
              :key="index"
              @click="getLocationDetail(location)"
            >
              <td v-if="location.name">
                {{ location.name }}
              </td>
              <td>
                {{
                  location.data.attendees && location.data.attendees.total > 0
                    ? location.data.attendees.total
                    : 0
                }}
              </td>
              <td>
                {{
                  location.data.attendees &&
                  location.data.attendees.preteens > 0
                    ? location.data.attendees.preteens
                    : 0
                }}
              </td>
              <td>
                {{
                  location.data.attendees && location.data.attendees.teens > 0
                    ? location.data.attendees.teens
                    : 0
                }}
              </td>
              <td>
                {{
                  location.data.attendees &&
                  location.data.attendees.youngAdults > 0
                    ? location.data.attendees.youngAdults
                    : 0
                }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUserStore } from "./../stores/userStore";

const userStore = useUserStore();

const { $firestore } = useNuxtApp();
const locations = reactive([]);

onMounted(() => {
  getLocations();
});

async function getLocations() {
  const locRef = await getDocs(
    // TODO: grab the year automatically
    query(collection($firestore, "locations"), where("years.2023", "==", true))
  );

  locRef.forEach((doc) => {
    const obj = { name: doc.id, data: doc.data() };
    locations.push(obj);
    userStore.locations = locations;
  });
}

function getLocationDetail(location) {
  console.log(location);
}
</script>

<style>
select {
  border: 1px solid black;
}
</style>
