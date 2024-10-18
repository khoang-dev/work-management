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

  function addProject(project: ResponseProject) {
    projects.value = projects.value.concat(project);
  }
  function updateProject(project: ResponseProject) {
    const index = projects.value.findIndex((p) => p.id === project.id);
    if (index !== -1) {
      projects.value.splice(index, 1, project);
    }
  }
  function removeProject(projectId: ProjectId) {
    projects.value = projects.value.filter((p) => p.id !== projectId);
  }

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
    addProject(responseProject);
    return responseProject.id;
  }
  async function update(project: ResponseProject) {
    //TODO: Updating this code when there are a backend
    const responseProject: ResponseProject = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...project,
        });
      }, 2000);
    });
    updateProject(responseProject);
    return;
  }
  async function remove(projectId: ProjectId) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
    removeProject(projectId);
    return;
  }

  return { projects, create, update, remove };
});
