<template>
  <q-item clickable>
    <q-item-section side>
      <q-checkbox v-model="selected" />
    </q-item-section>
    <q-item-section avatar>
      <q-icon name="assignment" color="grey-7" size="sm" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ props.task.name }}</q-item-label>
      <q-item-label caption>
        Estimate: {{ convertHmTimeToText(task.estimatedTime) }} | Used:
        {{ convertHmTimeToText(task.usedTime) }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
<script lang="ts" setup>
import { ResponseTask } from 'src/stores/task';
import { convertHmTimeToText } from 'src/utils/common';

const props = defineProps<{ task: ResponseTask }>();
const selected = defineModel<boolean>('selected', {
  required: true,
  default: false,
});
</script>
<style lang=""></style>
