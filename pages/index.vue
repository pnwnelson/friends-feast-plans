<template>
  <v-container>
    <!-- <v-row>
      <v-col>
        <div class="text-subtitle-1 mb-3">
          Want to see where your friends are thinking of going to the Feast?
          Choose a location below to see who's going there.
        </div>
      </v-col>
    </v-row> -->
    <v-row v-if="loading">
      <v-col class="d-flex justify-center">
        <v-progress-circular
          indeterminate
          model-value="20"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-if="!loading" no-gutters class="mx-0 px-0">
      <v-col>
        <v-banner
          sticky
          density="compact"
          lines="two"
          color="bg-blue-grey-lighten-5"
          class="d-flex d-sm-none my-4"
        >
          <v-banner-text>
            TA = Total Attendees, PT = Preteens, T = Teens, YA = Young Adults
          </v-banner-text>
        </v-banner>
        <v-table density="compact" fixed-header>
          <thead class="bg-blue-grey-lighten-5">
            <tr>
              <th class="text-left">
                <span>Location</span>
              </th>
              <th class="text-left">
                <span class="d-flex d-sm-none">TA</span>
                <span class="d-none d-sm-flex">Attendees</span>
              </th>
              <th class="text-left">
                <span class="d-flex d-sm-none">PT</span>
                <span class="d-none d-sm-flex">Pre-teens</span>
              </th>
              <th class="text-left">
                <span class="d-flex d-sm-none">T</span>
                <span class="d-none d-sm-flex">Teens</span>
              </th>
              <th class="text-left">
                <span class="d-flex d-sm-none">YA</span>
                <span class="d-none d-sm-flex">Young Adults</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(location, index) in locations"
              :key="index"
              @click="getLocationDetail(location)"
            >
              <td v-if="location.name">
                <span class="d-none d-sm-flex">{{ location.name }}</span>
                <span class="d-flex d-sm-none">{{ location.data.abbr }}</span>
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
const loading = ref(false);

onMounted(() => {
  getLocations();
});

async function getLocations() {
  loading.value = true;
  const locRef = await getDocs(
    // TODO: grab the year automatically
    query(collection($firestore, "locations"), where("years.2023", "==", true))
  );

  locRef.forEach((doc) => {
    const obj = { name: doc.id, data: doc.data() };
    locations.push(obj);
    userStore.locations = locations;
  });
  loading.value = false;
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
