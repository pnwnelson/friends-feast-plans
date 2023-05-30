<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet width="300" class="mx-auto">
          <div class="text-subtitle-1 mb-3">
            Create an account to submit your Feast plans
          </div>
          <v-alert
            v-if="store.error"
            color="error"
            closable
            :text="store.error"
            class="mb-2"
            @click="clearError"
          ></v-alert>
          <v-form validate-on="submit" @submit.prevent="registerUser">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="password1"
              :rules="passwordRules"
              label="Password"
              required
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
              v-model="password2"
              label="Password"
              required
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              @click:append="show2 = !show2"
            ></v-text-field>
            <v-btn type="submit" block class="mt-2 bg-blue-grey-lighten-1"
              >Submit</v-btn
            >
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, collection, doc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "./../stores/userStore";
import User from "./../content/user";

const store = useUserStore();

// const { registerUser } = useFirebaseAuth(); // auto-imported
const show1 = ref(false);
const show2 = ref(false);
const valid = ref(false);
const email = ref(null);
const password1 = ref(null);
const password2 = ref(null);
const emailRules = reactive([
  (value: any) => {
    if (value) return true;

    return "Name is requred.";
  },
]);
const passwordRules = reactive([
  (value: any) => {
    if (value) return true;

    return "A password is requred.";
  },
  (value: any) => {
    if (value === password2.value) return true;

    return "Passwords do not match";
  },
]);

const { $auth } = useNuxtApp();
const { $firestore } = useNuxtApp();
const { $realtimeDB } = useNuxtApp();

onMounted(() => {
  store.error = null;
});

function clearError() {
  store.error = null;
}

async function registerUser() {
  store.error = null;
  try {
    const { user } = await createUserWithEmailAndPassword(
      $auth,
      email.value,
      password1.value
    );

    store.isAuthenticated = true;
    store.email = user.email;
    store.id = user.uid;

    createUserProfile(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // handle error
      store.error = error.message;
    }
  }
}

async function createUserProfile(user: any) {
  const newUser = new User(user); // eventually use a class?
  try {
    const docRef = await doc($firestore, "users", user.uid);
    setDoc(
      docRef,
      {
        email: user.email,
        firstname: null,
        lastname: null,
        location: null,
        isSingle: false,
        maritalStatus: null,
        preteens: 0,
        teens: 0,
        youngAdults: 0,
        adults: 0,
        parents: 0,
      },
      { merge: true }
    );

    if (docRef) {
      // get userData
      const docRef = doc($firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        store.userData = docSnap.data();
      }
      navigateTo("/profile");
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// const nuxtApp = useNuxtApp();
// async function handleRegistration() {
//   await registerUser(creds.email, creds.password);
// }
</script>
