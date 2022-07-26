<template>
  <div class="flex justify-between items-center gap-2">
    <h2 class="text-red-500 text-2xl my-2 font-bold messages-title">
      {{ thread.name }}
    </h2>
    <div :title="showChatOnly ? 'Show threads list' : 'Show chat only'">
      <component
        :is="showChatOnly ? ViewBoardsIcon : EyeIcon"
        class="w-6 h-6 cursor-pointer hover:text-red-500 text-black"
        @click="setShowChatOnly(!showChatOnly)"
      />
    </div>
  </div>
  <MessagesView
    :ref="
      (el) => {
        if (el) messageViewRef = el;
      }
    "
    :items="updatedMsgs"
    @tag-click="tagClick"
  />
  <TagList
    :items="filteredTags"
    :visible="tagListVisible"
    :msg-txt-area="messageTextArea"
    @tag-click="tagClick"
  />
  <textarea
    v-if="!getActiveThread?.locked || false"
    ref="messageTextArea"
    v-model="message"
    id="messageTextArea"
    @keypress="watchTagging"
    @keydown.enter.prevent="sendMessage"
    class="w-full block border-2 border-gray-500 text-sm px-1 h-20 mt-4"
    placeholder="Message (hit enter to send)"
  >
  </textarea>
  <PromptDirtyDraft :show="prompt" @response="response" />
</template>

<script setup>
import { useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import {
  onMounted,
  ref,
  nextTick,
  watch,
  onUnmounted,
  computed,
  watchEffect,
  reactive,
} from "vue";
import MessagesView from "../components/Messages/MessagesView.vue";
import TagList from "../components/Messages/TagList.vue";
import PromptDirtyDraft from "../components/Messages/PromptDirtyDraft.vue";
import useStore from "../composables/global/useStore";
import SocketioService from "../service/socket.service";
import { VueCookieNext } from "vue-cookie-next";
import { ViewBoardsIcon, EyeIcon, EyeOffIcon } from "@heroicons/vue/outline";

const route = useRoute();
const {
  loadMessages,
  addMessage,
  getMessages,
  clearMessages,
  loadThread,
  getLoggedInStatus,
  getThread,
  getActivePseudonym,
  getId,
  loadUser,
  setShowChatOnly,
  showChatOnly,
  updateMessage,
  setActiveThread,
  getActiveThread,
} = useStore;

const messages = getMessages;
const message = ref("");
const tagListVisible = ref(false);
const messageViewRef = ref(null);
const messageTextArea = ref(null);
const thread = ref(getThread(route.params.threadId));
const searchTag = ref("");
const goodReputation = ref(false);
const wsInstance = reactive({});

/**
 * Dialog feature
 */
const resolve = ref({});
const reject = ref({});
const prompt = ref(false);

onBeforeRouteLeave(async (to, from) => {
  return await processDirtyMessage();
});

onBeforeRouteUpdate(async (to, from) => {
  return await processDirtyMessage();
});

const processDirtyMessage = async () => {
  const promise = new Promise((res, rej) => {
    resolve.value = res;
    reject.value = rej;
  });
  if (message.value.trim().length > 0) {
    prompt.value = true;
  } else {
    resolve.value(true);
  }
  let val = await promise;
  if (val) {
    message.value = "";
  }
  return val;
};

/**
 * Dialog prompt response call
 */
const response = (value) => {
  resolve.value(value);
  prompt.value = false;
};

/**
 * Get tags based on messages
 */
const tags = computed(() => {
  var tags = [];
  getMessages.value.forEach((element) => {
    if (
      element.pseudonym !== undefined &&
      tags.indexOf(element.pseudonym) === -1
    )
      tags.push(element.pseudonym);
  });
  tags.sort();
  return tags;
});

/**
 * Filter tags based on search text after @ symbol
 */
const filteredTags = computed(() => {
  if (tagListVisible.value) {
    if (searchTag.value.length === 0) {
      return tags.value;
    }
    // Case insensitive filter
    return tags.value.filter((x) =>
      x.toLowerCase().startsWith(searchTag.value.toLowerCase())
    );
  }
  return [];
});

/**
 * Update messages array to add property
 * that determines if user can vote
 */
const updatedMsgs = computed((x) => {
  const isNotOwner = (x) => x.pseudonymId !== getActivePseudonym.value?._id;

  /**
   * This condition might change based on how backend handles
   * the alternate voting for same message
   */
  const hasNotVoted = (x) =>
    x.upVotes.findIndex((y) => y.owner === getId.value) === -1 &&
    x.downVotes.findIndex((y) => y.owner === getId.value) === -1;

  return messages.value.map((x) => ({
    ...x,
    canVote: hasNotVoted(x) && isNotOwner(x),
    goodReputation: goodReputation.value,
    hasUpvoted: x.upVotes.findIndex((y) => y.owner === getId.value) > -1,
    hasDownvoted: x.downVotes.findIndex((y) => y.owner === getId.value) > -1,
  }));
});

/**
 * Send message via ws
 */
async function sendMessage() {
  if (message.value.trim().length > 0) {
    wsInstance.value.sendMessage({
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
 * Watch for tagging symbol, update search text and display the users list
 */
watchEffect(() => {
  const matches = /@([A-Za-z0-9]*)$/.exec(message.value);
  if (matches && matches.length > 1) {
    tagListVisible.value = true;
    searchTag.value = matches[1];
  } else {
    searchTag.value = "";
    tagListVisible.value = false;
  }
});

/**
 * Update tag on message to follow a taggable pattern
 */
function tagClick(value, isClickedDirect = false) {
  let pseudonym = `"${value}" `;
  if (!isClickedDirect) {
    // Replace last occurrence of word starting with @
    message.value = message.value.replace(/(\w*)(?=[^@]*)$/, pseudonym);
  } else {
    message.value = message.value.replace(/$/, `@${pseudonym}`);
  }
  messageTextArea.value.focus();
}

/**
 * Join thread if thread exist and
 * user is logged in (either guest or user)
 */
function joinThread(threadId) {
  if (threadId && getLoggedInStatus.value) {
    wsInstance.value.joinThread({
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
    addMessage(data);
  }

  /**
   * Scroll to bottom if the message belongs to current user
   */
  if (data.owner === getId.value) {
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
 * Handle message voting
 */
function onVoteHandler(data) {
  if (route.params.threadId === data.thread) {
    updateMessage(data);
  }
}

/**
 * Fetch messages
 */
async function fetchMessages(threadId) {
  loadMessages(threadId).then(async () => {
    await scrollToBottom();
  });
}

/**
 * Scoroll messages pane to bottom
 */
async function scrollToBottom() {
  await nextTick();
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
  setActiveThread(thread.value);
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
  wsInstance.value = new SocketioService();
  wsInstance.value.addVotesHandler(onVoteHandler);
  wsInstance.value.addMessageHandler(messageHandler);
  joinThread(route.params.threadId);

  const user = await loadUser();
  goodReputation.value = user.goodReputation;
  await fetchMessages(route.params.threadId);
  await fetchThreadDetails(route.params.threadId);
  messageTextArea.value?.focus();
});

onUnmounted(() => {
  wsInstance.value.disconnectThread();
});
</script>

<style scoped>
textarea {
  resize: none;
}

.messages-title {
  @apply overflow-hidden;
  text-overflow: ellipsis;
}
</style>
