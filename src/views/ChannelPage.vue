<template>
  <div class="flex flex-col flex-1 sm:mt-2 sm:p-4 bg-gray-50">
    <div class="flex flex-col-reverse flex-1 gap-2 sm:gap-0 sm:flex-row">
      <div
        class="absolute top-0 z-10 flex flex-col flex-1 w-full h-full pl-20 transition-all duration-500 ease-in-out bg-gray-100 border-r border-gray-300 shadow sm:transition-none sm:w-52 sm:bg-gray-100 sm:flex-initial sm:rounded-l sm:relative sm:z-0 sm:left-0 sm:pl-0"
      >
        <div class="flex items-center justify-between sm:hidden">
          <router-link :to="path" class="pl-4 text-lg font-bold sm:text-2xl text-harvard-red">nymspace </router-link>
        </div>
        <div
          class="flex items-center justify-between gap-6 px-4 pt-4 border-gray-300 rounded-tl rounded-tr sm:border-b sm:p-2 sm:shadow-sm h-11"
        >
          <h2 class="text-xl font-bold truncate threads-title">
            <button class="w-full truncate" @click="openModal">
              {{ channel.name }}
            </button>
          </h2>

          <div class="flex items-center gap-2">
            <EditChannel :item="channel" :show="canEditDeleteChannel(channel)" />
            <DeleteChannel
              :show="canEditDeleteChannel(channel)"
              :name="channel.name"
              @delete-channel="processDeleteChannel"
            />
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <SpaceList :items="sortedItems" />
        </div>
        <div class="flex flex-col gap-1 p-4">
          <CreateSpace :show="canCreate" />
        </div>
      </div>
      <ThreadHeader
        :thread="maybeThread"
        :channel="channel"
        :is-thread-active="isThreadActive"
        :can-edit-delete-thread="canEditDeleteThread"
      />
    </div>
    <ThemedModal :is-open="isModalOpen" @close-modal="closeModal">
      <template #title>{{ channel.name }}</template>
      <div class="text-xl"></div>
    </ThemedModal>
  </div>
</template>

<script setup>
import SpaceList from '../components/Shared/SpaceList.vue'
import CreateSpace from '../components/Shared/CreateSpace.vue'
import useStore from '../composables/global/useStore'
import ThreadHeader from '../components/Threads/ThreadHeader.vue'
import { onMounted, computed, ref, onBeforeUnmount, onUnmounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SocketioService from '../service/socket.service'
import { VueCookieNext } from 'vue-cookie-next'
import DeleteChannel from '../components/Channels/DeleteChannel.vue'
import EditChannel from '../components/Channels/EditChannel.vue'
import ThemedModal from '../components/Shared/ThemedModal.vue'

const route = useRoute()

onBeforeUnmount(() => setShowChatOnly(false))

const {
  // Channels
  getChannel,
  loadChannel,
  setActiveChannel,
  deleteChannel,

  // Threads
  getThreads,
  getThread,
  loadThreads,
  loadUserThreads,
  getUserThreads,
  setThread,
  upsertThread,

  // Polls
  getPolls,
  // getPoll,
  loadPolls,
  // setPoll,

  // Users and settings
  setShowChatOnly,
  getGuestStatus,
  getLoggedInStatus,
  getId
} = useStore

const router = useRouter()
const threads = getThreads
const polls = getPolls
const wsInstance = reactive({})
const channel = ref(getChannel(route.params.channelId))
const maybeThread = ref(getThread(route.params.threadId))
const isThreadActive = ref(false)
// const isPollActive = ref(false)
const isChannelOwner = computed(() => getId.value === channel.value?.owner)
const isChannelThreadCreationAllowed = computed(() => channel.value?.threadCreationAllowed)
const isModalOpen = ref(false)

function openModal() {
  document.querySelector('body').classList.add('modal-open')
  isModalOpen.value = true
}

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
}

const path = import.meta.env.VITE_PATH ? `${import.meta.env.VITE_PATH}/` : '/'

/**
 * Watch thread id to show/hide edit/delete buttons on the side of
 * create thread button
 */
watch(
  () => route.params.threadId,
  async (newId) => {
    if (newId) {
      isThreadActive.value = true
      maybeThread.value = getThread(newId)
    } else {
      isThreadActive.value = false
    }
  },
  {
    immediate: true
  }
)

// Compare method to sort the threads to put followed threads at top
function compareFollowed(a, b) {
  if (a.isFollowed && b.isFollowed) {
    return 0
  }
  if (a.isFollowed) {
    return -1
  } else return 1
}

const sortedItems = computed(() => [...threadsWithFollow.value, ...pollsWithType.value].sort(compareFollowed))
// Add isFollowed property to update if the thread is followed by user
// Add type property to distinguish space types in SpaceList.
const threadsWithFollow = computed(() =>
  threads.value.map((x) => ({
    ...x,
    isFollowed: getUserThreads.value.some((y) => y.id === x.id && 'followed' in y && y.followed),
    type: 'thread'
  }))
)

const pollsWithType = computed(() =>
  polls.value.map((x) => ({
    ...x,
    type: 'poll'
  }))
)

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
 * Handle thread creation
 */
function threadHandler(data) {
  if (route.params.channelId === data.topic.id) {
    const { id, isFollowed, messages, name, slug, owner } = data
    setThread({
      id,
      isFollowed,
      messageCount: messages.length,
      name,
      slug,
      owner: owner?.id
    })
  }
}

/**
 * Handle thread update
 */
function updateThreadHandler(data) {
  upsertThread(data)
}

const canCreate = computed(() => isChannelOwner.value || isChannelThreadCreationAllowed.value || false)

async function processDeleteChannel() {
  await deleteChannel(route.params.channelId)
  router.push('/')
}
function canEditDeleteChannel(item) {
  return !getGuestStatus.value && item.owner === getId.value
}
const canEditDeleteThread = computed(() => maybeThread.value.owner === getId.value)

/**
 * Method to reconnect thread websocket calls on
 * initialization and disconnection
 */
const reconnectSockets = () => {
  wsInstance.value.addThreadHandler(threadHandler)
  wsInstance.value.addThreadUpdateHandler(updateThreadHandler)
  joinTopic(route.params.channelId)
}

onMounted(async () => {
  await loadUserThreads()
  await loadThreads(route.params.channelId)
  await loadPolls(route.params.channelId)

  if (Object.keys(channel.value).length === 0) {
    channel.value = { ...(await loadChannel(route.params.channelId)) }
  } else {
    channel.value = getChannel(route.params.channelId)
  }
  maybeThread.value = getThread(route.params.threadId)

  wsInstance.value = new SocketioService()
  wsInstance.value.addDisconnectHandler(reconnectSockets)
  reconnectSockets()

  setActiveChannel(channel.value)
})

onUnmounted(() => {
  wsInstance.value.disconnectTopic()
})
</script>
<style scoped>
.threads-title {
  @apply overflow-hidden;
  text-overflow: ellipsis;
}
</style>
