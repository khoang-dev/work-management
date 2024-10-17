<template>
  <q-page class="q-pa-md">
    <div class="row justify-center q-mb-xl">
      <!-- Timer Circle -->
      <div class="col-12 col-sm-8 col-md-6 text-center">
        <q-circular-progress
          show-value
          font-size="52px"
          class="q-ma-md"
          :value="progressValue"
          size="300px"
          :thickness="0.1"
          :color="TIMER_COLORS[currentMode]"
          track-color="grey-3"
        >
          <div class="column items-center">
            <div class="text-h2 text-weight-bold">{{ formattedTime }}</div>
            <div class="text-subtitle1 text-grey-8">
              {{ currentMode.toUpperCase() }}
            </div>
          </div>
        </q-circular-progress>

        <!-- Control Buttons -->
        <div class="row justify-center items-center q-my-xs" style="gap: 1em">
          <q-btn round color="grey-7" icon="refresh" @click="resetTimer" />
          <q-btn
            round
            :color="isRunning ? 'red' : 'primary'"
            :icon="isRunning ? 'pause' : 'play_arrow'"
            @click="toggleTimer"
          />
          <q-btn round color="grey-7" icon="skip_next" @click="skipSession" />
        </div>

        <!-- Session Counter -->
        <div class="text-center text-subtitle2">
          <div>3 of 4</div>
          <div class="text-grey">sessions</div>
        </div>

        <!-- Current Task -->
        <q-card flat bordered class="q-mt-xl bg-grey-2">
          <q-card-section>
            <div class="text-h6 text-grey-8"># {{ 'currentTask.name' }}</div>
            <div class="text-subtitle2 text-grey-6">
              ## {{ 'currentProject.name' }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6">
        <div class="row items-center q-mb-md">
          <div class="text-h5 col">Tasks</div>
          <q-btn
            color="primary"
            icon="checklist"
            label="PICK TASK"
            @click="showPickTaskDialog = true"
          />
          <q-btn
            color="primary"
            icon="add"
            label="Add Task"
            @click="showNewTaskDialog = true"
            class="q-ml-md"
          />
        </div>

        <q-list bordered separator>
          <q-item v-for="task in selectedTasks" :key="task.id">
            <q-item-section>
              <q-item-label>{{ task.name }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-linear-progress
                rounded
                size="20px"
                :value="
                  hmTimeToMinute(task.usedTime) /
                  hmTimeToMinute(task.estimatedTime)
                "
                color="purple-5"
                class="q-mr-sm"
                style="width: 100px"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="transparent"
                    text-color="black"
                    :label="
                      (
                        (hmTimeToMinute(task.usedTime) /
                          hmTimeToMinute(task.estimatedTime)) *
                        100
                      ).toFixed(1) + '%'
                    "
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
        </q-list>
      </div>
    </div>
    <PickTaskDialog v-model="showPickTaskDialog" />
    <NewTaskDialog v-model="showNewTaskDialog" />
  </q-page>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';

import { MINUTE_TO_SECOND, MESSAGE_MODES, Modes } from 'src/utils/constant';
import { TimePresets } from 'src/utils/type';
import { hmTimeToMinute } from 'src/utils/common';

import { ResponseTask, useTaskStore } from 'src/stores/task';

import PickTaskDialog from 'src/components/modals/PickTaskDialog.vue';
import NewTaskDialog from 'src/components/modals/NewTaskDialog.vue';

const TIMER_COLORS = {
  [Modes.FOCUS]: 'teal-5',
  [Modes.SHORT_BREAK]: 'blue-5',
  [Modes.LONG_BREAK]: 'purple-5',
};

const $q = useQuasar();
const taskStore = useTaskStore();
const { selectedTasksInformation } = storeToRefs(taskStore);

// Time for modes
const timePresets = reactive<TimePresets>({
  [Modes.FOCUS]: 25 * MINUTE_TO_SECOND,
  [Modes.SHORT_BREAK]: 5 * MINUTE_TO_SECOND,
  [Modes.LONG_BREAK]: 15 * MINUTE_TO_SECOND,
});

// Timer state
const leftTime = ref<number>(timePresets[Modes.FOCUS]);
const isRunning = ref<boolean>(false);
const timerInterval = ref<NodeJS.Timeout>();
const currentMode = ref<Modes>(Modes.FOCUS);
const currentSession = ref<number>(1);
const totalSessions = ref<number>(4);

const notificationPermission = ref('default');

const showPickTaskDialog = ref<boolean>(false);
const showNewTaskDialog = ref<boolean>(false);

// Audio setup for timer completion sound
let audio: HTMLAudioElement;
onMounted(() => {
  // Initialize audio
  audio = new Audio(
    'https://cdnjs.cloudflare.com/ajax/libs/ion-sound/3.0.7/sounds/bell_ring.mp3'
  );

  // Check notification permission on mount
  if ('Notification' in window) {
    notificationPermission.value = Notification.permission;
    if (notificationPermission.value === 'default') {
      requestNotificationPermission();
    }
  }
});

const selectedTasks = computed(() => {
  const data: ResponseTask[] = [];
  selectedTasksInformation.value.forEach(({ projectId }, id) => {
    const task = taskStore.getTask(id, projectId);
    if (task) data.push(task);
  });
  return data;
});
const formattedTime = computed(() => {
  const minutes = Math.floor(leftTime.value / MINUTE_TO_SECOND);
  const seconds = leftTime.value % MINUTE_TO_SECOND;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
});
const progressValue = computed(() => {
  const maxTime = timePresets[currentMode.value];
  return ((maxTime - leftTime.value) / maxTime) * 100;
});

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
  }
}
function sendNotification() {
  // Play sound
  if (audio) {
    audio.play().catch((error) => console.error('Error playing sound:', error));
  }

  // Send browser notification if permitted
  if (notificationPermission.value === 'granted') {
    const message = MESSAGE_MODES[currentMode.value];
    new Notification('Pomofocus', {
      body: message,
      icon: '/path-to-your-icon.png', // Replace with your app icon path
    });
  }

  // Show Quasar notification
  showQuasarNotification();
}
function showQuasarNotification() {
  const message = MESSAGE_MODES[currentMode.value];
  $q.notify({
    message,
    color: 'red-5',
    icon: 'alarm',
    position: 'top',
    timeout: 5000,
    actions: [{ label: 'Dismiss', color: 'white' }],
  });
}
function toggleTimer() {
  if (isRunning.value) {
    clearInterval(timerInterval.value);
  } else {
    timerInterval.value = setInterval(() => {
      if (leftTime.value > 0) {
        leftTime.value--;
      } else {
        handleTimerComplete();
      }
    }, 1000);
  }
  isRunning.value = !isRunning.value;
}
function resetTimer() {
  clearInterval(timerInterval.value);
  isRunning.value = false;
  leftTime.value = timePresets[Modes.FOCUS];
  currentMode.value = Modes.FOCUS;
}
function handleTimerComplete() {
  clearInterval(timerInterval.value);
  isRunning.value = false;
  sendNotification();
}
function skipSession() {
  // handleTimerComplete();
  if (currentMode.value === Modes.FOCUS) {
    if (currentSession.value < totalSessions.value) {
      currentSession.value++;
      leftTime.value = timePresets[Modes.SHORT_BREAK];
      currentMode.value = Modes.SHORT_BREAK;
    } else {
      leftTime.value = timePresets[Modes.LONG_BREAK];
      currentMode.value = Modes.LONG_BREAK;
    }
  } else {
    leftTime.value = timePresets[Modes.FOCUS];
    currentMode.value = Modes.FOCUS;
  }
}
</script>

<style lang="scss">
.q-circular-progress {
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.02);
  }
}

.q-list {
  border-radius: 8px;
}
</style>
