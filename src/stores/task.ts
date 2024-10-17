import { defineStore } from 'pinia';
import { NON_EXISTING_PROJECT_ID } from 'src/utils/constant';
import { HmTime } from 'src/utils/type';
import { ref } from 'vue';

//TODO: Update name and logic extend
export interface Task {
  name: string;
  estimatedTime: HmTime; // unit: minute
  projectId: string | null;
}
export interface ResponseTask extends Task {
  id: string;
  usedTime: HmTime; // unit: minute
  done: boolean;
}

export interface SelectedTaskInformation {
  projectId: string | null;
  id: string;
}

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
    projectId: null,
  },
];

export const useTaskStore = defineStore('task', () => {
  // Xác định Map hay Array cho tasks và selectedTaskIds, 2 cái này nên dùng riêng hay chung
  // Hiện tại có những chức năng sau,show project task, selected tasks
  // const tasks = ref<ResponseTask[]>([]);
  const tasks = ref<Map<string, Map<string, ResponseTask>>>(new Map()); // using projectId for key
  // const selectedTasksInformation = ref<SelectedTaskInformation[]>([]);
  const selectedTasksInformation = ref<
    Map<string, { projectId: string | null }>
  >(new Map()); // using id of Task for key
  function genId() {
    let currentId: number = 0;
    return {
      set: (value: number) => (currentId = value),
      get: () => String(currentId++),
    };
  }
  // Chức năng để xác định selected hay không

  // const selectedTaskIds = ref<Map<string, boolean>>(new Map<string, boolean>());

  // Xem xét lại những table trên database hiện tại

  function init() {
    genId().set(MOCK_TASKS.length);
    MOCK_TASKS.forEach((task) => setTask(task));
  }
  init();

  function setTask(task: ResponseTask) {
    const projectId = task.projectId || NON_EXISTING_PROJECT_ID;
    const dataMap = tasks.value.get(projectId);
    if (dataMap) {
      dataMap.set(task.id, task); // Dư field id and ProjectId
    } else
      tasks.value.set(
        projectId,
        new Map<string, ResponseTask>([[task.id, task]])
      );
  }

  function getTask(selectedTaskInformation: SelectedTaskInformation) {
    return tasks.value
      .get(selectedTaskInformation.projectId || NON_EXISTING_PROJECT_ID)
      ?.get(selectedTaskInformation.id);
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
              usedTime: { hours: 0, minutes: 0 },
              done: false,
              projectId: null,
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
          usedTime: { hours: 0, minutes: 0 },
          done: false,
          projectId: null,
        });
      }, 2000);
    });

    setTask(responseTask);
    return responseTask;
  }

  // function getTasksByProjectId(projectId: string) {
  //   return tasks.value.filter((task) => task.projectId === projectId);
  // }

  // function getTasksNotInProject() {
  //   return tasks.value.filter((task) => !task.projectId);
  // }

  // function changeSelection(idTaskSelectionMutations: string[]) {
  //   selectedTaskIds.value = idTaskSelectionMutations;
  // }
  return { tasks, selectedTasksInformation, createList, create, getTask };
});
