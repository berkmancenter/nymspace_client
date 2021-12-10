<template>
  <h2 class="text-white text-2xl my-4">{{ threadId }}</h2>
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
    class="w-full block border-2 border-gray-500 text-lg p-2 h-40 mt-4"
    placeholder="Message (hit enter to send)"
  ></textarea>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, reactive, ref, nextTick } from "vue";
import ThreadView from "../components/Threads/ThreadView.vue";
import ThreadService from "../service";

const route = useRoute();

const { threadId } = route.params;
const messages = ref([]);
const message = ref("");
const messageViewRef = ref(null);

function sendMessage() {
  if (message.trim().length > 0) {
    const msg = {
      body: message,
      thread: threadId,
    };
    ThreadService.createMessage(msg);
  }
}

onMounted(() => {
  ThreadService.getMessages(threadId).then(async (data) => {
    messages.value = data;
    await nextTick();
    messageViewRef.value.$el.scrollTo({
      top: messageViewRef.value.$el.scrollHeight,
      left: 0,
    });
  });
});
</script>
