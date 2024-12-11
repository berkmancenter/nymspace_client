<template>
  <ThemedModal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>Draft will be lost.</template>
    <div class="font-semibold">
      <p>Are you sure you want to leave?</p>
      <p>Your thread draft will be lost.</p>
    </div>
    <template #actions>
      <button
        class="px-2 py-2 font-semibold bg-gray-300 rounded shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="emit('response', false)"
      >
        No
      </button>
      <button
        class="px-2 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="emit('response', true)"
      >
        Yes
      </button>
    </template>
  </ThemedModal>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { watch } from 'vue'
import ThemedModal from '../Shared/ThemedModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['response'])

const isModalOpen = ref(false)

watch(
  () => props.show,
  async (val) => {
    if (val) {
      window.scrollTo({ top: 0, left: 0 })
      document.querySelector('body').classList.add('modal-open')
      isModalOpen.value = true
    } else {
      document.querySelector('body').classList.remove('modal-open')
      isModalOpen.value = false
    }
  }
)

function closeModal() {}

// function openModal() {}
</script>
