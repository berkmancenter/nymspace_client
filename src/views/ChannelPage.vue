<template>
  <div
    class="fixed inset-0 sm:relative sm:inset-auto flex flex-col flex-1 sm:p-4 bg-gray-50 overflow-hidden h-screen max-h-screen"
  >
    <splitpanes class="flex flex-1 sm:gap-0 sm:rounded shadow overflow-hidden h-full" @resize="onPaneResize">
      <pane
        :size="isMobile && threadsMenuOpen ? 100 : isMobile ? 0 : isMedium ? 22 : sidebarSize"
        :min-size="isMobile && threadsMenuOpen ? 100 : isMobile ? 0 : isMedium ? 22 : 10"
        :max-size="isMobile && threadsMenuOpen ? 100 : isMobile ? 0 : 50"
        class="overflow-hidden"
      >
        <div
          class="flex flex-col h-full bg-gray-100 border-r border-gray-300 shadow sm:bg-gray-100 sm:rounded-l overflow-hidden"
        >
          <div
            class="flex items-center justify-between gap-6 pl-2 pt-4 border-gray-300 rounded-tl rounded-tr sm:border-b sm:p-2 sm:shadow-sm h-11 flex-shrink-0"
          >
            <h2 class="text-xl font-bold truncate threads-title">
              {{ channel.name }}
            </h2>
            <div class="flex items-center gap-2 pr-2">
              <EditChannel :item="channel" :show="canEditDeleteChannel(channel)" />
              <DeleteChannel
                :show="canEditDeleteChannel(channel)"
                :name="channel.name"
                @delete-channel="processDeleteChannel"
              />
              <button v-if="isMobile" class="sm:hidden" @click="toggleSideMenu">
                <XIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto overflow-x-hidden">
            <SpaceList :items="sortedItems" :toggle-side-menu="toggleSideMenu" />
          </div>
          <div class="flex flex-col gap-1 p-4 flex-shrink-0">
            <CreateSpace :show="canCreate" :is-logged-in="isLoggedIn" />
          </div>
        </div>
      </pane>

      <pane
        :size="isMobile && threadsMenuOpen ? 0 : isMobile ? 100 : 100 - sidebarSize"
        class="main-content-pane flex flex-col overflow-hidden"
      >
        <ThreadHeader
          v-if="isThreadActive"
          :thread="maybeThread"
          :channel="channel"
          :is-thread-active="isThreadActive"
          :toggle-side-menu="toggleSideMenu"
          :is-admin="canEditDeleteThread"
        />
        <PollHeader
          v-else-if="isPollActive"
          :poll="maybePoll"
          :toggle-side-menu="toggleSideMenu"
          :is-admin="canEditDeleteThread"
        />

        <div v-else class="flex flex-col flex-1 overflow-hidden bg-white shadow sm:rounded-r shrink">
          <div class="flex justify-between gap-6 p-2 bg-white border-b rounded-tl shadow-sm h-11 sm:pl-5 flex-shrink-0">
            <div class="flex gap-2 truncate">
              <button class="sm:hidden" @click="toggleSideMenu">
                <ViewListIcon class="w-6 text-black h-7" />
              </button>
              <div></div>
            </div>
            <div class="flex items-center gap-2"></div>
          </div>
          <div class="flex flex-col justify-center flex-1 w-full p-2 text-center text-gray-500 overflow-hidden">
            <p>Select or create a new space to get started.</p>
          </div>
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script setup>
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import SpaceList from '../components/Shared/SpaceList.vue'
import CreateSpace from '../components/Shared/CreateSpace.vue'
import useStore from '../composables/global/useStore'
import ThreadHeader from '../components/Threads/ThreadHeader.vue'
import PollHeader from '../components/Polls/PollHeader.vue'
import { onMounted, computed, ref, onBeforeUnmount, onUnmounted, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SocketioService from '../service/socket.service'
import { VueCookieNext } from 'vue-cookie-next'
import DeleteChannel from '../components/Channels/DeleteChannel.vue'
import EditChannel from '../components/Channels/EditChannel.vue'
import { ViewListIcon, XIcon } from '@heroicons/vue/outline'

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
  loadConfig,

  // Polls
  getPolls,
  loadPolls,
  addPoll,
  getPollFromList,

  // Users and settings
  setShowChatOnly,
  getGuestStatus,
  getLoggedInStatus,
  getId
} = useStore

const router = useRouter()
const threads = getThreads
const thread = getThread
const polls = getPolls
const wsInstance = reactive({})
const channel = ref(getChannel(route.params.channelId))
const maybeThread = ref(getThread(route.params.threadId))
const maybePoll = ref(getPollFromList(route.params.pollId))
const isThreadActive = ref(false)
const isPollActive = ref(false)
const isChannelOwner = computed(() => getId.value === channel.value?.owner)
const isChannelThreadCreationAllowed = computed(() => channel.value?.threadCreationAllowed)
const isLoggedIn = computed(() => getLoggedInStatus.value)

const sidebarSize = ref(22)
const isMobile = ref(false)
const isMedium = ref(false)

const threadsMenuOpen = ref(!route.params.threadId)
function toggleSideMenu() {
  threadsMenuOpen.value = !threadsMenuOpen.value
}

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

watch(
  () => route.params.pollId,
  async (newId) => {
    if (newId) {
      isPollActive.value = true
      maybePoll.value = getPollFromList(newId)
    } else {
      isPollActive.value = false
    }
  },
  {
    immediate: true
  }
)

/**
 * Watch for changes to the thread and update it so that
 * the thread name and lock state in sync after editing
 */
watch(
  thread,
  async () => {
    maybeThread.value = getThread(route.params.threadId)
  },
  {
    immediate: true
  }
)

// Compare method to sort the spaces to put followed threads at top.
// If not followed, sort to put most recently updated spaces at the top.
function sortSpaces(a, b) {
  if (!a.isFollowed && !b.isFollowed) {
    return new Date(b.createdAt) - new Date(a.createdAt)
  }
  if (a.isFollowed && b.isFollowed) {
    return 0
  }
  if (a.isFollowed) {
    return -1
  } else return 1
}

const sortedItems = computed(() => [...threadsWithFollow.value, ...pollsWithType.value].sort(sortSpaces))
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
    const { id, isFollowed, messageCount, name, slug, owner } = data
    setThread({
      id,
      isFollowed,
      messageCount,
      name,
      slug,
      owner: owner?.id
    })
  }
}

/**
 * Handle poll creation
 */

function pollHandler(data) {
  if (route.params.channelId === data.topic.id) {
    addPoll({
      ...data,
      _id: data.id
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
  wsInstance.value.addPollHandler(pollHandler)
  wsInstance.value.addThreadUpdateHandler(updateThreadHandler)
  joinTopic(route.params.channelId)
}

function onPaneResize(event) {
  if (
    !isMobile.value &&
    event &&
    Array.isArray(event) &&
    event.length > 0 &&
    event[0] &&
    typeof event[0].size === 'number'
  ) {
    sidebarSize.value = event[0].size
  }
}

function checkMobile() {
  isMobile.value = window.innerWidth <= 641
  isMedium.value = window.innerWidth <= 768
}

function handleResize() {
  checkMobile()
}

onMounted(async () => {
  checkMobile()

  await loadConfig()
  await loadUserThreads()
  await loadThreads(route.params.channelId)
  await loadPolls(route.params.channelId)

  if (Object.keys(channel.value).length === 0) {
    channel.value = { ...(await loadChannel(route.params.channelId)) }
  } else {
    channel.value = getChannel(route.params.channelId)
  }
  maybeThread.value = getThread(route.params.threadId)
  maybePoll.value = getPollFromList(route.params.pollId)

  wsInstance.value = new SocketioService()
  wsInstance.value.addDisconnectHandler(reconnectSockets)
  reconnectSockets()

  setActiveChannel(channel.value)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  wsInstance.value.disconnectTopic()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
:deep(.splitpanes) {
  overflow: hidden !important;
}

:deep(.splitpanes__pane) {
  overflow: hidden !important;
}

:deep(.splitpanes__splitter) {
  background-color: transparent;
  border: none;
  position: relative;
  width: 12px;
  margin-left: -6px;
  margin-right: -6px;
  cursor: col-resize;
}

:deep(.splitpanes__splitter:before) {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #e5e7eb;
  transform: translateX(-50%);
  transition: all 0.2s ease;
}

:deep(.splitpanes__splitter:hover:before) {
  background-color: #9ca3af;
  width: 3px;
}

.main-content-pane {
  overflow: hidden;
}

/* Mobile-specific fixes */
@media (max-width: 640px) {
  :deep(.splitpanes__splitter) {
    display: none !important;
  }
}
</style>
