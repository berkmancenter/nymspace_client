<template>
  <!-- Threshold reached choice -->
  <div
    v-if="choice.votes >= threshold"
    class="p-2 align-choices-center bg-green-50 border-green-500 border-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
    @click="onResponseClicked(choice)"
  >
    <p class="text-sm">{{ choice.text }}</p>
    <CheckIcon v-if="choice.isSelected" class="w-6 h-6 text-blue-500" />
  </div>
  <!-- Locked choice -->
  <div
    v-else
    class="p-2 align-choices-center rounded-lg border border-gray-200 shadow-md"
    :class="props.isExpired ? 'bg-gray-100' : 'bg-white hover:shadow-lg cursor-pointer'"
    @click="onResponseClicked(choice)"
  >
    <p class="text-sm">{{ choice.text }}</p>
    <CheckIcon v-if="choice.isSelected" class="w-6 h-6 text-blue-500" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import useStore from '../../composables/global/useStore'
import { CheckIcon } from '@heroicons/vue/outline'

const { respondPoll, getActivePoll } = useStore

const props = defineProps({
  choice: {
    type: Object,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  isExpired: {
    type: Boolean,
    required: true
  }
})

const router = useRouter()

const emit = defineEmits(['choice-clicked'])

async function onResponseClicked(choice) {
  console.log(choice.isSelected)
  const thresholdReached = choice.votes >= props.threshold
  if (props.isExpired) {
    return
  }
  if (!thresholdReached) {
    // Emit event to parent which will trigger the same action as sending a new choice does
    await sendResponse(choice)
    emit('choice-clicked')
  }
  if (thresholdReached) {
    router.push({ name: 'home.polls.results', params: { responseId: choice.id } })
  }
}

async function sendResponse(choice) {
  try {
    await respondPoll({
      pollId: getActivePoll.value._id,
      choiceText: choice.text
    })
  } catch (error) {
    console.error('Error selecting choice:', error)
  }
}
</script>
