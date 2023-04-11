<template>
  <v-container>
    <v-row>
      <v-col>
        <v-sheet width="300" class="mx-auto">
          <div class="text-subtitle-1 mb-3">
            Create an account to submit your Feast plans
          </div>

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
            ></v-text-field>
            <v-text-field
              v-model="password2"
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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// const { registerUser } = useFirebaseAuth(); // auto-imported
const valid = ref(false);
const email = ref(null);
const password1 = ref(null);
const password2 = ref(null);
const emailRules = reactive([
  (value: any) => {
    if (value) return true;

    return "Name is requred.";
  },
  (value: any) => {
    if (value?.length <= 10) return true;

    return "Name must be less than 10 characters.";
  },
]);
const passwordRules = reactive([
  (value: any) => {
    if (value) return true;

    return "A password is requred.";
  },
  (value: any) => {
    if (value === password2) return true;

    return "Passwords do not match";
  },
]);

const nuxtApp = useNuxtApp();
const { $auth } = useNuxtApp();

console.log($auth);

async function registerUser() {
  try {
    const { user } = await createUserWithEmailAndPassword(
      $auth,
      email.value,
      password1.value
    );

    console.log(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // handle error
    }
  }
}

// const nuxtApp = useNuxtApp();
// async function handleRegistration() {
//   await registerUser(creds.email, creds.password);
// }
</script>
