//TODO: Refactor this component
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
          <!-- Refactor this loop -->
          Total Estimate:
          {{
            calculateProjectTime(
              project.tasks.map(({ estimatedTime }) => estimatedTime)
            )
          }}
          | Total used:
          {{
            calculateProjectTime(project.tasks.map(({ usedTime }) => usedTime))
          }}
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
import { ref, watch } from 'vue';

import { ResponseProject } from 'src/stores/project';
import { ResponseTask } from 'src/stores/task';

import TaskSelection from './TaskSelection.vue';
import { HmTime } from 'src/utils/type';
import { convertHmTimeToText } from 'src/utils/common';

export type ProjectSelectionTask = ResponseTask & { selected: boolean };
export type ProjectSelection = ResponseProject & {
  tasks: ProjectSelectionTask[];
};
type Prop = {
  project: ProjectSelection;
};

const $emit = defineEmits<{ change: [id: string, selected: boolean] }>();

const props = defineProps<Prop>();

// TODO: Consider using v-model instead and remove duplicate props.project.tasks.map(({ selected }) => selected)
//
const selecteds = ref<boolean[]>(
  props.project.tasks.map(({ selected }) => selected)
);

watch(props, () => {
  selecteds.value = props.project.tasks.map(({ selected }) => selected);
});

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
function calculateProjectTime(hmTimes: HmTime[]): string {
  return convertHmTimeToText(
    hmTimes.reduce(
      (accumulator, currentValue) => ({
        hours: accumulator.hours + currentValue.hours,
        minutes: accumulator.minutes + currentValue.minutes,
      }),
      { hours: 0, minutes: 0 }
    )
  );
}
</script>
<style lang=""></style>
