<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet width="300" class="mx-auto">
          <div class="text-subtitle-1 mb-3">
            Create an account to submit your Feast plans
          </div>

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
import { useUserStore } from "./../stores/userStore";
const store = useUserStore();

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

const { $auth } = useNuxtApp();

signInWithEmailAndPassword($auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

async function handleLogin() {
  try {
    const { user } = await signInWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );

    console.log(user);
    store.isAuthenticated = true;
    navigateTo("/");
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      // handle error
    }
  }
}
</script>
