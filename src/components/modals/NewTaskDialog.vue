<template>
  <q-dialog v-model="showModel" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">New Task</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="newTask.name"
          label="Task Name"
          filled
          :rules="[(val) => !!val || 'Task name is required']"
        />

        <div class="row q-mt-md">
          <div class="col-6 q-pr-sm">
            <q-input
              v-model.number="newTask.estimatedTime.hours"
              label="Hours"
              type="number"
              filled
              min="0"
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
            />
          </div>
        </div>

        <q-select
          v-model="newTask.projectId"
          :options="projectOptions"
          label="Assign to Project (optional)"
          filled
          class="q-mt-md"
          emit-value
          map-options
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn flat label="Create" color="primary" @click="create" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { Task, useTaskStore } from 'src/stores/task';
import { computed, ref } from 'vue';
import { useProjectStore } from 'src/stores/project';
import { storeToRefs } from 'pinia';

const showModel = defineModel<boolean>({ required: true, default: false });

const projectStore = useProjectStore();
const taskStore = useTaskStore();
const { projects } = storeToRefs(projectStore);

const newTask = ref<Task>({
  name: '',
  estimatedTime: { hours: 0, minutes: 0 },
  projectId: null,
});

const projectOptions = computed(() => {
  return [
    { label: 'None', value: null },
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
