<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pick task</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-sm rounded-borders">
        <q-list bordered>
          <ProjectSelection
            v-for="project in projectOptions"
            :key="project.id"
            :project="project"
            @change="
              (id, value) => {
                if (!value) {
                  idTaskSelectionMutations.delete(id);
                } else
                  idTaskSelectionMutations.set(id, { projectId: project.id });
              }
            "
          />
          <TaskSelection
            v-for="[, task] in tasks.get(NON_EXISTING_PROJECT_ID)"
            :key="task.id"
            :task="task"
            :selected="idTaskSelectionMutations.has(task.id)"
            @update:selected="
              (value) => {
                if (!value) {
                  idTaskSelectionMutations.delete(task.id);
                } else
                  idTaskSelectionMutations.set(task.id, {
                    projectId: task.projectId,
                  });
              }
            "
          />
        </q-list>
      </q-card-section>
      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Cancel" color="grey" v-close-popup />
        <q-btn flat label="Confirm" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import { NON_EXISTING_PROJECT_ID } from 'src/utils/constant';
import { useProjectStore } from 'src/stores/project';
import { ResponseTask, useTaskStore } from 'src/stores/task';

import TaskSelection from '../TaskSelection.vue';
import ProjectSelection from '../ProjectSelection.vue';

const projectStore = useProjectStore();
const taskStore = useTaskStore();
const { projects } = storeToRefs(projectStore);
const { tasks } = storeToRefs(taskStore);

const showDialog = defineModel<boolean>({ required: true, default: false });

const idTaskSelectionMutations = ref<Map<string, { projectId: string | null }>>(
  taskStore.selectedTasksInformation
);

const projectOptions = computed(() => {
  return projects.value.map((project) => {
    let projectRelatedTasks: (ResponseTask & { selected: boolean })[] = [];
    (tasks.value.get(project.id) || []).forEach((task) =>
      projectRelatedTasks.push({
        ...task,
        selected: idTaskSelectionMutations.value.has(task.id),
      })
    );
    return {
      ...project,
      tasks: projectRelatedTasks,
    };
  });
});

function confirm() {
  // taskStore.changeSelection([...idTaskSelectionMutations.value]);
  // showDialog.value = false;
}
</script>
