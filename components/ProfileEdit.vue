<template>
  <div>
    <v-form ref="form" validate-on="submit" @submit.prevent="submit">
      <v-text-field
        v-model="propsEdit.userData.firstname"
        label="First Name"
        :placeholder="propsEdit.userData.firstname"
        persistent-placeholder
        :rules="rules"
      ></v-text-field>
      <v-text-field
        v-model="propsEdit.userData.lastname"
        label="Last Name"
        :placeholder="propsEdit.userData.lastname"
        persistent-placeholder
        :rules="rules"
      ></v-text-field>
      <v-text-field
        v-model="propsEdit.userData.email"
        label="Email Address"
        :placeholder="propsEdit.userData.email"
        persistent-placeholder
      ></v-text-field>
      <v-select
        v-model="propsEdit.userData.location"
        label="Planned Feast Site"
        :items="userStore.locations"
        item-title="name"
        filled
        :rules="[(v) => !!v || 'Planned site is required']"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.maritalStatus"
        label="Marital Status"
        :items="maritalStatus"
        item-title="status"
      >
      </v-select>
      <v-select
        v-model="propsEdit.userData.adults"
        label="Adults"
        :items="[0, 1, 2]"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.preteens"
        label="Preteens"
        :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.teens"
        label="Teens"
        :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      ></v-select>
      <v-select
        v-model="propsEdit.userData.youngAdults"
        label="Young Adults"
        :items="[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      ></v-select>
      <div>Total Going: {{ total }}</div>
      <v-btn type="submit" block class="mt-2">Submit</v-btn>
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

async function submit() {
  // Check for location change. If location changes, decrement old location counts with pinia values
  if (
    userStore.userData.location &&
    userStore.userData.location !== propsEdit.value.userData.location
  ) {
    // Decrement pinia location counts in firestore
    const locRef = await doc(
      $firestore,
      "locations",
      userStore.userData.location
    );

    updateDoc(locRef, {
      "attendees.preteens": increment(-Math.abs(userStore.userData.preteens)),
      "attendees.teens": increment(-Math.abs(userStore.userData.teens)),
      "attendees.youngAdults": increment(
        -Math.abs(userStore.userData.youngAdults)
      ),
      "attendees.adults": increment(-Math.abs(userStore.userData.adults)),
      "attendees.total": increment(-Math.abs(oldTotal.value)),
    });

    // $firestore
    //   .collection()
    //   .doc()
    //   .update({
    //     attendees: {
    //       preteens: increment(-Math.abs(propsEdit.value.userData.preteens)),
    //       teens: increment(-Math.abs(propsEdit.value.userData.teens)),
    //       youngAdults: increment(
    //         -Math.abs(propsEdit.value.userData.youngAdults)
    //       ),
    //       adults: increment(-Math.abs(propsEdit.value.userData.adults)),
    //     },
    //   });

    if (locRef) {
      // go get new data
      userStore.getLocationData();
    }
  }

  // Update users profile
  const docRef = await doc($firestore, "users", userStore.id);
  updateDoc(docRef, {
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
  });

  if (docRef) {
    // go get new data
    userStore.getUserData();
  }

  // Increment location counts
  const locRef = await doc(
    $firestore,
    "locations",
    propsEdit.value.userData.location
  );
  updateDoc(locRef, {
    attendees: {
      preteens: increment(propsEdit.value.userData.preteens),
      teens: increment(propsEdit.value.userData.teens),
      youngAdults: increment(propsEdit.value.userData.youngAdults),
      adults: increment(propsEdit.value.userData.adults),
      total: increment(total.value),
    },
  });

  if (locRef) {
    // go get new data
    userStore.getLocationData();
  }

  // If no location change, change counts to location
  // Update firestore

  emit("submitted", true);
}
</script>
