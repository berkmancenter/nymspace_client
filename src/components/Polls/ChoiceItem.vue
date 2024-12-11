<template>
  <!-- Threshold reached choice -->
  <div
    class="p-2 flex flex-col justify-between border-2 rounded-lg shadow-lg"
    :class="
      thresholdReached ? 'bg-green-50 border-green-500 border-2' : !canDoAction ? 'bg-gray-100' : 'bg-white border-gray-100 '
    "
  >
    <p class="text-sm">{{ choice.text }}</p>
    <div class="flex flex-row items-end justify-between mt-2">
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

const maybeVotes = computed(() => props.choice.votes || [])
const thresholdReached = computed(() => maybeVotes.value.length >= props.threshold)
const canDoAction = !props.isExpired && props.isAuthed

const emit = defineEmits(['show-modal'])

async function revealResponses() {
  if (!canDoAction) {
    return
  }
  if (thresholdReached.value) {
    router.push({ name: 'home.polls.results', params: { choiceId: props.choice._id } })
  }
}

async function voteForChoice() {
  if (!canDoAction) {
    return
  }
  if (!thresholdReached.value) {
    await sendResponse()
  }
}

async function sendResponse(choice) {
  respondPoll({
    topicId: getActivePoll.value.topic,
    pollId: getActivePoll.value._id,
    choiceText: props.choice.text
  }).catch((err) => {
    const error = err.response.data
    if (error.code === 403 && error.message.includes('Threshold has been reached.')) {
      emit('show-modal', {
        title: 'Threshold reached',
        message:
          'The threshold for this item was reached! To protect the anonymity of the current voters, you can no longer join. However, the group of voters may choose to reveal themselves IRL!'
      })
    } else {
      console.error('Error selecting choice:', error.message)
    }
  })
}
</script>
