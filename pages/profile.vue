<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Profile</h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right">
        <v-btn @click="editingProfile = !editingProfile">{{
          !editingProfile ? "EdIT" : "CANCEL"
        }}</v-btn>
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
              persistent-placeholder
              readonly
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.lastname"
              label="Last Name"
              persistent-placeholder
              readonly
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.email"
              label="Email Address"
              persistent-placeholder
              readonly
            ></v-text-field>
            <v-select
              v-model="userStore.userData.location"
              label="Location"
              item-title="name"
              return-object
              filled
              readonly
            ></v-select>
            <v-select
              v-model="userStore.userData.maritalStatus"
              label="Marital Status"
              item-title="text"
              readonly
            >
            </v-select>
            <v-select
              v-model="userStore.userData.adults"
              label="Adults"
              readonly
            ></v-select>
            <v-select
              v-model="userStore.userData.preteens"
              label="Preteens"
              readonly
            ></v-select>
            <v-select
              v-model="userStore.userData.teens"
              label="Teens"
              readonly
            ></v-select>
            <v-select
              v-model="userStore.userData.youngAdults"
              label="Young Adults"
              readonly
            ></v-select>
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

function onSubmit() {
  editingProfile.value = false;
}
</script>
<style scoped></style>
