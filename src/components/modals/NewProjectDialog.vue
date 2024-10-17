<template>
  <q-dialog v-model="showDialog" persistent>
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
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Project, useProjectStore } from 'src/stores/project';
import { Task, useTaskStore } from 'src/stores/task';
import { NON_EXISTING_PROJECT } from 'src/utils/constant';

const taskStore = useTaskStore();
const projectStore = useProjectStore();

// New project dialog
const showDialog = defineModel<boolean>({ required: true, default: false });
const projectInformation = reactive<Project>({
  name: '',
  startDate: '',
  endDate: '',
});
const tasks = ref<Task[]>([]);

async function createProject() {
  showDialog.value = false;
  try {
    const projectId = await projectStore.create(projectInformation);
    await taskStore.createList(
      tasks.value.map((task) => ({ ...task, projectId }))
    );
  } catch (error) {
    console.error(error);
  }
}
function addTask() {
  tasks.value = tasks.value.concat({
    name: '',
    estimatedTime: {
      hours: 0,
      minutes: 0,
    },
    projectId: NON_EXISTING_PROJECT.id,
  });
}
function removeTask(index: number) {
  tasks.value = tasks.value.filter((_, i) => i !== index);
}
</script>
<style lang=""></style>
