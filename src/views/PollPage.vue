<template>
  <!-- Poll result view -->
  <div v-if="choice && username && (choice.votes ?? []).length >= poll.threshold" class="px-4">
    <div class="flex content-center mb-2 py-4">
      <button class="mr-4" @click="navigateBack">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <div>
        <h2 class="text-lg font-bold">{{ choice.title }}</h2>
        <p class="text-sm">
          This option reached the threshold of {{ poll.threshold }}. The people who chose this option are shown below.
        </p>
        <div class="flex mt-2">
          <div class="bg-indigo-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
            Votes: {{ choice.votes.length }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="flex">
        <div v-for="vote in choice.votes" :key="vote._id" class="bg-white rounded-lg shadow-md px-6 py-2 m-4">
          {{ vote.owner }}
        </div>
      </div>
    </div>
  </div>
  <!-- Grid of responses -->
  <div v-else class="flex flex-col justify-between flex-1 p-4">
    <div>
      <p v-if="username" class="text-sm mb-4 text-gray-700">
        Threshold Polls are meant for coordination in real life. As a result, if an option you vote for crosses the
        threshold, your <b class="text-black">real username</b> will be revealed to your fellow voters. Your current username
        is <b class="text-black">{{ username }}</b
        >.
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows pb-4">
        <template v-for="item in choices" :key="item._id">
          <ChoiceItem
            :choice="item"
            :threshold="poll.threshold"
            :is-expired="isExpired"
            :is-authed="username != null"
            @show-modal="showModal"
          />
        </template>
      </div>
    </div>
    <ResponseInput v-if="!isExpired && username != null" @response-sent="refreshPollData" />
    <div v-else-if="!username" class="flex flex-col">
      <p class="text-gray-700 text-sm text-center">
        <a class="cursor-pointer font-bold underline" @click="loginWithReturn">Log in</a> or
        <a class="cursor-pointer font-bold underline" @click="signupWithReturn">sign up</a> to participate in this poll!
      </p>
      <p class="italic underline text-center text-xs mt-2">
        <a
          class="cursor-pointer"
          @click="
            showModal({
              title: 'Why do I need an account for threshold polls?',
              message:
                'Threshold Polls are meant for coordination in real life. As a result, if an option you vote for crosses the threshold, your username is revealed to your fellow voters. Signing up ensures you have a username to reveal!'
            })
          "
          >Why?</a
        >
      </p>
    </div>
    <p v-else class="text-gray-700 text-sm text-center">
      This poll has ended and no new votes can be cast. <br />
      Start a new one at any time!
    </p>
  </div>
  <ThemedModal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>
      <div class="pt-2">
        {{ modalContent.title }}
      </div>
    </template>
    <p>{{ modalContent.message }}</p>
  </ThemedModal>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useStore from '../composables/global/useStore'
import ResponseInput from '../components/Polls/ResponseInput.vue'
import ChoiceItem from '../components/Polls/ChoiceItem.vue'
import ThemedModal from '../components/Shared/ThemedModal.vue'
import SocketioService from '../service/socket.service'
import { VueCookieNext } from 'vue-cookie-next'
import { ChevronLeftIcon } from '@heroicons/vue/outline'

const route = useRoute()
const router = useRouter()
const { inspectPoll, loadUser, loadPollResponses, getLoggedInStatus, getId } = useStore

const wsInstance = reactive({})
const poll = ref({})
const username = ref('')
const isModalOpen = ref(false)
const modalContent = ref({ title: '', message: '' })

const choices = computed(() => poll.value.choices || [])
const isExpired = computed(() => new Date(poll.value.expirationDate) < new Date())
// For viewing a choice's details
const choiceId = computed(() => route.params.choiceId)
const choice = computed(() => choices.value.find((item) => item._id === choiceId.value))

/**
 * Join topic if topic exist and
 * user is logged in (either guest or user)
 */
function joinTopic(topicId) {
  if (topicId && getLoggedInStatus.value) {
    wsInstance.value.joinTopic({
      topicId,
      token: VueCookieNext.getCookie('access_token')
    })
  }
}

/**
 * Method to reconnect poll and choice websocket calls on
 * initialization and disconnection
 */
const reconnectSockets = () => {
  wsInstance.value.addErrorHandler()
  wsInstance.value.addChoiceHandler(choiceHandler)
  joinTopic(route.params.channelId)

  wsInstance.value.onConnect(() => {
    setTimeout(() => {
      joinUser()
    }, 100)
  })
}

/**
 * Load poll and responses
 */
onMounted(async () => {
  const user = await loadUser()
  username.value = user.username
  await refreshPollData()

  // Set up WebSocket handler for poll choices
  wsInstance.value = new SocketioService()
  wsInstance.value.addDisconnectHandler(reconnectSockets)
  reconnectSockets()
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
    const responseData = await loadPollResponses(pollId)
    // Enrich choice objects with response data when available
    responseData.forEach((response) => {
      const choice = choices.value.find((c) => c.text === response.choice)
      if (choice) {
        if (!choice.votes) {
          choice.votes = [response]
        } else {
          choice.votes.push(response)
        }
      }
    })
  } catch (error) {
    console.log('Error fetching poll responses:', error.response.data.message)
  }
}

function choiceHandler(data) {
  refreshPollData()
}

async function refreshPollData() {
  fetchPollDetails(route.params.pollId)
  fetchPollResponses(route.params.pollId)
}

function joinUser() {
  if (getLoggedInStatus.value) {
    wsInstance.value.joinUser({
      userId: getId.value,
      token: VueCookieNext.getCookie('access_token')
    })
  }
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
        await refreshPollData()
      } catch (error) {
        console.error('Error in watcher callback:', error)
      }
    }
  }
)

function navigateBack() {
  router.push({ name: 'home.polls', params: { pollId: route.params.pollId } })
}

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
}

function showModal(value) {
  window.scrollTo({ top: 0, left: 0 })
  isModalOpen.value = true
  modalContent.value = value
  document.querySelector('body').classList.add('modal-open')
}

function loginWithReturn() {
  router.push({ name: 'home.login', query: { to: router.currentRoute.value.path } })
}

function signupWithReturn() {
  router.push({ name: 'home.createAccount', query: { to: router.currentRoute.value.path } })
}

onUnmounted(() => {
  wsInstance.value.disconnectPoll()
})
</script>
