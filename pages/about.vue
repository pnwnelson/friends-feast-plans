<template>
  <v-container>
    <v-row>
      <v-btn class="ma-2" variant="text" @click="backToHome">
        <v-icon start icon="mdi-arrow-left"></v-icon>Site List
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <h2>About This App</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="mb-2">Greetings!</p>
        <v-alert
          class="mb-4"
          title="Hebrews 10:24-25"
          text="And let us consider one another in order to stir up love and good
          works, not forsaking the assembling of ourselves together, as is
          the manner of some, but exhorting one another, and so much the more as
          you see the Day approaching."
          variant="outlined"
        ></v-alert>
        <p class="mb-4">
          This site was created out of the desire to quickly know where the
          different age groups of people (preteens, teens, young adults, etc)
          might be planning to attend the Feast of Tabernacles each year with
          the Churches of God (those which broke off from the Worldwide Church
          of God). We hope you find this site useful in getting together will
          similar age groups for the Feast of Tabernacles.
        </p>
        <p class="mb-2">
          We curated the list of sites from
          <a href="http://www.feastgoer.org/" target="bob_dole">Feastgoers</a>
          and various Church of God organization websites. However, this site is
          not affliated with Feastgoers or any particular Church of God
          organization.
        </p>
        <p class="mb-2">
          Please use the <nuxt-link to="/contact">contact form</nuxt-link> to
          let us know of any issues with this app.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
function backToHome() {
  navigateTo("/");
}
</script>
