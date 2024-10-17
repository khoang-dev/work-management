import { defineStore } from 'pinia';
import { ProjectId } from 'src/utils/type';
import { ref } from 'vue';

// TODO: sẽ thiết kế database 1 task chỉ thuộc về 1 project bằng cách, 1 task sê chỉ có 1 project ID. Nhưng trả về frontend thì task sẽ không có project ID và project sẽ có 1 list task id của project đó.
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
  const projects = ref<ResponseProject[]>(MOCK_PROJECTS);

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
