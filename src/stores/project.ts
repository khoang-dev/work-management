import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Project {
  name: string;
  startDate: string;
  endDate: string;
}
export interface ResponseProject extends Project {
  id: string;
}
export const useProjectStore = defineStore('project', () => {
  const projects = ref<ResponseProject[]>([]);
  //TODO: Updating this code when there are a backend
  async function create(value: Project) {
    const responseProject: ResponseProject = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...value,
          id: projects.value.length.toString(),
        });
      }, 2000);
    });
    projects.value = projects.value.concat(responseProject);
    return responseProject.id;
  }

  return { projects, create };
});
