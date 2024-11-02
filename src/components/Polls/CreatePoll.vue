<template>
  <p class="text-gray-600 mb-4">
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
  <div class="mb-4">
    <p class="font-semibold">End date:</p>

    <!-- Date picker -->
    <div class="flex max-w-sm border rounded border-gray-500 w-full">
      <input class="rounded w-full p-3" type="date" :value="defaultDate" :min="today" />
    </div>
  </div>
  <!-- Error message -->
  <div class="text-harvard-red mt-2">{{ message }}</div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import useStore from '../../composables/global/useStore'
import { useRoute } from 'vue-router'

const { createPoll } = useStore
const title = ref('')
const description = ref('')
const message = ref('')
const route = useRoute()

const today = new Date().toISOString().split('T')[0]
const date = new Date()
date.setDate(date.getDate() + 5)
const defaultDate = date.toISOString().split('T')[0]

defineProps({
  closeModal: {
    type: Function,
    default: () => {}
  }
})

defineExpose({
  processCreate
})

const emit = defineEmits(['createSuccess'])

function processCreate() {
  if (!hasTitle()) {
    message.value = 'A title is required.'
    return
  }
  createPoll({
    title: title.value,
    description: description.value,
    topic: route.params.channelId
  })
    .then((x) => emit('createSuccess'))
    .catch((err) => (message.value = err.response.data.message))
}

function hasTitle() {
  return title.value.trim().length > 0
}
</script>
