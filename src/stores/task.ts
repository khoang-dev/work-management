import { defineStore } from 'pinia';
import { genId } from 'src/utils/common';
import { NON_EXISTING_PROJECT } from 'src/utils/constant';
import { HmTime, StorageProjectId, TaskId } from 'src/utils/type';
import { ref } from 'vue';

//TODO: Update name and logic extend
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

const USED_TIME_DEFALT_VALUE: HmTime = { hours: 0, minutes: 0 };
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
    projectId: NON_EXISTING_PROJECT.id,
  },
];

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Map<StorageProjectId, Map<TaskId, ResponseTask>>>(
    new Map()
  );
  const selectedTasksInformation = ref<SelectedTasksInformation>(new Map());

  // MOCK DATA
  const id = genId();
  function init() {
    id.set(MOCK_TASKS.length);
    MOCK_TASKS.forEach((task) => setTask(task));
  }
  init();

  function changeSelectionTask(
    idTaskSelectionMutations: SelectedTasksInformation
  ) {
    selectedTasksInformation.value = idTaskSelectionMutations;
  }
  function setTask(task: ResponseTask) {
    const dataMap = tasks.value.get(task.projectId);
    if (dataMap) {
      dataMap.set(task.id, task);
    } else tasks.value.set(task.projectId, new Map([[task.id, task]]));
  }
  function getTask(taskId: TaskId, projectId: StorageProjectId) {
    return tasks.value.get(projectId || NON_EXISTING_PROJECT.id)?.get(taskId);
  }
  function removeTask(taskId: TaskId, projectId: StorageProjectId) {
    tasks.value.get(projectId)?.delete(taskId);
  }

  async function changeSelection(
    idTaskSelectionMutations: SelectedTasksInformation
  ) {
    const responseTasks: SelectedTasksInformation = await new Promise(
      (resolve) => {
        setTimeout(() => {
          resolve(new Map(idTaskSelectionMutations));
        }, 2000);
      }
    );
    changeSelectionTask(responseTasks);
    return;
  }
  async function createList(newTasks: Task[]) {
    //TODO: Updating this code when there are a backend
    const responseTasks: ResponseTask[] = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          newTasks.map((task) => {
            return {
              ...task,
              id: id.get(),
              usedTime: USED_TIME_DEFALT_VALUE,
              done: false,
            };
          })
        );
      }, 2000);
    });

    responseTasks.forEach((task) => setTask(task));
    return;
  }
  async function create(newTask: Task) {
    //TODO: Updating this code when there are a backend
    const responseTask: ResponseTask = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...newTask,
          id: id.get(),
          usedTime: USED_TIME_DEFALT_VALUE,
          done: false,
        });
      }, 2000);
    });

    setTask(responseTask);
    return;
  }
  async function update(task: ResponseTask) {
    //TODO: Updating this code when there are a backend
    const responseTask: ResponseTask = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...task,
        });
      }, 2000);
    });
    setTask(responseTask);
    return;
  }
  async function remove(taskId: TaskId, projectId: StorageProjectId) {
    //TODO: Updating this code when there are a backend
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
    removeTask(taskId, projectId);
    return;
  }

  return {
    tasks,
    selectedTasksInformation,
    getTask,
    changeSelection,
    createList,
    create,
    update,
    remove,
  };
});
