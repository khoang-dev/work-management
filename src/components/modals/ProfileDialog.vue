<template>
  <q-dialog v-model="showModel">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Profile</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="userProfile.name" label="Name" />
        <q-input
          v-model="userProfile.email"
          label="Email"
          type="email"
          readonly
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="red-7" v-close-popup />
        <q-btn
          flat
          label="Update"
          color="red-7"
          @click="updateProfile"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const showModel = defineModel<boolean>({ required: true, default: false });

const userProfile = ref({
  name: '',
  email: '',
});

const updateProfile = () => {
  // Implement profile update logic here
};
</script>
<style lang=""></style>
