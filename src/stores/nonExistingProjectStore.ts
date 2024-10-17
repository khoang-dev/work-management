import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface NonExistingProjectResponse {
  taskIds: string[];
}
const MOCK_DATA: NonExistingProjectResponse = { taskIds: [] };
export const useNonExistingProjectStore = defineStore(
  'nonExistingProject',
  () => {
    const nonExistingProject = ref<NonExistingProjectResponse>(MOCK_DATA);

    return { nonExistingProject };
  }
);
