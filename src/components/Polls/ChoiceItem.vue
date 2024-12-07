<template>
  <!-- Threshold reached choice -->
  <div
    v-if="thresholdReached"
    class="p-2 align-choices-center bg-green-50 border-green-500 border-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
    @click="onResponseClicked(choice)"
  >
    <p class="text-sm">{{ choice.text }}</p>
    <CheckIcon v-if="choice.isSelected" class="w-4 h-4 text-blue-500" />
  </div>
  <!-- Locked choice -->
  <div
    v-else
    class="p-2 align-choices-center rounded-lg border border-gray-200 shadow-md"
    :class="props.isExpired ? 'bg-gray-100' : 'bg-white hover:shadow-lg cursor-pointer'"
    @click="onResponseClicked(choice)"
  >
    <p class="text-sm">{{ choice.text }}</p>
    <CheckIcon v-if="choice.isSelected" class="w-4 h-4 text-blue-500" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
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

const maybeVotes = computed(() => props.choice.votes || [])
const thresholdReached = computed(() => maybeVotes.value.length >= props.threshold)

async function onResponseClicked(choice) {
  if (props.isExpired) {
    return
  }
  if (!thresholdReached.value) {
    // Emit event to parent which will trigger the same action as sending a new choice does
    await sendResponse(choice)
    emit('choice-clicked')
  }
  if (thresholdReached.value) {
    router.push({ name: 'home.polls.results', params: { choiceId: choice._id } })
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
