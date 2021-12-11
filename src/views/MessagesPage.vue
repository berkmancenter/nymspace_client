<template>
  <h2 class="text-white text-2xl mt-4 mb-2">{{ route.params.threadId }}</h2>
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
const { loadMessages, postMessage, getMessages } = useStore;

const messages = getMessages;
const message = ref("");
const messageViewRef = ref(null);

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
  loadMessages(threadId).then(async (data) => {
    await nextTick();
    messageViewRef.value.$el.scrollTo({
      top: messageViewRef.value.$el.scrollHeight,
      left: 0,
    });
  });
}

watch(
  () => route.params.threadId,
  async (threadId, prevThreadId) => {
    if (threadId !== prevThreadId) {
      messages.value = [];
      await fetchMessages(threadId);
    }
  }
);

onMounted(async () => {
  await fetchMessages(route.params.threadId);
});
</script>
