<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet width="300" class="mx-auto">
          <div class="text-subtitle-1 mb-3">Login</div>

          <v-form validate-on="submit" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              required
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show1 ? 'text' : 'password'"
              @click:append="show1 = !show1"
            ></v-text-field>
            <v-btn type="submit" block class="mt-2">Submit</v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDoc, doc } from "firebase/firestore";
import { useUserStore } from "./../stores/userStore";
const store = useUserStore();
const { $auth } = useNuxtApp();
const { $firestore } = useNuxtApp();

const show1 = ref(false);
const valid = ref(false);
const email = ref("");
const password = ref("");
const emailRules = reactive([
  (value: any) => {
    if (value) return true;

    return "Email is requred.";
  },
]);
const passwordRules = reactive([
  (value: any) => {
    if (value) return true;

    return "A password is requred.";
  },
]);

async function handleLogin() {
  try {
    const { user } = await signInWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );

    console.log(user);
    store.isAuthenticated = true;
    // Get user info from Firestore
    const docRef = doc($firestore, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      store.userData = docSnap.data();
      store.id = user.uid;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    navigateTo("/");
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      // handle error
    }
  }
}
</script>
