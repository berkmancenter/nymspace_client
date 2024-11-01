<template>
  <button v-if="show" title="Delete Thread" class="flex gap-2 justify-start items-center" @click.prevent="openModal">
    <TrashIcon class="h-4 w-4 inline-block rounded cursor-pointer" />
    <span class="sr-only">Delete</span>
  </button>
  <ThemedModal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>Delete Thread</template>
    <div>
      Are you sure you want to delete
      <span class="text-harvard-red">{{ item.name }}</span
      >?
    </div>
    <div class="text-harvard-red mt-4">{{ message }}</div>
    <template #actions>
      <button
        class="rounded bg-gray-300 px-2 py-2 font-semibold shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        class="rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="processDelete"
      >
        Delete
      </button>
    </template>
  </ThemedModal>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/outline'
import { ref } from '@vue/reactivity'
import ThemedModal from '../Shared/ThemedModal.vue'
import useStore from '../../composables/global/useStore'
import { useRouter } from 'vue-router'

const { deleteThread, getActiveThread, setActiveThread, getActiveChannel } = useStore

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete-thread'])
const router = useRouter()

const isModalOpen = ref(false)
const message = ref('')

async function processDelete() {
  await deleteThread(getActiveThread.value._id ?? getActiveThread.value.id)
    .then((x) => {
      router.push({
        name: 'home.channels',
        params: {
          channelId: getActiveChannel.value.id
        }
      })
      setActiveThread(null)
      closeModal()
    })
    .catch((err) => {
      message.value = err.response.data.message
    })
}

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
}

function openModal() {
  message.value = ''
  window.scrollTo({ top: 0, left: 0 })
  document.querySelector('body').classList.add('modal-open')
  isModalOpen.value = true
}
</script>
