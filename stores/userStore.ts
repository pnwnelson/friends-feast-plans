import { defineStore } from "pinia";
import {
  query,
  where,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

export const useUserStore = defineStore(
  "user",
  () => {
    // other options...
    const id = ref(null);
    const isAuthenticated = ref(false);
    const locations = ref([]);
    const userData = ref(null);
    const error = ref(null);

    function resetTheThings() {
      id.value = null;
      isAuthenticated.value = false;
      locations.value = [];
      userData.value = null;
      error.value = null;
    }

    async function getUserData() {
      console.log("hitting action", id);
      const { $firestore } = useNuxtApp();
      const store = useUserStore();

      const docRef = doc($firestore, "users", id.value);
      const docSnap = await getDoc(docRef);
      console.log("getting here?");

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        userData.value = docSnap.data();
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }

    async function getLocationData() {
      const { $firestore } = useNuxtApp();
      const store = useUserStore();
      const locRef = await getDocs(
        // TODO: grab the year automatically
        query(
          collection($firestore, "locations"),
          where("years.2023", "==", true)
        )
      );

      const locArray = [];

      locRef.forEach((doc) => {
        const obj = { name: doc.id, data: doc.data() };
        locArray.push(obj);
        locations.value = locArray;
      });
    }

    return {
      id,
      isAuthenticated,
      locations,
      userData,
      error,
      resetTheThings,
      getUserData,
      getLocationData,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
