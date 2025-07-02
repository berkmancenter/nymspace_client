<template>
  <button
    v-if="show"
    title="Edit Thread"
    data-testid="edit-thread"
    class="flex items-center justify-start gap-2"
    @click.prevent="openModal"
  >
    <PencilIcon class="inline-block w-4 h-4 rounded cursor-pointer hover:text-black hover:fill-current" />
    <span class="sr-only">Edit</span>
  </button>
  <ThemedModal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>Edit Thread</template>
    <span class="font-semibold">Thread name:</span>
    <div>
      <input
        v-model="threadName"
        class="w-full h-12 px-3 text-lg border border-gray-500 rounded login-form-field"
        type="text"
      />
    </div>
    <div>
      <input
        id="lockThread"
        v-model="locked"
        type="checkbox"
        class="w-4 h-4 mr-2 align-middle cursor-pointer"
        data-testid="lock-thread"
      /><label class="font-semibold cursor-pointer" for="lockThread">Lock Thread</label>
    </div>
    <div class="text-harvard-red">{{ message }}</div>
    <template #actions>
      <button
        class="px-2 py-2 font-semibold bg-gray-300 rounded shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        class="px-2 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        data-testid="update-thread"
        @click="processUpdate"
      >
        Update
      </button>
    </template>
  </ThemedModal>
</template>

<script setup>
import { PencilIcon } from '@heroicons/vue/outline'
import { ref } from '@vue/reactivity'
import useStore from '../../composables/global/useStore'
import ThemedModal from '../Shared/ThemedModal.vue'
const { updateThread } = useStore

const isModalOpen = ref(false)
const threadName = ref('')
const locked = ref(false)
// const email = ref('')
const message = ref('')

// const isEmailValid = computed(() => {
//   if (!email.value || email.value.trim().length === 0) return true
//   return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)
// })

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    required: true
  }
})

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
}

async function openModal() {
  message.value = ''
  threadName.value = props.item.name
  locked.value = props.item.locked
  window.scrollTo({ top: 0, left: 0 })
  isModalOpen.value = true
  document.querySelector('body').classList.add('modal-open')
}

function isNameValid() {
  return threadName.value.trim().length > 0
}

async function processUpdate() {
  if (isFormValid()) {
    const payload = {
      id: props.item._id ?? props.item.id,
      locked: locked.value,
      name: threadName.value
    }

    updateThread(payload)
      .then((x) => closeModal())
      .catch((err) => {
        message.value = err.response.data.message
      })
  } else if (!isNameValid()) {
    message.value = 'Name is required'
  }
}

function isFormValid() {
  return isNameValid()
}
</script>
