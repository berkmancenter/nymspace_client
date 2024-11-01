<template>
  <p class="text-gray-600 mb-4">A pseudonymous chat thread.</p>
  <span class="font-semibold">Thread name:</span>
  <div>
    <input
      v-model="threadName"
      class="border rounded border-gray-500 w-full h-12 px-3 text-lg login-form-field"
      type="text"
    />
  </div>
  <!-- Error message -->
  <div class="text-harvard-red mt-2">{{ message }}</div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import useStore from '../../composables/global/useStore'
import { useRoute } from 'vue-router'

const { createThread } = useStore
const threadName = ref('')
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
  if (isFormValid()) {
    createThread({
      name: threadName.value,
      topicId: route.params.channelId
    })
      .then((x) => emit('createSuccess'))
      .catch((err) => (message.value = err.response.data.message))
  } else {
    message.value = 'Name is required'
  }
}

function isFormValid() {
  return threadName.value.trim().length > 0
}
</script>
