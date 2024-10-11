<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add/Pick task</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <!-- Add Task Button -->
        <q-btn
          color="primary"
          icon="add"
          label="Add Task"
          @click="openNewTaskDialog"
          class="q-mb-md"
        />

        <!-- Task List -->
        <q-list bordered class="rounded-borders">
          <template v-for="(item, index) in items" :key="index">
            <!-- Project Item -->
            <template v-if="item.type === 'project'">
              <q-expansion-item header-class="text-primary">
                <template #header>
                  <q-item-section avatar>
                    <q-checkbox
                      v-model="item.selected"
                      @update:model-value="toggleProjectTasks(index)"
                    />
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon name="folder" color="amber" size="sm" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.title }}</q-item-label>
                    <q-item-label caption>
                      Total Estimate: {{ calculateProjectTime(item) }} | Total
                      used: {{ calculateProjectTime(item) }}
                    </q-item-label>
                  </q-item-section>
                </template>

                <q-list class="q-pl-md">
                  <q-item
                    v-for="(task, taskIndex) in item.tasks"
                    :key="taskIndex"
                  >
                    <q-item-section side>
                      <q-checkbox
                        v-model="task.selected"
                        @update:model-value="updateProjectSelection(index)"
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon name="assignment" color="grey-7" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ task.title }}</q-item-label>
                      <q-item-label caption>
                        Estimate: {{ formatTime(task.timeEstimate) }} | Used:
                        {{ formatTime(task.timeEstimate) }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </template>

            <!-- Task Item -->
            <template v-else>
              <q-item>
                <q-item-section side>
                  <q-checkbox v-model="item.selected" />
                </q-item-section>
                <q-item-section avatar>
                  <q-icon name="assignment" color="grey-7" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.title }}</q-item-label>
                  <q-item-label caption>
                    Estimate: {{ formatTime(item.timeEstimate) }} | Used:
                    {{ formatTime(item.timeEstimate) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </template>
        </q-list>

        <!-- New Task Dialog -->
        <q-dialog v-model="newTaskDialog">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">New Task</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                v-model="newTask.title"
                label="Task Name"
                filled
                :rules="[(val) => !!val || 'Task name is required']"
              />

              <div class="row q-mt-md">
                <div class="col-6 q-pr-sm">
                  <q-input
                    v-model.number="newTask.hours"
                    label="Hours"
                    type="number"
                    filled
                    min="0"
                  />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-input
                    v-model.number="newTask.minutes"
                    label="Minutes"
                    type="number"
                    filled
                    min="0"
                    max="59"
                  />
                </div>
              </div>

              <q-select
                v-model="newTask.projectIndex"
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
              <q-btn
                flat
                label="Add Task"
                color="primary"
                @click="addNewTask"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-section>
      <q-card-actions align="right" class="bg-grey-1">
        <q-btn flat label="Cancel" color="grey" v-close-popup />
        <q-btn flat label="Confirm" color="primary" @click="() => {}" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
// import { storeToRefs } from 'pinia';
import { ResponseProject, useProjectStore } from 'src/stores/project';
import { ResponseTask, useTaskStore } from 'src/stores/task';
import { ref, computed } from 'vue';

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
const tasks = ref<ResponseTask[]>(taskStore.tasks);
// const { projects } = storeToRefs(projectStore);
const projects = ref<ResponseProject[]>(projectStore.projects);
// const { tasks } = storeToRefs(taskStore);

const newTaskDialog = ref(false);
const newTask = ref<NewTaskForm>({
  title: '',
  hours: 0,
  minutes: 0,
  projectIndex: null,
});

const items = ref<Item[]>([
  {
    type: 'project',
    title: 'Website Redesign',
    selected: false,
    tasks: [
      { title: 'Create wireframes', selected: false, timeEstimate: 120 },
      { title: 'Design mockups', selected: false, timeEstimate: 180 },
      { title: 'Implement frontend', selected: false, timeEstimate: 360 },
    ],
  },
  {
    type: 'task',
    title: 'Buy groceries',
    selected: false,
    timeEstimate: 30,
  },
  {
    type: 'project',
    title: 'Mobile App Development',
    selected: false,
    tasks: [
      { title: 'Define requirements', selected: false, timeEstimate: 90 },
      { title: 'Create prototype', selected: false, timeEstimate: 240 },
      { title: 'Test functionality', selected: false, timeEstimate: 120 },
    ],
  },
  {
    type: 'task',
    title: 'Call dentist',
    selected: false,
    timeEstimate: 15,
  },
]);

const projectOptions = computed(() => {
  return items.value
    .map((item, index) => {
      if (item.type === 'project') {
        return {
          label: item.title,
          value: index,
        };
      }
      return null;
    })
    .filter((item): item is { label: string; value: number } => item !== null);
});

const toggleProjectTasks = (projectIndex: number): void => {
  const project = items.value[projectIndex];
  if (project.type === 'project') {
    project.tasks.forEach((task) => {
      task.selected = project.selected;
    });
  }
};

const updateProjectSelection = (projectIndex: number): void => {
  const project = items.value[projectIndex];
  if (project.type === 'project') {
    const allTasksSelected = project.tasks.every((task) => task.selected);
    const noTasksSelected = project.tasks.every((task) => !task.selected);

    if (allTasksSelected) {
      project.selected = true;
    } else if (noTasksSelected) {
      project.selected = false;
    } else {
      project.selected = false;
    }
  }
};

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

const openNewTaskDialog = (): void => {
  newTask.value = {
    title: '',
    hours: 0,
    minutes: 0,
    projectIndex: null,
  };
  newTaskDialog.value = true;
};

const addNewTask = (): void => {
  if (!newTask.value.title) return;

  const timeEstimate = newTask.value.hours * 60 + newTask.value.minutes;
  const newTaskItem: Task = {
    title: newTask.value.title,
    selected: false,
    timeEstimate,
  };

  if (newTask.value.projectIndex !== null) {
    // Add to project
    const project = items.value[newTask.value.projectIndex];
    if (project.type === 'project') {
      project.tasks.push(newTaskItem);
    }
  } else {
    // Add as standalone task
    items.value.push({
      type: 'task',
      ...newTaskItem,
    });
  }

  newTaskDialog.value = false;
};
</script>
