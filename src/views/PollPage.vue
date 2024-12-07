<template>
  <!-- Poll result view -->
  <!-- <div v-if="response && response.votes >= thresholdValue" class="px-4">
    <div class="flex content-center mb-2 py-4">
      <button class="mr-4" @click="navigateBack">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <div>
        <h2 class="text-lg font-bold">{{ response.title }}</h2>
        <p class="text-sm">
          This option reached the threshold of {{ thresholdValue }}. The people who chose this option are shown below.
        </p>
        <div class="flex mt-2">
          <div class="bg-green-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
            Votes: {{ response.votes }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="flex">
        <div v-for="voter in response.voters" :key="voter" class="bg-white rounded-lg shadow-md px-6 py-2 m-4">
          {{ voter }}
        </div>
      </div>
    </div>
  </div> -->
  <!-- Grid of responses -->
  <div class="flex flex-col justify-between flex-1 p-4">
    <div class="overflow-y-auto max-h-96 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows pb-4">
      <template v-for="choice in choices" :key="choice._id">
        <ChoiceItem :choice="choice" :threshold="poll.threshold" :is-expired="isExpired" @choice-clicked="refreshPollData" />
      </template>
    </div>
    <ResponseInput v-if="!isExpired" @response-sent="refreshPollData" />
    <p v-else class="text-gray-700 text-sm text-center">
      This poll has ended and no new votes can be cast. <br />
      Start a new one at any time!
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import useStore from '../composables/global/useStore'
import ResponseInput from '../components/Polls/ResponseInput.vue'
import ChoiceItem from '../components/Polls/ChoiceItem.vue'
import SocketioService from '../service/socket.service'
// import { ChevronLeftIcon } from '@heroicons/vue/outline'

const route = useRoute()
// const router = useRouter()
const { inspectPoll, loadUser, loadPollResponses } = useStore

const wsInstance = reactive({})
const poll = ref({})
const userId = ref('')
const choices = computed(() => poll.value.choices || [])
const responses = ref([])
const choiceToResponseMap = computed(() => {
  const map = {}
  responses.value.forEach((response) => {
    console.log(response)
    if (!map[response.choice]) {
      map[response.choice] = []
    }
    map[response.choice].push(response)
  })
  return map
})

/**
 * Load poll and responses
 */
onMounted(async () => {
  const user = await loadUser()
  userId.value = user.id
  await refreshPollData()

  // Set up WebSocket handler for poll choices
  wsInstance.value = new SocketioService()
  wsInstance.value.addChoiceHandler(async () => {
    await refreshPollData()
  }, user)
})

async function fetchPollDetails(pollId) {
  try {
    poll.value = await inspectPoll(pollId)
  } catch (error) {
    console.error('Error fetching poll details:', error)
  }
}

async function fetchPollResponses(pollId) {
  // Add fetchPollResponses function
  try {
    responses.value = await loadPollResponses(pollId)
    console.log(responses.value)
    console.log(choiceToResponseMap.value)
  } catch (error) {
    console.error('Error fetching poll responses:', error)
  }
}

async function refreshPollData() {
  fetchPollDetails(route.params.pollId)
  fetchPollResponses(route.params.pollId)
}

/**
 * Watch pollId on router params to
 * clear and fetch responses for new poll
 */
watch(
  () => route.params.pollId,
  async (pollId, prevPollId) => {
    if (pollId !== undefined && pollId !== prevPollId) {
      try {
        await fetchPollDetails(pollId)
      } catch (error) {
        console.error('Error in watcher callback:', error)
      }
    }
  }
)
// const responseId = computed(() => route.params.responseId)
// const response = computed(() => responses.value.find((item) => item.id === responseId.value))

const isExpired = computed(() => new Date(poll.value.expirationDate) < new Date())

// function navigateBack() {
//   router.push({ name: 'home.polls', params: { pollId: route.params.pollId } })
// }
</script>
