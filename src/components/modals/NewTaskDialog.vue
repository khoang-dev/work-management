<template>
  <q-dialog v-model="showModel" persistent>
    <q-card style="min-width: 400px">
      <q-form @submit="create">
        <q-card-section>
          <div class="text-h6">New Task</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newTask.name"
            label="Task Name"
            filled
            :rules="[requiredValidation]"
          />
          <div class="row q-mt-sm">
            <div class="col-6 q-pr-sm">
              <q-input
                v-model.number="newTask.estimatedTime.hours"
                label="Hours"
                type="number"
                filled
                min="0"
                :rules="[requiredValidation]"
              />
            </div>
            <div class="col-6 q-pl-sm">
              <q-input
                v-model.number="newTask.estimatedTime.minutes"
                label="Minutes"
                type="number"
                filled
                min="0"
                max="59"
                :rules="[requiredValidation]"
              />
            </div>
          </div>
          <q-select
            v-model="newTask.projectId"
            :options="projectOptions"
            label="Assign to Project (optional)"
            filled
            class="q-mt-sm"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Create" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { Task, useTaskStore } from 'src/stores/task';
import { useProjectStore } from 'src/stores/project';
import { NON_EXISTING_PROJECT } from 'src/utils/constant';
import { requiredValidation } from 'src/utils/common';

const projectStore = useProjectStore();
const taskStore = useTaskStore();
const { projects } = storeToRefs(projectStore);

const showModel = defineModel<boolean>({ required: true, default: false });

const newTask = ref<Task>({
  name: '',
  estimatedTime: { hours: 0, minutes: 0 },
  projectId: NON_EXISTING_PROJECT.id,
});

const projectOptions = computed(() => {
  return [
    { label: NON_EXISTING_PROJECT.label, value: NON_EXISTING_PROJECT.id },
    ...projects.value.map((project) => ({
      label: project.name,
      value: project.id,
    })),
  ];
});

async function create() {
  showModel.value = false;
  try {
    await taskStore.create(newTask.value);
  } catch (error) {
    console.error(error);
  }
}
</script>
<style lang=""></style>
