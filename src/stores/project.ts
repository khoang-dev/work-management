import { defineStore } from 'pinia';
import { genId } from 'src/utils/common';
import { ProjectId } from 'src/utils/type';
import { ref } from 'vue';

export interface Project {
  name: string;
  startDate: string;
  endDate: string;
}
export interface ResponseProject extends Project {
  id: ProjectId;
}
const MOCK_PROJECTS: ResponseProject[] = [
  {
    id: '1',
    name: 'Website Redesign',
    startDate: '11/10/2024',
    endDate: '18/10/2024',
  },
];
export const useProjectStore = defineStore('project', () => {
  const projects = ref<ResponseProject[]>([]);

  // MOCK DATA
  const id = genId();
  function init() {
    id.set(MOCK_PROJECTS.length);
    projects.value = MOCK_PROJECTS;
  }
  init();

  async function create(value: Project) {
    //TODO: Updating this code when there are a backend
    const responseProject: ResponseProject = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...value,
          id: id.get(),
        });
      }, 2000);
    });
    projects.value = projects.value.concat(responseProject);
    return responseProject.id;
  }

  return { projects, create };
});
