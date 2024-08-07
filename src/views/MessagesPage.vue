<template>
  <div class="flex justify-between items-center gap-2">
    <h2 class="text-red-500 text-2xl my-2 font-bold messages-title">
      {{ thread.name }}
    </h2>
    <div :title="showChatOnly ? 'Show threads list' : 'Show chat only'">
      <component
        :is="showChatOnly ? ArrowLeftIcon : ArrowsExpandIcon"
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
  <div v-if="pseudonymMismatch" class="alert warning" style="margin-top: 1rem">
    <ExclamationIcon class="h-6 w-6 inline-block text-orange-500 rounded" />
    <span class="text-sm"
      >The pseudonym for this thread is
      <strong>{{ pseudonymForThread.pseudonym }}</strong
      >. Please switch to this pseudonym to send a message.</span
    >
  </div>
  <textarea
    ref="messageTextArea"
    v-if="!pseudonymMismatch"
    v-model="message"
    id="messageTextArea"
    @keypress="watchTagging"
    @keydown.enter.prevent="sendMessage"
    class="w-full block border-2 text-sm px-1 h-20 mt-4"
    :class="
      shouldDisplayMessageBoxLocked || shouldDisplayUnableToSendMessage
        ? 'border-red-500'
        : 'border-gray-500'
    "
    placeholder="Message (hit enter to send)"
    data-testid="message-text-area"
  >
  </textarea>
  <span
    v-if="shouldDisplayMessageBoxLocked"
    class="text-red-500 text-sm font-bold"
    >This thread is now locked. Messages cannot be sent until it is unlocked by
    the thread creator.</span
  >
  <span
    v-if="shouldDisplayUnableToSendMessage && !shouldDisplayMessageBoxLocked"
    class="text-red-500 text-sm font-bold"
  >
    Unable to send message. Please try again later.
  </span>
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
import {
  ArrowLeftIcon,
  ArrowsExpandIcon,
  ExclamationIcon,
} from "@heroicons/vue/outline";

const route = useRoute();
const {
  loadMessages,
  addMessage,
  getMessages,
  clearMessages,
  loadThread,
  getLoggedInStatus,
  getThread,
  getPseudonyms,
  getActivePseudonym,
  getId,
  loadUser,
  setShowChatOnly,
  showChatOnly,
  updateMessage,
  setActiveThread,
  getActiveThread,
  getThreads
} = useStore;

const messages = getMessages;
const message = ref("");
const tagListVisible = ref(false);
const messageViewRef = ref(null);
const messageTextArea = ref(null);
const thread = ref(getThread(route.params.threadId));
const pseudonymForThread = computed(() => {
  return getPseudonyms.value.filter((x) => {
    if (!x.threads) {
      return false;
    }

    return x.threads.includes(thread.value?.id);
  })[0];
});
const pseudonymMismatch = computed(() => {
  return (
    pseudonymForThread.value &&
    pseudonymForThread.value?._id !== getActivePseudonym.value?._id
  );
});
const searchTag = ref("");
const goodReputation = ref(false);
const wsInstance = reactive({});
const shouldDisplayMessageBoxLocked = ref(false);
const shouldDisplayUnableToSendMessage = ref(false);
const threads = getThreads;

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

watch(
  () => getActiveThread.value,
  async (now, prev) => {
    if (now?.id == prev?.id) {
      if (now?.locked) {
        shouldDisplayMessageBoxLocked.value = true;
      } else {
        shouldDisplayMessageBoxLocked.value = false;
      }
    } else {
      shouldDisplayMessageBoxLocked.value = now?.locked;
    }
  },
  {
    immediate: true,
  }
);

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
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

async function sendMessage() {
  if (
    message.value.trim().length > 0 &&
    !getActiveThread.value?.locked &&
    !pseudonymMismatch.value
  ) {
    try {
      await wsInstance.value.sendMessage({
        message: {
          body: message.value,
          thread: route.params.threadId,
        },
        userId: getId.value,
        token: VueCookieNext.getCookie("access_token"),
      });

      shouldDisplayUnableToSendMessage.value = false;
      message.value = "";
      scrollToBottom();
    } catch (error) {
      console.log(error);
      shouldDisplayUnableToSendMessage.value = true;
    }
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

function joinUser() {
  if (getLoggedInStatus.value) {
    wsInstance.value.joinUser({
      userId: getId.value,
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

/**
 * Join all threads on page load so that their
 * message counts stay in sync
 */
 watch(
  () => getThreads.value,
  async (threads) => {
    threads.forEach((thread) => {
      joinThread(thread.id);
    });
  }
);


/**
 * Method to reconnect message and vote websocket calls on
 * initialization and disconnection
 */
const reconnectSockets = (user) => {
  wsInstance.value.addErrorHandler();
  wsInstance.value.addVotesHandler(onVoteHandler);
  wsInstance.value.addMessageHandler(messageHandler, user);

  wsInstance.value.onConnect(() => {
    setTimeout(() => {
      joinThread(route.params.threadId);
      joinUser();
    }, 100);
  });
};

onMounted(async () => {
  const user = await loadUser();
  goodReputation.value = user.goodReputation;
  await fetchMessages(route.params.threadId);
  await fetchThreadDetails(route.params.threadId);
  messageTextArea.value?.focus();

  wsInstance.value = new SocketioService();
  wsInstance.value.addDisconnectHandler(reconnectSockets);
  reconnectSockets(user);
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

.alert.warning {
  @apply bg-yellow-100 text-yellow-800;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.25rem;
}
</style>
