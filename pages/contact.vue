<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Contact</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-btn class="ma-2" variant="text" @click="backToHome">
        <v-icon start icon="mdi-arrow-left"></v-icon>Site List
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-form
          ref="contactForm"
          name="ffp-contact-form"
          method="post"
          action="/contact-form"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          @submit="submit($event)"
        >
          <v-text-field
            v-model="name"
            name="name"
            label="Name"
            persistent-placeholder
            density="compact"
            :rules="rules"
          ></v-text-field>
          <v-text-field
            v-model="emailAddress"
            name="email"
            type="email"
            label="Email Address"
            persistent-placeholder
            density="compact"
            :rules="rules"
          ></v-text-field>
          <v-textarea
            v-model="text"
            name="text"
            label="Talk to us"
            persistent-placeholder
            :rules="rules"
          ></v-textarea>
          <v-btn color="primary" type="submit" block class="mt-2 mb-4">
            <span v-if="!loading">Submit</span>
            <v-progress-circular
              v-if="loading"
              indeterminate
              model-value="20"
            ></v-progress-circular>
          </v-btn>
          <input value="ffp-contact-form" name="form-name" type="hidden" />
          <p hidden>
            <label><input name="bot-field" /></label>
          </p>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from "vue";

const name = ref(null);
const emailAddress = ref(null);
const text = ref(null);
const loading = ref(false);
const contactForm = ref(null);

const rules = [(v) => !!v || "Field is required"];

function backToHome() {
  navigateTo("/");
}

async function submit(e) {
  const valid = await contactForm.value.validate();
  if (!valid.valid) {
    return;
  }
  loading.value = true;
  const body: any = {
    name: name.value,
    email: emailAddress.value,
    text: text.value,
  };
  fetch("/contact-form", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })
    .then((res) => {
      loading.value = true;
      if (res.status === 200) {
        navigateTo("/thanks");
      }
    })
    .catch((error) => {
      loading.value = true;
      console.error(error);
    });
}
</script>

<style>
.border {
  border: 1px solid black;
}
</style>
