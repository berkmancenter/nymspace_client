<template>
  <!-- Threshold reached choice -->
  <div
    class="p-2 flex flex-col justify-between border rounded-lg shadow-md"
    :class="thresholdReached ? 'bg-lime-50 border-lime-500' : !canDoAction ? 'bg-gray-100' : 'bg-white border-gray-300 '"
  >
    <p class="text-sm">{{ choice.text }}</p>
    <div class="flex flex-row items-end justify-between mt-2">
      <CheckIcon v-if="canDoAction && choice.isSelected" class="w-6 h-6 text-indigo-500" />
      <span v-else></span>

      <div class="flex flex-row">
        <button
          v-if="canDoAction"
          class="flex gap-2 justify-start items-center text-white p-1 rounded-md shadow-sm"
          :class="
            choice.isSelected
              ? 'bg-gray-400 cursor-not-allowed '
              : 'bg-indigo-500 hover:shadow-lg transition-shadow duration-300'
          "
          @click="voteForChoice"
        >
          <PlusIcon class="w-3 h-3" />
          <p class="text-sm">vote</p>
        </button>
        <button
          v-if="thresholdReached"
          class="ml-3 flex gap-2 justify-start items-center text-white p-1 rounded-md shadow-sm bg-green-600 hover:shadow-lg transition-shadow duration-300"
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
  if (!props.isAuthed) {
    return
  }
  if (thresholdReached.value) {
    router.push({ name: 'home.polls.results', params: { choiceId: props.choice._id } })
  }
}

async function voteForChoice() {
  if (!canDoAction || props.choice.isSelected) {
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
    if (error.code === 403) {
      if (error.message.includes('Threshold has been reached.')) {
        emit('show-modal', {
          title: 'Threshold reached',
          message:
            'The threshold for this item was reached! To protect the anonymity of the current voters, you can no longer join. However, the group of voters may choose to reveal themselves IRL.'
        })
      } else if (error.message.includes('Expiration date has been reached.')) {
        emit('show-modal', {
          title: 'Poll ended',
          message:
            'This poll has ended, so you can no longer cast a vote. Refresh this page to see the results, or start a new poll!'
        })
      } else {
        console.error('Error selecting choice:', error.message)
      }
    } else {
      console.error('Error selecting choice:', error.message)
    }
  })
}
</script>
