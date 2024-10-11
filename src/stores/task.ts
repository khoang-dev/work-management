import { defineStore } from 'pinia';
import { HmTime } from 'src/utils/type';
import { ref } from 'vue';

//TODO: Update name and logic extend

export interface Task {
  name: string;
  estimatedTime: HmTime; // unit: minute
}
export interface ResponseTask extends Task {
  id: string;
  projectId?: string;
  usedTime: HmTime; // unit: minute
}

const MOCK_SELECTED_TASKS: ResponseTask[] = [
  {
    id: '1',
    name: 'task 1',
    estimatedTime: { hours: 1, minutes: 0 },
    usedTime: { hours: 0, minutes: 30 },
  },
  {
    id: '2',
    name: 'task 2',
    estimatedTime: { hours: 1, minutes: 0 },
    usedTime: { hours: 0, minutes: 30 },
  },
];

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<ResponseTask[]>([]);
  const selectedTasks = ref<ResponseTask[]>(MOCK_SELECTED_TASKS);

  async function createList(newTasks: Task[], projectId?: string) {
    //TODO: Updating this code when there are a backend
    const responseTasks: ResponseTask[] = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          newTasks.map((task, idx) => {
            const id = (tasks.value.length + idx).toString();
            return {
              ...task,
              id,
              usedTime: { hours: 0, minutes: 0 },
              ...(projectId && { projectId }),
            };
          })
        );
      }, 2000);
    });

    tasks.value = tasks.value.concat(responseTasks);
    return responseTasks;
  }
  async function create(newTask: Task, projectId: string) {
    //TODO: Updating this code when there are a backend
    const responseTask: ResponseTask = await new Promise((resolve) => {
      setTimeout(() => {
        const id = tasks.value.length.toString();
        resolve({
          ...newTask,
          id,
          usedTime: { hours: 0, minutes: 0 },
          ...(projectId && { projectId }),
        });
      }, 2000);
    });

    tasks.value = tasks.value.concat(responseTask);
    return responseTask;
  }

  return { tasks, selectedTasks, createList, create };
});
