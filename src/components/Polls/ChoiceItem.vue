<template>
  <!-- Threshold reached choice -->
  <div
    class="p-2 align-choices-center border-2 rounded-lg shadow-lg"
    :class="
      thresholdReached ? 'bg-green-50 border-green-500 border-2' : !canDoAction ? 'bg-gray-100' : 'bg-white border-gray-100 '
    "
  >
    <p class="text-sm">{{ choice.text }}</p>
    <div class="flex flex-row items-end justify-between">
      <CheckIcon v-if="canDoAction && choice.isSelected" class="w-6 h-6 text-blue-500" />
      <span v-else></span>

      <div class="flex flex-row">
        <button
          v-if="canDoAction"
          class="flex gap-2 justify-start items-center text-white p-1 rounded-md shadow-sm"
          :class="
            choice.isSelected
              ? 'bg-gray-500 cursor-not-allowed '
              : 'bg-blue-500 hover:shadow-lg transition-shadow duration-300'
          "
          @click="voteForChoice"
        >
          <PlusIcon class="w-3 h-3" />
          <p class="text-sm">vote</p>
        </button>
        <button
          v-if="thresholdReached"
          class="ml-4 flex gap-2 justify-start items-center text-white p-1 rounded-md shadow-sm bg-green-500 hover:shadow-lg transition-shadow duration-300"
          @click="revealResponses"
        >
          <PlusIcon class="w-3 h-3" />
          <p class="text-sm">reveal</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '../../composables/global/useStore'
import { CheckIcon, PlusIcon } from '@heroicons/vue/outline'

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
  },
  isAuthed: {
    type: Boolean,
    required: true
  }
})

const router = useRouter()

const emit = defineEmits(['choice-clicked'])

const maybeVotes = computed(() => props.choice.votes || [])
const thresholdReached = computed(() => maybeVotes.value.length >= props.threshold)

async function onResponseClicked(choice) {
  if (props.isExpired || !props.isAuthed) {
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
      topicId: getActivePoll.value.topic,
      pollId: getActivePoll.value._id,
      choiceText: choice.text
    })
  } catch (error) {
    console.error('Error selecting choice:', error)
  }
}
</script>
