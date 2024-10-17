import { defineStore } from 'pinia';
import { NON_EXISTING_PROJECT_ID } from 'src/utils/constant';
import { HmTime, StorageProjectId } from 'src/utils/type';
import { ref } from 'vue';

//TODO: Update name and logic extend
type TaskId = string;
export interface Task {
  name: string;
  estimatedTime: HmTime;
  projectId: StorageProjectId;
}
export type SelectedTasksInformation = Map<TaskId, StorageProjectId>;
export interface ResponseTask extends Task {
  id: TaskId;
  usedTime: HmTime;
  done: boolean;
}

export const USED_TIME_DEFALT_VALUE: HmTime = { hours: 0, minutes: 0 };
const MOCK_TASKS: ResponseTask[] = [
  {
    id: '1',
    name: 'task 1',
    estimatedTime: { hours: 1, minutes: 0 },
    usedTime: { hours: 0, minutes: 30 },
    done: false,
    projectId: '1',
  },
  {
    id: '2',
    name: 'task 2',
    estimatedTime: { hours: 1, minutes: 0 },
    usedTime: { hours: 0, minutes: 30 },
    done: false,
    projectId: NON_EXISTING_PROJECT_ID,
  },
];

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Map<StorageProjectId, Map<TaskId, ResponseTask>>>(
    new Map()
  );
  const selectedTasksInformation = ref<SelectedTasksInformation>(new Map());

  // MOCK DATA
  function init() {
    genId().set(MOCK_TASKS.length);
    MOCK_TASKS.forEach((task) => setTask(task));
  }
  init();

  function genId() {
    let currentId: number = 0;
    return {
      set: (value: number) => (currentId = value),
      get: () => String(currentId++),
    };
  }
  function setTask(task: ResponseTask) {
    const projectId = task.projectId || NON_EXISTING_PROJECT_ID;
    const dataMap = tasks.value.get(projectId);
    if (dataMap) {
      dataMap.set(task.id, task);
    } else tasks.value.set(projectId, new Map([[task.id, task]]));
  }
  function getTask(taskId: string, projectId: StorageProjectId) {
    return tasks.value.get(projectId || NON_EXISTING_PROJECT_ID)?.get(taskId);
  }

  async function createList(newTasks: Task[]) {
    //TODO: Updating this code when there are a backend
    const responseTasks: ResponseTask[] = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          newTasks.map((task) => {
            return {
              ...task,
              id: genId().get(),
              usedTime: USED_TIME_DEFALT_VALUE,
              done: false,
            };
          })
        );
      }, 2000);
    });

    responseTasks.forEach((task) => setTask(task));
    return responseTasks;
  }
  async function create(newTask: Task) {
    //TODO: Updating this code when there are a backend
    const responseTask: ResponseTask = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...newTask,
          id: genId().get(),
          usedTime: USED_TIME_DEFALT_VALUE,
          done: false,
        });
      }, 2000);
    });

    setTask(responseTask);
    return responseTask;
  }

  // function changeSelection(idTaskSelectionMutations: string[]) {
  //   selectedTaskIds.value = idTaskSelectionMutations;
  // }
  return { tasks, selectedTasksInformation, createList, create, getTask };
});
