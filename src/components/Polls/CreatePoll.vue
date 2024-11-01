<template>
  <p class="text-gray-600 mb-4">
    Submit responses and vote on them anonymously. When a response gets enough votes, voters for that response reveal their
    names.
  </p>
  <span class="font-semibold">Poll title:</span>
  <div>
    <input v-model="title" class="border rounded border-gray-500 w-full h-12 px-3 text-lg login-form-field" type="text" />
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
const message = ref('')
const route = useRoute()

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
    topic: route.params.channelId
  })
    .then((x) => emit('createSuccess'))
    .catch((err) => (message.value = err.response.data.message))
}

function hasTitle() {
  return title.value.trim().length > 0
}
</script>
