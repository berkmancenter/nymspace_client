<template>
  <div class="flex-1 flex flex-col min-h-0">
    <ExportNotice />
    <splitpanes class="h-full" @resize="onPaneResize">
      <pane :size="mainPaneSize" :min-size="40" :class="{ 'mobile-slide-left': isMobile && selectedThreadMessage }">
        <div class="h-full flex flex-col overflow-hidden">
          <MessagesView
            :ref="
              (el) => {
                if (el) messageViewRef = el
              }
            "
            :key="2"
            :items="updatedMsgs"
            :user-id="userId"
            @tag-click="tagClick"
            @reply-click="handleReplyClick"
            @view-thread="handleViewThread"
          />
          <div class="mt-5 text-xs">
            <div class="relative">
              <span
                v-if="newMessagesNotice"
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 px-3 py-1 text-xs text-white bg-harvard-red rounded cursor-pointer hover:bg-red-700 whitespace-nowrap"
                @click="onNewMessagesClick"
              >
                New messages
              </span>
            </div>
            <div
              v-if="pseudonymMismatch"
              class="z-50 w-full p-1 text-center text-yellow-800 transition-all bg-yellow-100 sm:rounded-t"
              style="margin-top: 1rem"
            >
              The pseudonym for this thread is
              <strong>{{ pseudonymForThread.pseudonym }}</strong
              >. Please switch to this pseudonym to send a message.
            </div>

            <div
              v-if="message.length >= getMaxMessageLength"
              class="z-50 w-full p-1 text-center text-yellow-800 transition-all bg-yellow-100 sm:rounded-t"
            >
              You are over the character limit and cannot send this message.
            </div>
            <div
              v-if="shouldDisplayMessageHitTheButton && !shouldDisplayMessageBoxLocked"
              class="z-50 w-full p-1 text-center text-yellow-800 transition-all bg-yellow-100 sm:rounded-t"
            >
              This thread is in hit the button mode. Your messages will not be sent until the button is hit by the thread
              creator.
            </div>
            <div
              v-if="shouldDisplayMessageBoxLocked"
              class="z-50 w-full p-1 text-center text-yellow-800 transition-all bg-yellow-100 sm:rounded-t"
            >
              This thread is now locked. Messages cannot be sent until it is unlocked by the thread creator.
            </div>
            <div
              v-if="discussionPause"
              class="z-50 w-full p-1 text-center text-yellow-800 transition-all bg-yellow-100 sm:rounded-t"
            >
              The discussion has been paused for {{ discussionPause }} seconds. Please take a moment to consider feedback
              from the discussion facilitator before responding.
            </div>
            <div
              v-if="shouldDisplayUnableToSendMessage && !shouldDisplayMessageBoxLocked"
              class="z-50 w-full p-1 text-center text-white transition-all bg-harvard-red sm:rounded-t"
            >
              {{ unableToSendSpecialMessage || 'Unable to send message. Please try again later.' }}
            </div>
            <PromptDirtyDraft :show="prompt" @response="response" />
          </div>

          <TagList
            :items="filteredTags"
            :visible="tagListVisible"
            :msg-txt-area="messageInput?.textareaRef || null"
            @tag-click="tagClick"
          />

          <div class="flex flex-col pl-4">
            <div
              v-if="!pseudonymMismatch && !shouldDisplayMessageBoxLocked"
              class="mb-2 mr-4"
              :class="sending ? 'animate-pulse' : ''"
            >
              <MessageInput
                ref="messageInput"
                v-model="message"
                :max-length="getMaxMessageLength"
                :sending="sending"
                :disabled="discussionPause > 0"
                :has-error="shouldDisplayMessageBoxLocked || shouldDisplayUnableToSendMessage || discussionPause > 0"
                @send="sendMessage"
              />
            </div>
          </div>
        </div>
      </pane>
      <pane
        :size="replyPaneSize"
        :max-size="selectedThreadMessage ? 100 : 0"
        :min-size="selectedThreadMessage ? 20 : 0"
        :class="{ 'mobile-slide-in': isMobile && selectedThreadMessage }"
      >
        <div class="h-full overflow-hidden relative sm:ml-1">
          <ReplyThreadPanel
            v-if="selectedThreadMessage"
            :parent-message="selectedThreadMessage"
            :replies="threadReplies"
            :user-id="getActivePseudonym?._id"
            :loading="loadingReplies"
            :thread-locked="shouldDisplayMessageBoxLocked"
            @close="closeReplyThread"
            @send-reply="sendReplyToThread"
          />
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script setup>
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { onMounted, ref, nextTick, watch, onUnmounted, computed, watchEffect, reactive } from 'vue'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import MessagesView from '../components/Messages/MessagesView.vue'
import TagList from '../components/Messages/TagList.vue'
import PromptDirtyDraft from '../components/Messages/PromptDirtyDraft.vue'
import ReplyThreadPanel from '../components/Messages/ReplyThreadPanel.vue'
import MessageInput from '../components/Messages/MessageInput.vue'
import ExportNotice from '../components/Banner/ExportNotice.vue'
import useStore from '../composables/global/useStore'
import { useMessageScroll } from '../composables/useMessageScroll'
import SocketioService from '../service/socket.service'
import ThreadService from '../service'
import { VueCookieNext } from 'vue-cookie-next'

const route = useRoute()
const router = useRouter()
const {
  loadMessages,
  addMessage,
  getMessages,
  clearMessages,
  loadThread,
  getLoggedInStatus,
  getMaxMessageLength,
  getThread,
  getPseudonyms,
  getActivePseudonym,
  getId,
  loadUser,
  updateMessage,
  setActiveThread,
  getActiveThread,
  getThreads
} = useStore

const messages = getMessages
const message = ref('')
const tagListVisible = ref(false)

const selectedThreadMessage = ref(null)
const threadReplies = ref([])
const loadingReplies = ref(false)
const messageViewRef = ref(null)
const messageInput = ref(null)
const thread = ref(getThread(route.params.threadId))
const pseudonymForThread = computed(() => {
  return getPseudonyms.value.filter((x) => {
    if (!x.threads) {
      return false
    }

    return x.threads.includes(thread.value?.id)
  })[0]
})

const pseudonymMismatch = computed(() => {
  return pseudonymForThread.value && pseudonymForThread.value?._id !== getActivePseudonym.value?._id
})
const searchTag = ref('')
const goodReputation = ref(false)

const wsInstance = reactive({})
const shouldDisplayMessageBoxLocked = ref(false)
const shouldDisplayMessageHitTheButton = ref(false)
const discussionPause = ref(0)
const shouldDisplayUnableToSendMessage = ref(false)
const unableToSendSpecialMessage = ref('')
const userId = ref('')

const { newMessagesNotice, scrollToBottom, handleNewMessage, onNewMessagesClick } = useMessageScroll({
  containerRef: messageViewRef,
  userId: computed(() => getActivePseudonym.value?._id)
})

/**
 * Dialog feature
 */
const resolveRef = ref({})
const rejectRef = ref({})
const prompt = ref(false)
const sending = ref(false)

const isMobile = ref(false)
const basePaneSize = ref({ main: 60, reply: 40 })

const mainPaneSize = computed(() => {
  if (!selectedThreadMessage.value) {
    return 100
  }
  return basePaneSize.value.main
})

const replyPaneSize = computed(() => {
  if (!selectedThreadMessage.value) {
    return 0
  }
  if (isMobile.value && selectedThreadMessage.value) {
    return 100
  }
  return basePaneSize.value.reply
})

function onPaneResize(event) {
  if (!isMobile.value && event && Array.isArray(event) && event.length >= 2) {
    if (event[0] && typeof event[0].size === 'number') {
      basePaneSize.value.main = event[0].size
    }
    if (event[1] && typeof event[1].size === 'number') {
      basePaneSize.value.reply = event[1].size
    }
  }
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768 // md breakpoint in Tailwind
}

function handleResize() {
  checkMobile()
}

onBeforeRouteLeave(async (to, from) => {
  return await processDirtyMessage()
})

onBeforeRouteUpdate(async (to, from) => {
  return await processDirtyMessage()
})

const processDirtyMessage = async () => {
  const promise = new Promise((resolve, reject) => {
    resolveRef.value = resolve
    rejectRef.value = reject
  })
  if (message.value.trim().length > 0) {
    prompt.value = true
  } else {
    resolveRef.value(true)
  }
  const val = await promise
  if (val) {
    message.value = ''
  }
  return val
}

/**
 * Dialog prompt response call
 */
const response = (value) => {
  resolveRef.value(value)
  prompt.value = false
}

watch(
  () => getActiveThread.value,
  async (now, prev) => {
    if (now?.id === prev?.id) {
      if (now?.locked) {
        shouldDisplayMessageBoxLocked.value = true
      } else {
        shouldDisplayMessageBoxLocked.value = false
      }
      if (now?.hitTheButton) {
        shouldDisplayMessageHitTheButton.value = true
      } else {
        shouldDisplayMessageHitTheButton.value = false
      }
    } else {
      shouldDisplayMessageBoxLocked.value = now?.locked
      shouldDisplayMessageHitTheButton.value = now?.hitTheButton
    }
  },
  {
    immediate: true
  }
)

/**
 * Get tags based on messages
 */
const tags = computed(() => {
  const tags = []
  getMessages.value.forEach((element) => {
    if (element.pseudonym !== undefined && tags.indexOf(element.pseudonym) === -1) tags.push(element.pseudonym)
  })
  tags.sort()
  return tags
})

/**
 * Filter tags based on search text after @ symbol
 */
const filteredTags = computed(() => {
  if (tagListVisible.value) {
    if (searchTag.value.length === 0) {
      return tags.value
    }
    // Case insensitive filter
    return tags.value.filter((x) => x.toLowerCase().startsWith(searchTag.value.toLowerCase()))
  }
  return []
})

/**
 * Update messages array to add property
 * that determines if user can vote
 */
const updatedMsgs = computed((x) => {
  const isNotOwner = (x) => x.pseudonymId !== getActivePseudonym.value?._id

  /**
   * This condition might change based on how backend handles
   * the alternate voting for same message
   */
  const hasNotVoted = (x) =>
    x.upVotes.findIndex((y) => y.owner === getId.value) === -1 &&
    x.downVotes.findIndex((y) => y.owner === getId.value) === -1

  const result = messages.value.map((x) => ({
    ...x,
    canVote: hasNotVoted(x) && isNotOwner(x),
    goodReputation: goodReputation.value,
    hasUpvoted: x.upVotes.findIndex((y) => y.owner === getId.value) > -1,
    hasDownvoted: x.downVotes.findIndex((y) => y.owner === getId.value) > -1
  }))

  return result
})

function handleReplyClick(messageItem) {
  const messageId = messageItem.id || messageItem._id
  router.push({
    name: 'home.threads.reply',
    params: {
      channelId: route.params.channelId,
      threadId: route.params.threadId,
      replyId: messageId
    }
  })
}

async function handleViewThread(messageItem) {
  const messageId = messageItem.id || messageItem._id
  router.push({
    name: 'home.threads.reply',
    params: {
      channelId: route.params.channelId,
      threadId: route.params.threadId,
      replyId: messageId
    }
  })

  selectedThreadMessage.value = messageItem
  loadingReplies.value = true

  try {
    const replies = await ThreadService.getMessageReplies(messageItem.id || messageItem._id)
    threadReplies.value = replies
  } catch (error) {
    console.error('Failed to load replies:', error)
    threadReplies.value = []
  } finally {
    loadingReplies.value = false
  }
}

function closeReplyThread() {
  selectedThreadMessage.value = null
  threadReplies.value = []
  router.push({
    name: 'home.threads',
    params: {
      channelId: route.params.channelId,
      threadId: route.params.threadId
    }
  })
}

async function sendReplyToThread(replyText) {
  if (!replyText.trim() || !selectedThreadMessage.value) return

  try {
    const messageData = {
      body: replyText,
      thread: route.params.threadId,
      user: getActivePseudonym.value?.pseudonym,
      parentMessage: selectedThreadMessage.value.id || selectedThreadMessage.value._id
    }

    await wsInstance.value.sendMessage({
      message: messageData,
      userId: getId.value,
      token: VueCookieNext.getCookie('access_token')
    })

    // Don't reload replies here - the websocket message handler will add the new reply
    // await handleViewThread(selectedThreadMessage.value)
  } catch (error) {
    console.error('Failed to send reply:', error)
  }
}

async function sendMessage(messageText) {
  shouldDisplayUnableToSendMessage.value = false
  unableToSendSpecialMessage.value = ''

  if (!messageText || messageText.length >= getMaxMessageLength.value) {
    return
  }

  let complete = false
  const checkComplete = setInterval(() => {
    sending.value = true
    if (complete) {
      sending.value = false
      clearInterval(checkComplete)
    }
  }, 100)

  if (messageText.trim().length > 0 && !getActiveThread.value?.locked && !pseudonymMismatch.value) {
    try {
      await wsInstance.value.sendMessage({
        message: {
          body: messageText,
          thread: route.params.threadId,
          user: getActivePseudonym.value?.pseudonym
        },
        userId: getId.value,
        token: VueCookieNext.getCookie('access_token')
      })

      shouldDisplayUnableToSendMessage.value = false
      message.value = ''
      scrollToBottom()
    } catch (error) {
      // console.log('ERR', error)

      // 422 means user needs to try again
      if (error.statusCode === 422) {
        unableToSendSpecialMessage.value = error.message
      }

      shouldDisplayUnableToSendMessage.value = true
    }
  }
  complete = true
}

/**
 * Watch for tagging symbol, update search text and display the users list
 */
watchEffect(() => {
  const matches = /@([A-Za-z0-9]*)$/.exec(message.value)
  if (matches && matches.length > 1) {
    tagListVisible.value = true
    searchTag.value = matches[1]
  } else {
    searchTag.value = ''
    tagListVisible.value = false
  }
})

/**
 * Update tag on message to follow a taggable pattern
 */
function tagClick(value, isClickedDirect = false) {
  const pseudonym = `"${value}" `
  if (!isClickedDirect) {
    // Replace last occurrence of word starting with @
    message.value = message.value.replace(/(\w*)(?=[^@]*)$/, pseudonym)
  } else {
    message.value = message.value.replace(/$/, `@${pseudonym}`)
  }
  messageInput.value?.focus()
}

/**
 * Join thread if thread exist and
 * user is logged in (either guest or user)
 */
function joinThread(threadId) {
  if (threadId && getLoggedInStatus.value && wsInstance.value && wsInstance.value.joinThread) {
    wsInstance.value.joinThread({
      threadId,
      token: VueCookieNext.getCookie('access_token')
    })
  }
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
 * Handle received message
 */
function messageHandler(data) {
  const threadToUpdate = getThread(data.thread)

  /**
   * Update message if current thread matches the received
   * message thread
   */
  if (data.thread === route.params.threadId) {
    if (!data.parentMessage) {
      addMessage(data)
      // Handle scroll for new message
      handleNewMessage(data)
    } else {
      const parentId = data.parentMessage
      const messages = getMessages.value
      const parentIndex = messages.findIndex((m) => (m.id || m._id) === parentId)

      if (parentIndex !== -1) {
        updateMessage({
          ...messages[parentIndex],
          replyCount: (messages[parentIndex].replyCount || 0) + 1
        })
      }
    }

    if (
      selectedThreadMessage.value &&
      data.parentMessage === (selectedThreadMessage.value.id || selectedThreadMessage.value._id)
    ) {
      const formattedReply = {
        ...data,
        id: data.id || data._id,
        createdAt: data.createdAt || new Date().toISOString(),
        owner: data.owner || data.user || data.userId
      }
      threadReplies.value.push(formattedReply)
    }

    if (data.pause) {
      discussionPause.value = data.pause
      setTimeout(() => {
        discussionPause.value = 0
        scrollToBottom()
      }, data.pause * 1000)
    }
  }

  /**
   * Update thread's message count
   */

  if (threadToUpdate) {
    threadToUpdate.messageCount = data.threadMessageCount
  }
}

/**
 * Handle message voting
 */
function onVoteHandler(data) {
  if (route.params.threadId === data.thread) {
    updateMessage(data)
  }
}

/**
 * Fetch messages
 */
async function fetchMessages(threadId) {
  loadMessages(threadId).then(async () => {
    await scrollToBottom()
  })
}

/**
 * Load thread from store if exist
 * else load from API if does not exist
 */
async function fetchThreadDetails(threadId) {
  if (Object.keys(thread.value).length === 0) {
    thread.value = { ...(await loadThread(threadId)) }
  } else {
    thread.value = getThread(threadId)
  }
  setActiveThread(thread.value)
}

/**
 * Watch threadId on router params to
 * clear and fetch messages for new thread and
 * automatically join thread on load of new
 * thread
 */
watch(
  () => route.params.threadId,
  async (threadId, prevThreadId) => {
    if (threadId !== undefined && threadId !== prevThreadId) {
      clearMessages()
      await fetchMessages(threadId)
      await fetchThreadDetails(threadId)
      joinThread(threadId)
    }
  }
)

/**
 * Watch replyId on router params to open replies to a message
 * when on a replies URI
 */
watch(
  () => route.params.replyId,
  async (replyId) => {
    if (replyId && messages.value.length > 0) {
      const messageItem = messages.value.find((m) => (m.id || m._id) === replyId)
      if (messageItem) {
        handleViewThread(messageItem)
      }
    } else if (!replyId && selectedThreadMessage.value) {
      // Clear the reply view if replyId is removed from route
      selectedThreadMessage.value = null
      threadReplies.value = []
    }
  }
)

/**
 * Watch for messages to be loaded and check if we need to open reply panel
 */
watch(
  () => messages.value.length,
  async (newLength) => {
    if (newLength > 0 && route.params.replyId && !selectedThreadMessage.value) {
      const messageItem = messages.value.find((m) => (m.id || m._id) === route.params.replyId)
      if (messageItem) {
        await handleViewThread(messageItem)
      }
    }
  }
)

/**
 * Join all threads on page load so that their
 * message counts stay in sync
 */
watch(
  () => getThreads.value,
  async (threads) => {
    threads.forEach((thread) => {
      if (thread.id) {
        joinThread(thread.id)
      }
    })
  }
)

/**
 * Method to reconnect message and vote websocket calls on
 * initialization and disconnection
 */
const reconnectSockets = (user) => {
  wsInstance.value.addErrorHandler()
  wsInstance.value.addVotesHandler(onVoteHandler)
  wsInstance.value.addMessageHandler(messageHandler, user)
  wsInstance.value.addMessagesRevealHandler(async () => {
    await loadMessages(route.params.threadId)
    if (selectedThreadMessage.value) {
      try {
        const replies = await ThreadService.getMessageReplies(
          selectedThreadMessage.value.id || selectedThreadMessage.value._id
        )
        threadReplies.value = replies
      } catch (error) {
        console.error('Failed to refresh replies after reveal:', error)
      }
    }
  })

  wsInstance.value.onConnect(() => {
    setTimeout(() => {
      joinThread(route.params.threadId)
      joinUser()
    }, 100)
  })
}

onMounted(async () => {
  const user = await loadUser()
  userId.value = user.id
  goodReputation.value = user.goodReputation
  await fetchMessages(route.params.threadId)
  await fetchThreadDetails(route.params.threadId)

  // Check if there's a replyId in the route and open reply panel
  await nextTick()
  if (route.params.replyId && messages.value.length > 0) {
    const messageItem = messages.value.find((m) => (m.id || m._id) === route.params.replyId)
    if (messageItem) {
      await handleViewThread(messageItem)
    }
  }

  messageInput.value?.focus()

  checkMobile()
  window.addEventListener('resize', handleResize)

  wsInstance.value = new SocketioService()
  wsInstance.value.addDisconnectHandler(reconnectSockets)
  reconnectSockets(user)
})

onUnmounted(() => {
  wsInstance.value.disconnectThread()
  if (wsInstance.value && wsInstance.value.removeAllHandlers) {
    wsInstance.value.removeAllHandlers()
  }

  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
textarea {
  resize: none;
}

:deep(.splitpanes__splitter) {
  transition: 0.4s all;
  margin-left: 0px !important;
  z-index: 2000 !important;
  width: 4px !important;
  background-color: #e5e7eb !important;
  border-color: #e5e7eb !important;
}

:deep(.splitpanes__splitter:before) {
  background-color: #e5e7eb !important;
  border-color: #e5e7eb !important;
}

:deep(.splitpanes__splitter:hover) {
  background-color: #afb0b1 !important;
  border-color: #afb0b1 !important;
}

:deep(.splitpanes__splitter:hover:before) {
  background-color: #afb0b1 !important;
  border-color: #afb0b1 !important;
}

/* Mobile slide animations that preserve scroll position */
@media (max-width: 767px) {
  .mobile-slide-left {
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }

  .mobile-slide-in {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: white;
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;
  }

  :deep(.splitpanes__splitter) {
    display: none; /* Hide splitter on mobile */
  }
}
</style>
