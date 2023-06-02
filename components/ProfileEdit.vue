<template>
  <div>
    <v-form ref="profileForm" validate-on="submit" @submit.prevent="submit">
      <v-text-field
        v-model="propsEdit.userData.email"
        label="Email Address"
        :placeholder="propsEdit.userData.email"
        density="compact"
        persistent-placeholder
        disabled
      ></v-text-field>
      <v-text-field
        v-model="propsEdit.userData.firstname"
        label="First Name"
        :placeholder="propsEdit.userData.firstname"
        persistent-placeholder
        density="compact"
      ></v-text-field>
      <v-text-field
        v-model="propsEdit.userData.lastname"
        label="Last Name"
        :placeholder="propsEdit.userData.lastname"
        persistent-placeholder
        density="compact"
        :rules="rules"
      ></v-text-field>
      <p class="pt-1 text-caption text-medium-emphasis">
        Select a site so you can see the full list on the home page
      </p>
      <v-select
        v-model="propsEdit.userData.location"
        label="Planned Feast Site"
        :items="userStore.locations"
        item-title="name"
        filled
        hint="Choose the site that you currently plan on attending"
        density="compact"
        :rules="[(v) => !!v || 'Planned site is required']"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.locationStatus"
        label="How solid are your plans?"
        :items="['No housing booked', 'Housing booked']"
        density="compact"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.maritalStatus"
        label="Marital Status"
        :items="['Single (Age 35+)', 'Married']"
        item-title="status"
        density="compact"
      >
      </v-select>
      <v-alert
        v-if="userStore.error"
        color="error"
        density="compact"
        closable
        :text="userStore.error"
        class="mb-2"
        @click="clearError"
      ></v-alert>
      <p class="pa-2 text-caption text-medium-emphasis">
        How many of each in your group will be attending?
      </p>
      <v-select
        v-model="propsEdit.userData.adults"
        label="Adults (Ages 35+)"
        :items="[0, 1, 2, 3, 4, 5, 6, 7]"
        density="compact"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.preteens"
        label="Preteens (Ages 0.01-11)"
        :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        density="compact"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.teens"
        label="Teens (Ages 12-18)"
        :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        density="compact"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.youngAdults"
        label="Young Adults (Ages 19-34)"
        :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        density="compact"
      ></v-select>
      <div>Total Going: {{ total }}</div>
      <v-btn type="submit" block class="mt-2 mb-4 bg-indigo-lighten-2">
        <span v-if="!loading">Save</span>
        <v-progress-circular
          v-if="loading"
          indeterminate
          model-value="20"
        ></v-progress-circular>
      </v-btn>
    </v-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, ComputedRef } from "vue";
import cloneDeep from "lodash/cloneDeep";
import { updateDoc, collection, doc, increment } from "firebase/firestore";

import { useUserStore } from "../stores/userStore";

const { $firestore } = useNuxtApp();
const userStore = useUserStore();
const emit = defineEmits(["submitted"]);

const props = defineProps<{
  userData: object;
}>();

const propsEdit = ref(cloneDeep(props));
const loading = ref(false);
const profileForm = ref(null);

// const rules = {
//   select: [(v) => !!v || "Location is required"],
//   required: [(value) => !!value || "Field is required"],
// };

const rules = [(v) => !!v || "Field is required"];

const total = computed(() => {
  return (
    propsEdit.value.userData.adults +
    propsEdit.value.userData.preteens +
    propsEdit.value.userData.teens +
    propsEdit.value.userData.youngAdults
  );
});

const oldTotal = computed(() => {
  return (
    userStore.userData.adults +
    userStore.userData.preteens +
    userStore.userData.teens +
    userStore.userData.youngAdults
  );
});

const maritalStatus = [
  {
    status: "Single",
  },
  {
    status: "Married",
  },
];

const form = ref(null);

function clearError() {
  userStore.error = null;
}

async function decrementOldLocationCounts() {
  const singleCount = userStore.userData.maritalStatus === "Single" ? 1 : 0;

  try {
    const locDecRef = doc($firestore, "locations", userStore.userData.location);

    const update: any = await updateDoc(locDecRef, {
      "attendees.preteens": increment(-Math.abs(userStore.userData.preteens)),
      "attendees.teens": increment(-Math.abs(userStore.userData.teens)),
      "attendees.youngAdults": increment(
        -Math.abs(userStore.userData.youngAdults)
      ),
      "attendees.adults": increment(-Math.abs(userStore.userData.adults)),
      "attendees.singles": increment(-Math.abs(singleCount)),

      "attendees.total": increment(-Math.abs(oldTotal.value)),
    });

    if (update) {
      return true;
    }
  } catch (e) {
    console.error("Failed to decrement old location count", e);
    return false;
  }
}

async function decrementSameLocationCounts() {
  const singleCount = userStore.userData.maritalStatus === "Single" ? 1 : 0;

  try {
    const locDecRef = doc(
      $firestore,
      "locations",
      propsEdit.value.userData.location
    );
    const update: any = await updateDoc(locDecRef, {
      "attendees.preteens": increment(-Math.abs(userStore.userData.preteens)),
      "attendees.teens": increment(-Math.abs(userStore.userData.teens)),
      "attendees.youngAdults": increment(
        -Math.abs(userStore.userData.youngAdults)
      ),
      "attendees.adults": increment(-Math.abs(userStore.userData.adults)),
      "attendees.singles": increment(-Math.abs(singleCount)),

      "attendees.total": increment(-Math.abs(oldTotal.value)),
    });

    if (update) {
      return true;
    }
  } catch (e) {
    console.error("Failed decrementing same location count", e);
    return false;
  }
}

async function incrementLocationCounts() {
  const singleCount =
    propsEdit.value.userData.maritalStatus === "Single" ? 1 : 0;

  try {
    const locIncRef = doc(
      $firestore,
      "locations",
      propsEdit.value.userData.location
    );
    const update: any = await updateDoc(locIncRef, {
      "attendees.preteens": increment(propsEdit.value.userData.preteens),
      "attendees.teens": increment(propsEdit.value.userData.teens),
      "attendees.youngAdults": increment(propsEdit.value.userData.youngAdults),
      "attendees.adults": increment(propsEdit.value.userData.adults),
      "attendees.singles": increment(singleCount),
      "attendees.total": increment(total.value),
    });
    if (update) {
      return true;
    }
  } catch (e) {
    console.error("Failed increment update", e);
    return false;
  }
}

async function submit() {
  userStore.error = null;
  // Validate
  const valid = await profileForm.value.validate();
  if (!valid.valid) {
    return;
  }

  if (total.value === 0) {
    userStore.error =
      "You must enter at least one adult, preteen, teen or young adults";
    return;
  }

  loading.value = true;
  // If this is the initial location selection, increment
  if (!userStore.userData.location) {
    await incrementLocationCounts();
  }

  // If location changes, decrement old location counts with pinia values
  if (
    userStore.userData.location &&
    userStore.userData.location !== propsEdit.value.userData.location
  ) {
    // Decrement pinia location counts in firestore
    await decrementOldLocationCounts();
    setTimeout(() => {
      incrementLocationCounts();
    }, 2000);
  }

  // If location doesn't change, decrement the same location in case the they are changing counts for the same location.
  // Otherwise, the increment will keep adding up and not taking away.
  if (
    userStore.userData.location &&
    userStore.userData.location === propsEdit.value.userData.location
  ) {
    // Clear the counts
    await decrementSameLocationCounts();
    // decrementSameLocationCounts();
    setTimeout(() => {
      incrementLocationCounts();
    }, 2000);
  }

  try {
    // Update users profile
    const docRef = doc($firestore, "users", userStore.id);
    const updateUser: any = await updateDoc(docRef, {
      firstname: propsEdit.value.userData.firstname,
      lastname: propsEdit.value.userData.lastname,
      email: propsEdit.value.userData.email,
      maritalStatus: propsEdit.value.userData.maritalStatus,
      isSingle: propsEdit.value.userData.maritalStatus === "Single",
      adults: propsEdit.value.userData.adults,
      preteens: propsEdit.value.userData.preteens,
      teens: propsEdit.value.userData.teens,
      youngAdults: propsEdit.value.userData.youngAdults,
      location: propsEdit.value.userData.location,
      locationStatus: propsEdit.value.userData.locationStatus,
    });
  } catch (e) {
    console.error("Failed to update userData", e);
  }

  await userStore.getUserData();

  const locatonPath = userStore.locations.filter((loc) => {
    return loc.name === propsEdit.value.userData.location;
  });

  emit("submitted", true);
  loading.value = false;
  navigateTo(`/location/${locatonPath[0].data.path}`);
}
</script>
