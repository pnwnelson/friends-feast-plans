<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>About This Site</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="mb-2">
          This site came out of the desire to know where the different groups of
          people (preteens, teens, young adults, etc) might be planning to
          attend the Feast of Tabernacles each year.
        </p>
        <p class="mb-2">
          **This site is not affliated with any particular Church of God
          organization.**
        </p>
        <p>Please use the contact form below for any questions.</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <form
          action="/thanks"
          name="contact"
          method="post"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>Don’t fill this out: <input name="bot-field" /></label>
          </p>
          <v-text-field
            v-model="name"
            :rules="rules"
            label="Name"
            required
            persistent-placeholder
          ></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRule"
            :counter="10"
            label="Email"
            required
            persistent-placeholder
          ></v-text-field>
          <v-textarea
            v-model="body"
            label="How can we help?"
            :rules="rules"
            required
            persistent-placeholder
          ></v-textarea>
          <v-btn type="submit" block class="mt-2 mb-4 bg-indigo-lighten-2">
            <span v-if="!loading">Submit</span>
            <v-progress-circular
              v-if="loading"
              indeterminate
              model-value="20"
            ></v-progress-circular>
          </v-btn>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, ComputedRef } from "vue";

const name = ref(null);
const email = ref(null);
const body = ref(null);

const rules = [(v) => !!v || "Field is required"];

const emailRule = [
  (v) =>
    !v ||
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    "E-mail must be valid",
];
</script>
