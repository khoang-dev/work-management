<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn flat round icon="timer" />
        <q-toolbar-title>Pomocontrol</q-toolbar-title>

        <q-btn flat label="REPORT" icon="bar_chart" @click="() => {}" />
        <!-- Project Menu -->
        <q-btn-dropdown flat label="Project" class="q-mr-sm">
          <q-list>
            <q-item clickable @click="showNewProjectDialog = true">
              <q-item-section>
                <q-item-label>New Project</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="() => {}">
              <q-item-section>
                <q-item-label>Show Projects</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn flat round>
          <q-avatar size="26px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable @click="showProfileDialog = true">
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable @click="() => {}">
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <NewProjectDialog v-model="showNewProjectDialog" />
    <ProfileDialog v-model="showProfileDialog" />
  </q-layout>
</template>

<script lang="ts" setup>
import NewProjectDialog from 'src/components/modals/NewProjectDialog.vue';
import ProfileDialog from 'src/components/modals/ProfileDialog.vue';
import { ref } from 'vue';

const isLoggedIn = ref<boolean>(false);
const showProfileDialog = ref<boolean>(false);

//Modal
const showNewProjectDialog = ref<boolean>(false);

const logout = () => {
  isLoggedIn.value = false;
};
</script>
