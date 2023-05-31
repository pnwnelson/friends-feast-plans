<template>
  <v-container :class="{ 'w-50': $vuetify.display.lg }">
    <v-row>
      <v-btn class="ma-2" variant="text" @click="$router.push('/')">
        <v-icon start icon="mdi-arrow-left"></v-icon>Site List
      </v-btn>
    </v-row>
    <v-row v-if="loading">
      <v-col class="d-flex justify-center">
        <v-progress-circular
          indeterminate
          model-value="20"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2>
          {{ location.name }}
        </h2>
        <v-row>
          <v-col cols="12" sm="6">
            <div v-if="location.name" class="d-flex flex-column w-100">
              <v-chip class="my-2 pa-2" color="indigo">
                <span class="mr-1">Preteens (Ages 0.01-11):</span>
                <span class="font-weight-bold text-right">
                  {{ location.data.attendees.preteens }}</span
                >
              </v-chip>
              <v-chip class="my-2 pa-2" color="indigo">
                <span class="mr-1">Teens (Ages 12-18):</span>
                <span class="font-weight-bold">
                  {{ location.data.attendees.teens }}</span
                >
              </v-chip>
              <v-chip class="my-2 pa-2" color="indigo">
                <span class="mr-1">Young Adults (Ages 19-34):</span>
                <span class="font-weight-bold">
                  {{ location.data.attendees.youngAdults }}</span
                >
              </v-chip>
              <v-chip class="my-2 pa-2" color="indigo">
                <span class="mr-1">Singles (Age 35+):</span>
                <span class="font-weight-bold">
                  {{ location.data.attendees.singles }}</span
                >
              </v-chip>
              <v-chip class="my-2 pa-2" color="indigo">
                <span class="mr-1">Total:</span>
                <span class="font-weight-bold">{{
                  location.data.attendees.total
                }}</span>
              </v-chip>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <h3>Groups</h3>
            <div v-for="cog in location.data.cogs" :key="cog">
              <v-chip class="ma-1 pa-2">
                <span>{{ cog }}</span>
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- Browse and Search Attendees -->
    <v-row>
      <v-col>
        <h4 class="mb-2">Browse and Search Attendees</h4>
        <div v-if="userStore.userData && userStore.userData.location">
          <h5 class="mb-2">Search (coming soon)</h5>
          <div class="d-flex flex-column justify-start">
            <v-form action="">
              <v-text-field
                variant="outlined"
                disabled
                placeholder="Enter name"
              ></v-text-field>
            </v-form>
          </div>
          <div>
            <div v-if="families.length">
              <v-icon size="small" color="green" icon="mdi-home"></v-icon>
              <span class="text-caption"> - Housing is booked</span>
            </div>
            <div v-for="family in families" :key="family.emal">
              <div class="d-flex flex-row align-center">
                <span>{{ family.firstname }} {{ family.lastname }}</span>
                <span
                  v-if="family.locationStatus === 'Housing booked'"
                  class="ml-1"
                  ><v-icon size="small" color="green" icon="mdi-home"></v-icon
                ></span>
              </div>
            </div>
            <div v-if="!families.length">No families yet</div>
          </div>
        </div>
        <div v-else class="pa-3 bg-blue-grey-lighten-5">
          <p>
            In order to see which families are currently planning to attend this
            location, please
            <nuxt-link to="/login" class="text-decoration-none"
              >login</nuxt-link
            >
            and submit where you plan to attend. This app is helpful only if
            everyone participates! Thank you!
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUserStore } from "./../../stores/userStore";

const route = useRoute();
// const location = ref(route.params.name.replace(/-/g, " - "));
const locationPath = ref(route.params.name);
const location = reactive({
  name: "",
  data: {},
});
const families = ref([]);
const loading = ref(false);
const userStore = useUserStore();
const { $firestore } = useNuxtApp();

onMounted(() => {
  getLocationDetails();
  // getFamilies();
});

async function getLocationDetails() {
  loading.value = true;
  const locRef = await getDocs(
    // TODO: grab the year automatically
    query(
      collection($firestore, "locations"),
      where("path", "==", locationPath.value)
    )
  );

  locRef.forEach((doc) => {
    location.name = doc.id;
    location.data = doc.data();
    // locations.push(obj);
    // userStore.locations = locations;
  });
  loading.value = false;

  if (userStore.userData && userStore.userData.location) {
    getFamilies();
  }
}

async function getFamilies() {
  const familesRef = await getDocs(
    // TODO: grab the year automatically
    query(
      collection($firestore, "users"),
      where("location", "==", location.name)
    )
  );

  familesRef.forEach((doc) => {
    families.value.push(doc.data());
  });
}
</script>
