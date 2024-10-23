<template>
  <button v-if="show" class="flex items-center justify-start gap-2" @click="openModal">
    <PlusCircleIcon class="w-5 h-5" /> new thread
  </button>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>Create New Thread</template>
    <span class="font-semibold">Thread name:</span>
    <div>
      <input
        v-model="threadName"
        class="w-full h-12 px-3 text-lg border border-gray-500 rounded login-form-field"
        type="text"
      />
    </div>
    <div v-if="getEnableAgents">
      <div class="mt-6 font-semibold">Enable agents for this thread?</div>
      <div v-for="(agent, index) of getAvailableAgents" :key="agent.agentType">
        <input
          id="{{agent.agentType}}"
          v-model="agentSelections[index]"
          type="checkbox"
          class="w-4 h-4 mr-2 align-middle cursor-pointer"
        /><label class="font-semibold cursor-pointer" for="{{agent.agentType}}">{{ agent.name }}</label>
      </div>
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
import Modal from '../Shared/Modal.vue'
import { useRoute } from 'vue-router'
import { PlusCircleIcon } from '@heroicons/vue/outline'

defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const { createThread, getEnableAgents, getAvailableAgents } = useStore
const isModalOpen = ref(false)
const threadName = ref('')
const message = ref('')
const agentSelections = ref(new Array(getAvailableAgents.length).fill(false))
const route = useRoute()
// const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''

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
      topicId: route.params.channelId,
      agentTypes: agentSelections.value.map((s, i) => (s ? getAvailableAgents.value[i].agentType : false)).filter(Boolean)
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
