<template>
  <p class="text-gray-600 text-sm mb-6">
    People submit ideas and vote on them anonymously. When a response gets enough votes, the voters reveal usernames to each
    other, while staying anoynmous to everyone else.
  </p>
  <div class="mb-4">
    <span class="font-semibold">Poll title:</span>
    <div>
      <input v-model="title" class="border rounded border-gray-500 w-full h-12 px-3" type="text" />
    </div>
  </div>
  <div class="mb-4">
    <span class="font-semibold">Description </span><span class="">(optional):</span>
    <div>
      <textarea v-model="description" rows="2" class="h-full border rounded border-gray-500 w-full p-3" type="text">
      </textarea>
    </div>
  </div>
  <!-- When results visible  -->
  <div class="mb-8">
    <span class="font-semibold">Reveal names:</span>
    <!-- Dropdown for selecting -->
    <select v-model="whenResultsVisible" class="border rounded border-gray-500 bg-gray-100 w-full h-12 px-3">
      <option value="thresholdOnly">When threshold is reached</option>
      <option value="thresholdAndExpiration">When threshold is reached AND poll has ended</option>
    </select>
  </div>
  <!-- Threshold input -->
  <div class="mb-4 flex items-center">
    <div class="w-1/2">
      <div class="inline-block bg-lime-200 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">Threshold</div>
      <p class="text-gray-600 text-sm mt-2">
        How many votes are needed to reveal names to each other? Set this to 1 to always show names.
      </p>
    </div>
    <div class="w-4"></div>
    <div class="w-1/2">
      <input v-model="threshold" class="border rounded border-gray-500 w-full h-12 px-3" type="number" min="1" />
    </div>
  </div>
  <!-- Expiration input -->
  <div v-if="whenResultsVisible === 'thresholdAndExpiration'" class="flex items-center">
    <div class="w-1/2">
      <div class="inline-block bg-blue-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">End time</div>
      <p class="text-gray-600 text-sm mt-2">When should this poll stop taking responses?</p>
    </div>
    <div class="w-4"></div>
    <div class="w-1/2">
      <!-- Date picker -->
      <p class="font-semibold">End date:</p>
      <div class="flex max-w-sm border rounded border-gray-500 w-full">
        <VueDatePicker v-model="selectedDate" :enable-time-picker="false" />
      </div>
      <div class="h-4"></div>
      <!-- Time picker -->
      <p class="font-semibold">End time:</p>
      <div class="flex max-w-sm border rounded border-gray-500">
        <VueDatePicker v-model="selectedTime" time-picker :text-input="timeInputOptions" :is24="false" />
      </div>
    </div>
  </div>
  <!-- Error message -->
  <div class="text-harvard-red mt-4">{{ errorMessage }}</div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import useStore from '../../composables/global/useStore'
import { useRoute } from 'vue-router'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const { createPoll } = useStore
const title = ref('')
const description = ref('')
const threshold = ref(5)
const whenResultsVisible = ref('thresholdOnly')
const errorMessage = ref('')
const route = useRoute()

const timeInputOptions = {
  openMenu: true,
  selectOnFocus: true,
  enterSubmit: true,
  tabSubmit: true
}

// Default date is 5 days in the future.
const defaultDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
const selectedDate = ref(defaultDate)
const selectedTime = ref({ hours: 23, minutes: 59 })

defineExpose({
  processCreate
})

const emit = defineEmits(['createSuccess'])

function processCreate() {
  if (!hasTitle()) {
    errorMessage.value = 'A title is required.'
    return
  }
  if (threshold.value < 0) {
    errorMessage.value = 'Threshold must be at least 0.'
    return
  }

  const expirationDate = new Date(selectedDate.value)
  expirationDate.setHours(selectedTime.value.hours)
  expirationDate.setMinutes(selectedTime.value.minutes)
  expirationDate.setSeconds(59)

  const pollData = {
    title: title.value,
    threshold: threshold.value,
    expirationDate,
    topicId: route.params.channelId,
    whenResultsVisible: whenResultsVisible.value,
    // Default below to true for MVP
    allowNewChoices: true,
    choicesVisible: true,
    multiSelect: true
  }

  if (description.value.trim().length > 0) {
    pollData.description = description.value
  }

  createPoll(pollData)
    .then((x) => emit('createSuccess'))
    .catch((err) => (errorMessage.value = err.response.data.message))
}

function hasTitle() {
  return title.value.trim().length > 0
}
</script>

<style>
/* Styles used for date picker */
.dp__theme_light {
  --dp-primary-color: /*any color you want */ #a41d30;
  --dp-primary-text-color: /*if the text contrast is not good, you can adjust this variable also*/ #ffffff;
}
</style>
