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
              <q-item clickable @click="() => {}">
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

    <!-- Login Dialog -->
    <q-dialog v-model="showLoginDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="loginEmail" label="Email" type="email" />
          <q-input
            v-model="loginPassword"
            label="Password"
            type="password"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red-7" v-close-popup />
          <q-btn
            flat
            label="Login"
            color="red-7"
            @click="login"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Register Dialog -->
    <q-dialog v-model="showRegisterDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Register</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="registerName" label="Name" />
          <q-input
            v-model="registerEmail"
            label="Email"
            type="email"
            class="q-mt-md"
          />
          <q-input
            v-model="registerPassword"
            label="Password"
            type="password"
            class="q-mt-md"
          />
          <q-input
            v-model="registerPasswordConfirm"
            label="Confirm Password"
            type="password"
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="red-7" v-close-popup />
          <q-btn
            flat
            label="Register"
            color="red-7"
            @click="register"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Profile Dialog -->
    <q-dialog v-model="showProfileDialog">
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
    <!-- Create a new project -->
    <q-dialog v-model="showNewProjectDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">New Project</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <q-input
            v-model="projectInformation.name"
            label="What are you working on?"
            filled
            class="q-mb-md"
          />

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-input
                v-model="projectInformation.startDate"
                label="Start date"
                filled
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="projectInformation.startDate">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input
                v-model="projectInformation.endDate"
                label="End date"
                filled
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="projectInformation.endDate">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <div class="text-h6 q-mb-sm">Tasks</div>
          <q-list bordered separator v-if="tasks.length">
            <q-item v-for="(task, index) in tasks" :key="index">
              <q-item-section>
                <q-input v-model="task.name" label="Task name" dense filled />
              </q-item-section>
              <q-item-section class="col-3">
                <q-input
                  v-model.number="task.estimatedTime.hours"
                  label="Hours"
                  type="number"
                  dense
                  filled
                />
              </q-item-section>
              <q-item-section class="col-3">
                <q-input
                  v-model.number="task.estimatedTime.minutes"
                  label="Minutes"
                  type="number"
                  dense
                  filled
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  round
                  flat
                  dense
                  icon="delete"
                  color="negative"
                  @click="removeTask(index)"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <q-btn
            class="q-mt-sm"
            icon="add"
            label="ADD TASK"
            color="primary"
            flat
            @click="addTask"
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Create" color="primary" @click="createProject" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { Project, useProjectStore } from 'src/stores/project';
import { Task, useTaskStore } from 'src/stores/task';
import { ref, reactive } from 'vue';

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const isLoggedIn = ref<boolean>(false);
const showLoginDialog = ref<boolean>(false);
const showRegisterDialog = ref<boolean>(false);
const showProfileDialog = ref<boolean>(false);

// Login form data
const loginEmail = ref<string>('');
const loginPassword = ref<string>('');

// Register form data
const registerName = ref<string>('');
const registerEmail = ref<string>('');
const registerPassword = ref<string>('');
const registerPasswordConfirm = ref<string>('');

// User profile data
const userProfile = ref({
  name: '',
  email: '',
});
// New project dialog
const showNewProjectDialog = ref<boolean>(false);
const projectInformation = reactive<Project>({
  name: '',
  startDate: '',
  endDate: '',
});
const tasks = ref<Task[]>([]);

async function createProject() {
  const projectId = await projectStore.create(projectInformation);
  await taskStore.createList(tasks.value, projectId);
  showNewProjectDialog.value = false;
}
function addTask() {
  tasks.value = tasks.value.concat({
    name: '',
    estimatedTime: {
      hours: 0,
      minutes: 0,
    },
  });
}
function removeTask(index: number) {
  tasks.value = tasks.value.filter((_, i) => i !== index);
}
const login = () => {
  // Implement login logic here
  isLoggedIn.value = true;
  userProfile.value = {
    name: 'Test User',
    email: loginEmail.value,
  };
  // Reset form
  loginEmail.value = '';
  loginPassword.value = '';
};
const register = () => {
  // Implement registration logic here
  isLoggedIn.value = true;
  userProfile.value = {
    name: registerName.value,
    email: registerEmail.value,
  };
  // Reset form
  registerName.value = '';
  registerEmail.value = '';
  registerPassword.value = '';
  registerPasswordConfirm.value = '';
};
const logout = () => {
  isLoggedIn.value = false;
  userProfile.value = {
    name: '',
    email: '',
  };
};
const updateProfile = () => {
  // Implement profile update logic here
};
</script>
