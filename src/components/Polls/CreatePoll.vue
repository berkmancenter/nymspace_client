<template>
  <p class="text-gray-600 text-sm mb-8">
    Submit responses and vote on them anonymously. When a response gets enough votes, voters for that response reveal their
    names.
  </p>
  <div class="mb-4">
    <span class="font-semibold">Poll title:</span>
    <div>
      <input v-model="title" class="border rounded border-gray-500 w-full h-12 px-3" type="text" />
    </div>
  </div>
  <div class="mb-4">
    <span class="font-semibold">Description:</span>
    <div>
      <textarea v-model="description" rows="2" class="h-full border rounded border-gray-500 w-full p-3" type="text">
      </textarea>
    </div>
  </div>
  <div class="flex">
    <div class="w-1/2">
      <p class="font-semibold">End date:</p>

      <!-- Date picker -->
      <div class="flex max-w-sm border rounded border-gray-500 w-full">
        <VueDatePicker v-model="selectedDate" :enable-time-picker="false" />
      </div>
    </div>
    <div class="w-4"></div>
    <div class="w-1/2">
      <p class="font-semibold">End time:</p>

      <!-- Time picker -->
      <div class="flex max-w-sm border rounded border-gray-500">
        <VueDatePicker v-model="selectedTime" time-picker :text-input="timeInputOptions" :is24="false" />
      </div>
      <p class="text-gray-600 mt-2 text-sm">
        Time is in your local timezone. The poll will end at this time for everyone regardless of their time zone.
      </p>
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
const errorMessage = ref('')
const route = useRoute()

const timeInputOptions = {
  openMenu: false,
  selectOnFocus: true
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

  const expirationDate = new Date(selectedDate.value)
  expirationDate.setHours(selectedTime.value.hours)
  expirationDate.setMinutes(selectedTime.value.minutes)

  createPoll({
    title: title.value,
    description: description.value,
    expirationDate,
    topicId: route.params.channelId
  })
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
