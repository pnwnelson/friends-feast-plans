<template>
  <v-container>
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
        <!-- sortable table -->
        <v-data-table
          v-if="userStore.userData && userStore.userData.location"
          v-model:items-per-page="itemsPerPage"
          :headers="isMobile ? mobileHeaders : headers"
          :items="locations"
          item-value="name"
          class="elevation-1"
          density="compact"
          :class="{ mobile: isMobile }"
          @click:row="getLocationDetail"
        ></v-data-table>
        <!-- plain table preview -->
        <v-table
          v-if="
            !userStore.isAuthenticated ||
            (userStore.userData && !userStore.userData.location)
          "
          id="overlay"
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
            <tr v-for="(location, index) in locations" :key="index">
              <td v-if="location.name">
                <nuxt-link
                  class="text-decoration-none pointer"
                  @click="getLocationDetailPreview()"
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
        <div class="d-flex justify-center px-5">
          <v-card-text>
            Want to see more Feast sites? Please
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
      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <v-card-text>
            Want to see more Feast sites? Please
            <nuxt-link class="text-decoration-none" to="/login"
              >login</nuxt-link
            >
            or
            <nuxt-link class="text-decoration-none" to="/Register"
              >create an account</nuxt-link
            >
            and let us know where you plan to attend!
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="dialog = false"
              >Close Dialog</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { VDataTable } from "vuetify/labs/VDataTable";
import { useUserStore } from "./../stores/userStore";

const userStore = useUserStore();

const { $firestore } = useNuxtApp();
const locations = reactive([]);
const loading = ref(false);
const locPath = ref(null);
// const showBanner = ref(true);
const dismissBannerCookie = useCookie("bannerDismiss");
const isMobile = ref(false);
const locationQuery = ref(null);
const dialog = ref(false);

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
});

function dismissBanner() {
  dismissBannerCookie.value = "true";
  // showBanner.value = false;
}

async function getLocations() {
  loading.value = true;
  if (!userStore.userData || !userStore.userData.location) {
    console.log("shoul be limiting");
    locationQuery.value = query(
      collection($firestore, "locations"),
      where("years.2023", "==", true),
      limit(6)
    );
  } else {
    console.log("all locs");
    locationQuery.value = query(
      collection($firestore, "locations"),
      where("years.2023", "==", true)
    );
  }
  console.log(locationQuery.value);
  const locRef = await getDocs(
    // TODO: grab the year automatically
    locationQuery.value
  );

  locRef.forEach((doc) => {
    const obj = { name: doc.id, data: doc.data() };
    locations.push(obj);
    userStore.locations = locations;
  });
  loading.value = false;
}

function getLocationDetail(location, data) {
  return navigateTo(`/location/${data.item.props.title.data.path}`);
}

function getLocationDetailPreview() {
  // show alert
  dialog.value = true;
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

#overlay {
  position: relative;
}

#overlay::before {
  background-image: linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background-image: -moz-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background-image: -ms-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background-image: -o-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background-image: -webkit-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  content: "\00a0";
  height: 100%;
  position: absolute;
  width: 100%;
}
</style>
