<template>
  <h2 class="text-red-500 text-2xl mt-4 mb-2 font-bold">{{ thread.name }}</h2>
  <ThreadView
    :ref="
      (el) => {
        if (el) messageViewRef = el;
      }
    "
    :items="messages"
  />
  <textarea
    v-model="message"
    @keydown.enter.prevent="sendMessage"
    class="w-full block border-2 border-gray-500 text-lg p-2 h-30 mt-4"
    placeholder="Message (hit enter to send)"
  ></textarea>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, nextTick, watch, onUnmounted } from "vue";
import ThreadView from "../components/Threads/ThreadView.vue";
import useStore from "../composables/global/useStore";
import SocketioService from "../service/socket.service";
import { VueCookieNext } from "vue-cookie-next";

const route = useRoute();
const {
  loadMessages,
  addMessage,
  getMessages,
  clearMessages,
  loadThread,
  getLoggedInStatus,
  getThread,
} = useStore;

const messages = getMessages;
const message = ref("");
const messageViewRef = ref(null);

const thread = ref(getThread(route.params.threadId));

/**
 * Send message via ws
 */
async function sendMessage() {
  if (message.value.trim().length > 0) {
    SocketioService.sendMessage({
      message: {
        body: message.value,
        thread: route.params.threadId,
      },
      token: VueCookieNext.getCookie("access_token"),
    });

    message.value = "";
    scrollToBottom();
  }
}

/**
 * Join thread if thread exist and
 * user is logged in (either guest or user)
 */
function joinThread(threadId) {
  if (threadId && getLoggedInStatus.value) {
    SocketioService.joinThread({
      threadId: threadId,
      token: VueCookieNext.getCookie("access_token"),
    });
  }
}
/**
 * Handle received message
 */
function messageHandler(data) {
  const threadToUpdate = getThread(data.thread.id);
  /**
   * Update message if current thread matches the received
   * message thread
   */
  if (data.thread.id === route.params.threadId) {
    addMessage({
      body: data.body,
      created: data.createdAt,
      id: data.id,
      pseudonym: data.pseudonym,
    });
    scrollToBottom();
  }

  /**
   * Update thread's message count
   */
  if (threadToUpdate) {
    threadToUpdate.messageCount = data.thread.messages.length;
  }
}

/**
 * Fetch messages
 */
async function fetchMessages(threadId) {
  loadMessages(threadId).then(async () => {
    await nextTick();
    scrollToBottom();
  });
}

/**
 * Scoroll messages pane to bottom
 */
function scrollToBottom() {
  messageViewRef.value.$el.scrollTo({
    top: messageViewRef.value.$el.scrollHeight,
    left: 0,
  });
}

/**
 * Load thread from store if exist
 * else load from API if does not exist
 */
async function fetchThreadDetails(threadId) {
  if (Object.keys(thread.value).length == 0) {
    thread.value = { ...(await loadThread(threadId)) };
  } else {
    thread.value = getThread(threadId);
  }
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
      clearMessages();
      await fetchMessages(threadId);
      await fetchThreadDetails(threadId);
      joinThread(threadId);
    }
  }
);

onMounted(async () => {
  await fetchMessages(route.params.threadId);
  await fetchThreadDetails(route.params.threadId);
  joinThread(route.params.threadId);
});

onUnmounted(() => {
  console.log("disconect");
  SocketioService.disconnect();
});

const socket = SocketioService.setupSocketConnection(messageHandler);
</script>
