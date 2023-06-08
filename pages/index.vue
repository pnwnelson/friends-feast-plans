<template>
  <v-container :class="{ 'w-50': $vuetify.display.lg }">
    <v-row>
      <v-col>
        <v-banner
          v-if="!dismissBannerCookie"
          sticky
          density="compact"
          class="bg-blue-grey-lighten-1 mb-2"
        >
          <template #actions>
            <v-btn @click="dismissBanner">Dismiss</v-btn>
          </template>
          <v-banner-text>
            Welcome! This app is for the purpose of helping families find out
            where their friends might be planning to go to the Feast. Or maybe
            to find out where all the teens might be! Please participate by
            signing up, editing your profile and submitting your plans!
          </v-banner-text>
        </v-banner>
      </v-col>
    </v-row>
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
          class="d-flex d-sm-none my-4 bg-blue-grey-lighten-5"
        >
          <v-banner-text>
            TA = Total Attendees, PT = Preteens, T = Teens, YA = Young Adults, S
            = Singles
          </v-banner-text>
        </v-banner>
        <p
          v-if="userStore.userData && userStore.userData.location"
          class="text-right text-caption text-disabled"
        >
          *Sort by clicking on a column header
        </p>
        <!-- sortable table -->
        <v-data-table
          v-if="userStore.userData && userStore.userData.location"
          v-model:items-per-page="itemsPerPage"
          v-model:sort-by="sortBy"
          :headers="isMobile ? mobileHeaders : headers"
          :items="userStore.locations"
          item-value="name"
          class="elevation-1"
          hover
          height="100vh"
          fixed-header
          density="compact"
          :class="{ mobile: isMobile }"
          @click:row="getLocationDetail"
        >
        </v-data-table>
        <!-- <template #item.name="{ item }">
          <v-chip :color="green" class="d-flex">
            <v-btn>{{ item.columns.name }}</v-btn>
          </v-chip>
        </template> -->
        <!-- plain table preview -->
        <h4
          v-if="
            !userStore.isAuthenticated ||
            (userStore.userData && !userStore.userData.location)
          "
          class="my-2 text-center"
        >
          Here's a sample of 5 random Feast sites
        </h4>
        <v-table
          v-if="
            !userStore.isAuthenticated ||
            (userStore.userData && !userStore.userData.location)
          "
          density="compact"
          fixed-header
        >
          <thead>
            <tr class="bg-blue-grey-lighten-4">
              <th class="text-left bg-blue-grey-lighten-4">
                <span>Location</span>
              </th>
              <th class="text-left bg-blue-grey-lighten-4">
                <span class="d-flex d-sm-none">TA</span>
                <span class="d-none d-sm-flex">Attendees</span>
              </th>
              <th class="text-left bg-blue-grey-lighten-4">
                <span class="d-flex d-sm-none">PT</span>
                <span class="d-none d-sm-flex">Pre-teens</span>
              </th>
              <th class="text-left bg-blue-grey-lighten-4">
                <span class="d-flex d-sm-none">T</span>
                <span class="d-none d-sm-flex">Teens</span>
              </th>
              <th class="text-left bg-blue-grey-lighten-4">
                <span class="d-flex d-sm-none">YA</span>
                <span class="d-none d-sm-flex">Young Adults</span>
              </th>
              <th class="text-left bg-blue-grey-lighten-4">
                <span class="d-flex d-sm-none">S</span>
                <span class="d-none d-sm-flex">Singles</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(location, index) in randomLocationList" :key="index">
              <td v-if="location.name">
                <nuxt-link
                  class="pointer"
                  :to="'/location/' + location.data.path"
                >
                  <span class="d-none d-sm-flex">{{ location.name }}</span>
                  <span class="d-flex d-sm-none">{{ location.data.abbr }}</span>
                </nuxt-link>
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
              <td>
                {{
                  location.data.attendees && location.data.attendees.singles > 0
                    ? location.data.attendees.singles
                    : 0
                }}
              </td>
            </tr>
          </tbody>
        </v-table>
        <div
          v-if="!userStore.userData || !userStore.userData.location"
          class="d-flex text-center px-3"
        >
          <v-card-text>
            Want to see all the Feast sites? Please
            <nuxt-link class="text-decoration-none" to="/login"
              >login</nuxt-link
            >
            or
            <nuxt-link class="text-decoration-none" to="/Register"
              >create an account</nuxt-link
            >
            and let us know where you plan to attend by updating your profile!
          </v-card-text>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { VDataTable } from "vuetify/labs/VDataTable";
import cloneDeep from "lodash/cloneDeep";
import { useUserStore } from "./../stores/userStore";

// definePageMeta({
//   isFromLocationPage: (route) => {
//     // Check if the id is made up of digits
//     return route.from;
//     // return /^\d+$/.test(route.params.id);
//   },
// });

const userStore = useUserStore();

const route = useRoute();

const { $firestore } = useNuxtApp();
const locations = reactive([]);
const randomLocationList = reactive([]);
const loading = ref(false);
const locPath = ref(null);
const dismissBannerCookie = useCookie("bannerDismiss", {
  maxAge: 60 * 60 * 24 * 7 * 4, // one month
});
const isMobile = ref(false);
const locationQuery = ref(null);
const sortBy = ref([{ key: "name", order: "asc" }]);
const sortDesc = ref(false);

const itemsPerPage = -1;
const headers = [
  {
    title: "Site",
    align: "start",
    sortable: true,
    key: "name",
  },
  { title: "Attendees", align: "end", key: "data.attendees.total" },
  { title: "Preteens", align: "end", key: "data.attendees.preteens" },
  { title: "Teens", align: "end", key: "data.attendees.teens" },
  { title: "Young Adults", align: "end", key: "data.attendees.youngAdults" },
  { title: "Singles", align: "end", key: "data.attendees.singles" },
];

const mobileHeaders = [
  {
    title: "Site",
    align: "start",
    sortable: true,
    key: "data.abbr",
  },
  { title: "TA", align: "end", key: "data.attendees.total" },
  { title: "PT", align: "end", key: "data.attendees.preteens" },
  { title: "T", align: "end", key: "data.attendees.teens" },
  { title: "YA", align: "end", key: "data.attendees.youngAdults" },
  { title: "S", align: "end", key: "data.attendees.singles" },
];

onMounted(() => {
  getLocations();
  onResize();
  // console.log(route.matched);
});

function dismissBanner() {
  dismissBannerCookie.value = "true";
  // showBanner.value = false;
}

async function getLocations() {
  loading.value = true;

  locationQuery.value = query(
    collection($firestore, "locations"),
    where("years.2023", "==", true)
  );

  const locRef = await getDocs(
    // TODO: grab the year automatically
    locationQuery.value
  );

  locRef.forEach((doc) => {
    const obj = { name: doc.id, data: doc.data() };
    locations.push(obj);
    userStore.locations = locations;
  });

  makeRandomLocationList();

  loading.value = false;
}

function makeRandomLocationList() {
  const locationClone = cloneDeep(locations);
  const test = locationClone.sort(() => 0.5 - Math.random()).slice(0, 5);
  test.forEach((loc) => {
    randomLocationList.push(loc);
  });
}

function getLocationDetail(location, data) {
  return navigateTo(`/location/${data.item.props.title.data.path}`);
}

function onResize() {
  if (window.innerWidth < 769) isMobile.value = true;
  else isMobile.value = false;
}
</script>

<style>
select {
  border: 1px solid black;
}

.mobile {
  color: #333;
}

@media screen and (max-width: 768px) {
  .v-data-table th {
    font-size: 14px;
  }

  .v-data-table td {
    font-size: 14px;
  }

  .v-table > .v-table__wrapper > table > tbody > tr > td {
    padding: 0 8px;
  }

  .v-table > .v-table__wrapper > table > thead > tr > th {
    padding: 0 8px;
  }

  .v-table > .v-table__wrapper > table > thead {
    background-color: "red" !important;
  }
}
.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}

.pointer {
  cursor: pointer;
}
</style>
