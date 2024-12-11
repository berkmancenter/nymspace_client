<template>
  <button
    v-if="show"
    class="flex gap-2 justify-start items-center bg-harvard-red text-white p-2 rounded-md shadow-md"
    @click="openModal"
  >
    <PlusCircleIcon class="w-5 h-5" /> new space
  </button>
  <ThemedModal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>New space</template>
    <!-- Space type tabs -->
    <template #fixed-content>
      <ul class="px-4 flex flex-wrap text-center text-gray-500 border-b border-gray-200">
        <li>
          <button
            class="flex gap-1 px-4 py-2 rounded-t-lg"
            :class="tab === 1 ? 'text-harvard-red bg-gray-100 font-bold' : ''"
            @click="openTab(1)"
          >
            <HashtagIcon class="w-5 h-5" />
            Thread
          </button>
        </li>
        <li>
          <button
            class="flex gap-1 px-4 py-2 rounded-t-lg"
            :class="tab === 2 ? 'text-harvard-red bg-gray-100 font-bold' : ''"
            @click="openTab(2)"
          >
            <UserGroupIcon class="w-5 h-5" />
            Threshold Poll
          </button>
        </li>
      </ul>
    </template>
    <!-- Tab content -->
    <div v-show="tab === 1" class="py-3 mb-5">
      <CreateThread ref="createThreadRef" @create-success="closeModal" />
    </div>
    <div v-show="tab === 2" class="py-3 mb-5">
      <CreatePoll v-if="isLoggedIn" ref="createPollRef" @create-success="closeModal" />
      <div v-else>
        <p>
          Please log in to an account to create a poll! You can log in or create an account by clicking on the menu in the
          top right corner.
        </p>
      </div>
    </div>
    <!-- Action buttons -->
    <template #actions>
      <button
        class="rounded bg-gray-300 px-2 py-2 font-semibold shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        v-if="tab === 1 || (tab === 2 && isLoggedIn)"
        class="rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="onSubmit"
      >
        Create
      </button>
    </template>
  </ThemedModal>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import ThemedModal from './ThemedModal.vue'
import CreateThread from '../Threads/CreateThread.vue'
import CreatePoll from '../Polls/CreatePoll.vue'
import { PlusCircleIcon, HashtagIcon, UserGroupIcon } from '@heroicons/vue/outline'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  isLoggedIn: {
    type: Boolean,
    required: false,
    default: false
  }
})

const isModalOpen = ref(false)
const tab = ref(1)
const createThreadRef = ref(null)
const createPollRef = ref(null)

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
}

function openModal() {
  window.scrollTo({ top: 0, left: 0 })
  isModalOpen.value = true
  document.querySelector('body').classList.add('modal-open')
}

function openTab(tabNumber) {
  tab.value = tabNumber
}

function onSubmit() {
  if (tab.value === 1) {
    createThreadRef.value.processCreate()
  } else if (tab.value === 2 && props.isLoggedIn) {
    createPollRef.value.processCreate()
  }
}
</script>
