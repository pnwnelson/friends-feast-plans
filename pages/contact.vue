<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Contact</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form
          name="contact"
          method="POST"
          action="/thanks"
          data-netlify="true"
          netlify-honeypot="bot-field"
          @submit="submit($event)"
        >
          <input v-model="name" type="text" name="name" class="border" />
          <input
            v-model="emailAddress"
            type="email"
            name="email"
            class="border"
          />
          <input v-model="text" type="textarea" name="text" class="border" />
          <input type="submit" />
          <input value="contact" name="form-name" type="hidden" />
          <p hidden>
            <label><input name="bot-field" /></label>
          </p>
        </form>
        <!-- <v-form
          name="ffp-contact-form"
          method="post"
          action="/contact-form"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          @submit="submit($event)"
        >
          <v-text-field
            v-model="name"
            label="Name"
            persistent-placeholder
            density="compact"
          ></v-text-field>
          <v-text-field
            v-model="emailAddress"
            type="email"
            label="Email Address"
            persistent-placeholder
            density="compact"
          ></v-text-field>
          <v-textarea
            v-model="text"
            label="Talk to us"
            persistent-placeholder
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
        </v-form> -->
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
const name = ref(null);
const emailAddress = ref(null);
const text = ref(null);
const loading = ref(false);

function submit(e) {
  console.log("submitted", e);
  e.preventDefault();
}
</script>

<style>
.border {
  border: 1px solid black;
}
</style>
