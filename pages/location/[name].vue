<template>
  <v-container>
    <v-row>
      <v-btn class="ma-2" variant="text" @click="$router.push('/')">
        <v-icon start icon="mdi-arrow-left"></v-icon>Back
      </v-btn>
    </v-row>
    <v-row>
      <v-col
        ><h1>
          {{ location.name }}
        </h1>
        <div v-if="location.name" class="d-flex flex-column justify-start">
          <v-chip class="ma-2 pa-2"
            >Preteens: {{ location.data.attendees.preteens }}
          </v-chip>
          <v-chip class="ma-2 pa-2"
            >Teens: {{ location.data.attendees.teens }}
          </v-chip>
          <v-chip class="ma-2 pa-2"
            >Young Adults: {{ location.data.attendees.youngAdults }}
          </v-chip>
          <v-chip class="ma-2 pa-2"
            >Singles: {{ location.data.attendees.singles }}
          </v-chip>
          <v-chip class="ma-2 pa-2"
            >Total: {{ location.data.attendees.total }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Search Families (coming soon)</h3>
        <v-form action="">
          <v-text-field
            variant="outlined"
            disabled
            placeholder="Enter name"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>Familes Going</h3>
        <div v-if="!families.length">None yet</div>
        <div v-for="family in families" :key="family.emal">
          <div>{{ family.firstname }} {{ family.lastname }}</div>
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
  console.log("location page for ", locationPath.value);
  getLocationDetails();
  // getFamilies();
});

async function getLocationDetails() {
  console.log("gettingi details for ", locationPath.value);
  loading.value = true;
  const locRef = await getDocs(
    // TODO: grab the year automatically
    query(
      collection($firestore, "locations"),
      where("path", "==", locationPath.value)
    )
  );

  console.log(locRef);

  locRef.forEach((doc) => {
    console.log(doc.data());
    location.name = doc.id;
    location.data = doc.data();
    // locations.push(obj);
    // userStore.locations = locations;
  });
  loading.value = false;

  getFamilies();
}

async function getFamilies() {
  console.log("getting familes for ", location.name);
  const familesRef = await getDocs(
    // TODO: grab the year automatically
    query(
      collection($firestore, "users"),
      where("location", "==", location.name)
    )
  );

  console.log(familesRef);
  familesRef.forEach((doc) => {
    console.log(doc.data());
    families.value.push(doc.data());
  });
}
</script>
