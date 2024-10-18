<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="delete" color="negative" text-color="white" />
        <span class="q-ml-sm">{{
          `Are you sure you want to delete this ${mode}: ${name}?`
        }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="negative"
          @click="confirmDelete"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { useProjectStore } from 'src/stores/project';
import { useTaskStore } from 'src/stores/task';
import { StorageProjectId, TaskId } from 'src/utils/type';
import { computed } from 'vue';

const MODE = Object.freeze({
  task: 'task',
  project: 'project',
});
const props = defineProps<{ taskId?: TaskId; projectId: StorageProjectId }>();

const taskStore = useTaskStore();
const projectStore = useProjectStore();

const showDialog = defineModel<boolean>({ required: true, default: false });

const mode = computed(() => (props.taskId ? MODE.task : MODE.project));
const name = computed(() => {
  if (props.taskId)
    return taskStore.getTask(props.taskId, props.projectId)?.name;
  return projectStore.projects.find(({ id }) => id === props.taskId)?.name;
});
function confirmDelete() {
  if (props.taskId) taskStore.remove(props.taskId, props.projectId);
  else if (props.projectId) projectStore.remove(props.projectId);
  showDialog.value = false;
}
</script>
