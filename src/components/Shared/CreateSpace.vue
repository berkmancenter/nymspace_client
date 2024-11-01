<template>
  <button
    v-if="show"
    class="flex gap-2 justify-start items-center bg-harvard-red text-white p-2 rounded-md shadow-md"
    @click="openModal"
  >
    <PlusCircleIcon class="w-5 h-5" /> new space
  </button>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>New space</template>
    <!-- Space type tabs -->
    <ul
      class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
    >
      <li class="me-2">
        <a
          href="#"
          aria-current="page"
          class="inline-block px-4 py-2 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500"
          >Thread</a
        >
      </li>
      <li class="me-2">
        <a
          href="#"
          class="inline-block px-4 py-2 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >Poll</a
        >
      </li>
    </ul>

    <div v-show="tab === 1">
      <!-- Name -->
      <span class="font-semibold">Thread name:</span>
      <div>
        <input
          v-model="threadName"
          class="border rounded border-gray-500 w-full h-12 px-3 text-lg login-form-field"
          type="text"
        />
      </div>
    </div>
    <!-- Error message -->
    <div class="text-harvard-red">{{ message }}</div>
    <!-- Action buttons -->
    <template #actions>
      <button
        class="rounded bg-gray-300 px-2 py-2 font-semibold shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        class="rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="processCreate"
      >
        Create
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import useStore from '../../composables/global/useStore'
import Modal from './Modal.vue'
import { useRoute } from 'vue-router'
import { PlusCircleIcon } from '@heroicons/vue/outline'

defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const { createThread } = useStore
const isModalOpen = ref(false)
const threadName = ref('')
const message = ref('')
const route = useRoute()

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
}

function openModal() {
  threadName.value = ''
  window.scrollTo({ top: 0, left: 0 })
  isModalOpen.value = true
  document.querySelector('body').classList.add('modal-open')
}

function processCreate() {
  if (isFormValid()) {
    createThread({
      name: threadName.value,
      topicId: route.params.channelId
    })
      .then((x) => closeModal())
      .catch((err) => (message.value = err.response.data.message))
  } else {
    message.value = 'Name is required'
  }
}

function isFormValid() {
  return threadName.value.trim().length > 0
}
</script>
