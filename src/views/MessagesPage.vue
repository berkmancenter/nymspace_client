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
import { onMounted, ref, nextTick, watch } from "vue";
import ThreadView from "../components/Threads/ThreadView.vue";
import useStore from "../composables/global/useStore";

const route = useRoute();
const {
  loadMessages,
  postMessage,
  getMessages,
  clearMessages,
  loadThread,
  getThread,
} = useStore;

const messages = getMessages;
const message = ref("");
const messageViewRef = ref(null);

const thread = ref(getThread(route.params.threadId));

async function sendMessage() {
  if (message.value.trim().length > 0) {
    const msg = {
      body: message.value,
      thread: route.params.threadId,
    };
    await postMessage(msg);
    message.value = "";
    messageViewRef.value.$el.scrollTo({
      top: messageViewRef.value.$el.scrollHeight,
      left: 0,
    });
  }
}

async function fetchMessages(threadId) {
  loadMessages(threadId).then(async () => {
    await nextTick();
    messageViewRef.value.$el.scrollTo({
      top: messageViewRef.value.$el.scrollHeight,
      left: 0,
    });
  });
}

async function fetchThreadDetails(threadId) {
  if (Object.keys(thread.value).length == 0) {
    thread.value = { ...(await loadThread(threadId)) };
  } else {
    thread.value = getThread(threadId);
  }
}

watch(
  () => route.params.threadId,
  async (threadId, prevThreadId) => {
    if (threadId !== undefined && threadId !== prevThreadId) {
      clearMessages();
      await fetchMessages(threadId);
      await fetchThreadDetails(threadId);
    }
  }
);

onMounted(async () => {
  await fetchMessages(route.params.threadId);
  await fetchThreadDetails(route.params.threadId);
});
</script>
