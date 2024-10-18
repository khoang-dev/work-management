<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ task.name }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-linear-progress
        rounded
        size="18px"
        :value="usageTimeRatio"
        color="purple-5"
        class="q-mr-sm"
        style="width: 125px"
      >
        <div class="absolute-full flex flex-center">
          <q-badge
            color="transparent"
            text-color="black"
            :label="usageTimeRatioLabel"
          />
        </div>
      </q-linear-progress>
    </q-item-section>
    <q-item-section side>
      <q-btn flat round icon="more_vert">
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Edit</q-item-section>
            </q-item>
            <q-item clickable>
              <q-item-section>Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-item-section>
  </q-item>
</template>
<script lang="ts" setup>
import { ResponseTask } from 'src/stores/task';
import { convertHmTimeToText, hmTimeToMinute } from 'src/utils/common';
import { computed, toRefs } from 'vue';

type Props = {
  task: ResponseTask;
};

const props = defineProps<Props>();
const { task } = toRefs(props);

const usageTimeRatio = computed(() => {
  const estimatedTime = hmTimeToMinute(task.value.estimatedTime);
  const usedTime = hmTimeToMinute(task.value.usedTime);

  if (!estimatedTime) return 1;

  return usedTime / estimatedTime;
});

const usageTimeRatioLabel = computed(() => {
  return `${convertHmTimeToText(task.value.usedTime)} / ${convertHmTimeToText(
    task.value.estimatedTime
  )}`;
});
</script>
<style lang=""></style>
