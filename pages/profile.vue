<template>
  <v-container :class="{ 'w-50': $vuetify.display.md }">
    <v-row>
      <v-col>
        <h2>Profile</h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right">
        <v-btn
          class="bg-blue-grey-lighten-5 mr-2"
          @click="editingProfile = !editingProfile"
          >{{ !editingProfile ? "EDIT" : "CANCEL" }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="text-caption">
          Editing this form will update your selected planned Feast site's
          attendance count in this app. Please tell us how many adults,
          preteens, teens and young adults that will be traveling with you. If
          someone who is traveling with you already submitted their own form (or
          plans to), please do not include them. Remember to update your profile
          if your plans change!
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div v-if="editingProfile">
          <ProfileEdit :userData="userStore.userData" @submitted="onSubmit" />
        </div>
        <div v-if="!editingProfile">
          <v-form ref="form">
            <v-text-field
              v-model="userStore.userData.firstname"
              label="First Name"
              disabled
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.lastname"
              label="Last Name"
              disabled
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.email"
              label="Email Address"
              disabled
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.location"
              label="Planned Feast Site"
              persistent-placeholder
              disabled
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.maritalStatus"
              label="Marital Status"
              persistent-placeholder
              disabled
              variant="outlined"
            >
            </v-text-field>
            <v-text-field
              v-model="userStore.userData.adults"
              label="Adults (Ages 35+)"
              persistent-placeholder
              disabled
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.preteens"
              label="Preteens (Ages 0.01-11)"
              persistent-placeholder
              disabled
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.teens"
              label="Teens (Ages 12-18)"
              persistent-placeholder
              disabled
              variant="outlined"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.youngAdults"
              label="Young Adults (Ages 19-34)"
              persistent-placeholder
              disabled
              variant="outlined"
            ></v-text-field>
            <div>Total: {{ total }}</div>
            <v-btn v-if="editingProfile" type="submit" block class="mt-2"
              >Submit</v-btn
            >
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "./../stores/userStore";

const { $firestore } = useNuxtApp();
const userStore = useUserStore();

const editingProfile = ref(false);

const total = computed(() => {
  return (
    userStore.userData.adults +
    userStore.userData.preteens +
    userStore.userData.teens +
    userStore.userData.youngAdults
  );
});

onMounted(() => {
  userStore.getUserData();
});

function onSubmit() {
  editingProfile.value = false;
}
</script>
<style scoped></style>
