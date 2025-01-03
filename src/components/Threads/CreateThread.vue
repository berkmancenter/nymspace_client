<template>
  <p class="mb-4 text-sm text-gray-600">A chat thread where everyone participates using a pseudonym.</p>
  <span class="font-semibold">Thread name:</span>
  <div>
    <input v-model="threadName" class="w-full h-12 px-3 border border-gray-500 rounded" type="text" />
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
  <!-- Error message -->
  <div class="mt-2 text-harvard-red">{{ message }}</div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import useStore from '../../composables/global/useStore'
import { useRoute } from 'vue-router'

const { createThread, getEnableAgents, getAvailableAgents } = useStore
const threadName = ref('')
const message = ref('')
const agentSelections = ref(new Array(getAvailableAgents.length).fill(false))
const route = useRoute()

defineExpose({
  processCreate
})

const emit = defineEmits(['createSuccess'])

function processCreate() {
  if (isFormValid()) {
    createThread({
      name: threadName.value,
      topicId: route.params.channelId,
      agentTypes: agentSelections.value.map((s, i) => (s ? getAvailableAgents.value[i].agentType : false)).filter(Boolean)
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
