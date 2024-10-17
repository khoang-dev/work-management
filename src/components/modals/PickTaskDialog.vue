<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Pick task</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-sm rounded-borders">
        <!-- Task List -->
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
            v-for="[id, task] in tasks.get(NON_EXISTING_PROJECT_ID)"
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
import { storeToRefs } from 'pinia';
import { ResponseProject, useProjectStore } from 'src/stores/project';
import {
  NON_EXISTING_PROJECT_ID,
  ResponseTask,
  SelectedTaskInformation,
  useTaskStore,
} from 'src/stores/task';
import { ref, computed, reactive } from 'vue';
import TaskSelection from '../TaskSelection.vue';
import ProjectSelection from '../ProjectSelection.vue';

interface Task {
  title: string;
  selected: boolean;
  timeEstimate: number;
}

interface Project {
  type: 'project';
  title: string;
  selected: boolean;
  tasks: Task[];
}

interface StandaloneTask extends Task {
  type: 'task';
}

type Item = Project | StandaloneTask;

interface NewTaskForm {
  title: string;
  hours: number;
  minutes: number;
  projectIndex: number | null;
}

const showDialog = defineModel<boolean>({ required: true, default: false });

const projectStore = useProjectStore();
const taskStore = useTaskStore();
// const tasks = ref<ResponseTask[]>(taskStore.tasks);
const { projects } = storeToRefs(projectStore);
// const projects = ref<ResponseProject[]>(projectStore.projects);
const { tasks, selectedTasksInformation } = storeToRefs(taskStore);

const newTaskDialog = ref(false);

// TODO:Compare Map with Array. How is the Map made? (hash table )
// const selectionMutations = reactive(new Map<string, boolean>());
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
// const toggleProjectTasks = (projectIndex: number): void => {
//   const project = items.value[projectIndex];
//   if (project.type === 'project') {
//     project.tasks.forEach((task) => {
//       task.selected = project.selected;
//     });
//   }
// };

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const calculateProjectTime = (project: Project): string => {
  const totalMinutes = project.tasks.reduce(
    (total, task) => total + task.timeEstimate,
    0
  );
  return formatTime(totalMinutes);
};

// const openNewTaskDialog = (): void => {
//   newTask.value = {
//     title: '',
//     hours: 0,
//     minutes: 0,
//     projectIndex: null,
//   };
//   newTaskDialog.value = true;
// };

// const addNewTask = (): void => {
//   if (!newTask.value.title) return;

//   const timeEstimate = newTask.value.hours * 60 + newTask.value.minutes;
//   const newTaskItem: Task = {
//     title: newTask.value.title,
//     selected: false,
//     timeEstimate,
//   };

//   if (newTask.value.projectIndex !== null) {
//     // Add to project
//     const project = items.value[newTask.value.projectIndex];
//     if (project.type === 'project') {
//       project.tasks.push(newTaskItem);
//     }
//   } else {
//     // Add as standalone task
//     items.value.push({
//       type: 'task',
//       ...newTaskItem,
//     });
//   }

//   newTaskDialog.value = false;
// };
</script>
