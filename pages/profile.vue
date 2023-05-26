<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Profile</h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right">
        <v-btn
          class="bg-blue-grey-lighten-4 mr-2"
          @click="editingProfile = !editingProfile"
          >{{ !editingProfile ? "EdIT" : "CANCEL" }}</v-btn
        >
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
              variant="solo"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.lastname"
              label="Last Name"
              persistent-placeholder
              readonly
              variant="solo"
            ></v-text-field>
            <v-text-field
              v-model="userStore.userData.email"
              label="Email Address"
              persistent-placeholder
              readonly
              variant="solo"
            ></v-text-field>
            <v-select
              v-model="userStore.userData.location"
              label="Planned Feast Site"
              item-title="name"
              return-object
              filled
              readonly
              variant="solo"
            ></v-select>
            <v-select
              v-model="userStore.userData.maritalStatus"
              label="Marital Status"
              item-title="text"
              readonly
              variant="solo"
            >
            </v-select>
            <v-select
              v-model="userStore.userData.adults"
              label="Adults"
              readonly
              variant="solo"
            ></v-select>
            <v-select
              v-model="userStore.userData.preteens"
              label="Preteens"
              readonly
              variant="solo"
            ></v-select>
            <v-select
              v-model="userStore.userData.teens"
              label="Teens"
              readonly
              variant="solo"
            ></v-select>
            <v-select
              v-model="userStore.userData.youngAdults"
              label="Young Adults"
              readonly
              variant="solo"
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
