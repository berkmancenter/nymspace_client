<template>
  <button v-if="show" class="flex items-center gap-x-0.5 rounded-md py-1 hover:text-gray-900" @click.prevent="openModal">
    <TrashIcon class="h-4 w-4" />
    <span class="sr-only">Delete</span>
  </button>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>Delete Channel</template>
    <div>
      Are you sure you want to delete
      <span class="text-harvard-red">{{ name }}</span
      >?
    </div>
    <template #actions>
      <button
        class="rounded bg-gray-300 px-2 py-2 font-semibold shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        class="rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="emit('delete-channel')"
      >
        Delete
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/outline'
import { ref } from '@vue/reactivity'
import Modal from '../Shared/Modal.vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  name: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['delete-channel'])

const isModalOpen = ref(false)

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
}

function openModal() {
  window.scrollTo({ top: 0, left: 0 })
  document.querySelector('body').classList.add('modal-open')
  isModalOpen.value = true
}
</script>
