<template>
  <v-container>
    <v-row>
      <v-btn class="ma-2" variant="text" @click="navigateTo('/')">
        <v-icon start icon="mdi-arrow-left"></v-icon>Site List
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <h2>FAQs</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <template v-for="faq in faqs" :key="faq.id">
          <!-- <v-btn
            icon="mdi-chevron-right"
            :class="{ 'open-q': faq.show }"
            @click="faq.show = !faq.show"
          ></v-btn> -->
          <div class="mb-2">
            <h4 v-html="faq.q"></h4>
            <transition name="slide-fade">
              <p v-html="faq.a"></p>
            </transition>
          </div>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
const faqs = reactive([
  {
    id: 1,
    q: "What Feast site do I choose if the one we plan on attending isn't listed?",
    a: `Select the site name of "Other". Once you select that name, an additional text field will appear for you to enter the name of the location. We will go through that list, create an entry for that location and update your profile.`,
    show: false,
  },
  {
    id: 2,
    q: "Do I have to submit my name?",
    a: `We at least need you to submit a last name. This site only works as intended if your friends can see your name. No personal information is used for anything else.`,
    show: false,
  },
  {
    id: 3,
    q: "Why aren't all the Feast sites of all the COG's listed",
    a: `There are A LOT. Just saving you from a scrolling for a couple hours to find your site, especially if a lot of them aren't being selected. But, if your site isn't listed, just choose "Other" and submit your site and we'll work on getting it listed.`,
    show: false,
  },
  {
    id: 2,
    q: "What if my family members wants to use the app?",
    a: `At this time, we don't have a way to connect different email addresses to the same account, so you'll have to share your credentials with your family members.`,
    show: false,
  },
  {
    id: 3,
    q: "Why isn't this app perfect?",
    a: `What do you mean it's not perfect?? Well, it was put together rather quickly. Beerly had thyme to spelle chech. We'll see how useful it is to everyone after this first year. If it's useful we'll try to make it better for next year.`,
    show: false,
  },
]);
</script>

<style scoped>
.open-q {
  -ms-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
