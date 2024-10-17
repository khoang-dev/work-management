<template>
  <q-expansion-item header-class="text-primary">
    <template #header>
      <q-item-section avatar>
        <q-checkbox
          :model-value="!selecteds.includes(false)"
          @update:model-value="changeSelectedProject"
        />
      </q-item-section>
      <q-item-section avatar>
        <q-icon name="folder" color="amber" size="sm" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ project.name }}</q-item-label>
        <q-item-label caption>
          <!-- Total Estimate: {{ calculateProjectTime(item) }} | Total
                    used: {{ calculateProjectTime(item) }} -->
        </q-item-label>
      </q-item-section>
    </template>
    <q-list class="q-px-md">
      <TaskSelection
        v-for="(task, idx) in props.project.tasks"
        :key="task.id"
        :task="task"
        :selected="selecteds[idx]"
        @update:selected="(value) => changeSeletedTask(task.id, idx, value)"
      />
    </q-list>
  </q-expansion-item>
</template>
<script lang="ts" setup>
import { ResponseProject } from 'src/stores/project';
import { ResponseTask } from 'src/stores/task';
import { ref } from 'vue';
import TaskSelection from './TaskSelection.vue';

export type ProjectSelection = ResponseProject & {
  tasks: (ResponseTask & { selected: boolean })[];
};
type Prop = {
  project: ProjectSelection;
};
const $emit = defineEmits<{ change: [id: string, selected: boolean] }>();
const props = defineProps<Prop>();

// handle v-model cho selected với datatype kiểu {id: string, selected: boolean}[]
const selecteds = ref<boolean[]>(
  props.project.tasks.map(({ selected }) => selected)
);

function changeSelectedProject() {
  const currentSelectedProject = !selecteds.value.includes(false);
  props.project.tasks.forEach((task, idx) => {
    changeSeletedTask(task.id, idx, !currentSelectedProject);
  });
  selecteds.value = selecteds.value.map(() => !currentSelectedProject);
}
function changeSeletedTask(id: string, idx: number, value: boolean) {
  selecteds.value[idx] = value;
  $emit('change', id, value);
}
</script>
<style lang=""></style>
