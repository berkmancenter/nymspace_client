<template>
  <h2 class="text-red-500 text-2xl mt-4 mb-2 font-bold">{{ thread.name }}</h2>
  <ThreadView
    :ref="
      (el) => {
        if (el) messageViewRef = el;
      }
    "
    :items="updatedMsgs"
  />
  <textarea
    contenteditable="true"
    v-model="message"
    id="messageTextArea"
    @keypress="watchTagging"
    @keydown.enter.prevent="sendMessage"
    class="w-full block border-2 border-gray-500 text-lg p-2 h-30 mt-4"
    placeholder="Message (hit enter to send)"
  >
  </textarea>
  <TagList
    :items="getTags()"
    :visible="getTagListVisible()"
    :left="getTagListLeft()"
    :top="getTagListTop()"
    @tag-click="tagClick"
  />
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, nextTick, watch, onUnmounted, computed } from "vue";
import ThreadView from "../components/Messages/MessagesView.vue";
import TagList from "../components/Messages/TagList.vue";
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
  getActivePseudonym,
  getId,
} = useStore;

const messages = getMessages;
const message = ref("");
var tagListVisible = false;
var tagListLeft = 0;
var tagListTop = 0;
const messageViewRef = ref(null);

const thread = ref(getThread(route.params.threadId));

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
  }));
});

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
 * Watch for tag characters and display the users list
 */
function watchTagging(event) {
  if (event.key == "@") {
    let textArea = document.getElementById("messageTextArea");
    let previousText = textArea.innerHTML.substr(
      window.getSelection().getRangeAt(0).startOffset - 2,
      1
    );
    if (previousText != " " && previousText != "") return;
    let pos = window.getSelection().getRangeAt(0).getBoundingClientRect();
    tagListTop = parseInt(
      textArea.offsetTop + textArea.clientHeight + pos.top - 6
    );
    tagListLeft = parseInt(textArea.offsetLeft + pos.left + 3);
    tagListVisible = true;
  } else tagListVisible = false;
}

function getTags() {
  var tags = [];
  getMessages.value.forEach((element) => {
    if (tags.indexOf(element.pseudonym) == -1) tags.push(element.pseudonym);
  });
  return tags;
}

function getTagListVisible() {
  return tagListVisible;
}

function getTagListLeft() {
  return tagListLeft;
}

function getTagListTop() {
  return tagListTop;
}

function tagClick(value) {
  tagListVisible = false;
  let existingText = message.value.trim();
  let pseudonym = value;
  if (pseudonym.indexOf(" ") > -1) pseudonym = '"' + pseudonym + '"';
  if (existingText.indexOf(pseudonym) > -1) {
    message.value = message.value.replace(/@\s*$/, "");
    return;
  }
  message.value = existingText + pseudonym + " ";
  document.getElementById("messageTextArea").focus();
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
    addMessage(data);
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
  SocketioService.disconnect();
  SocketioService.setupSocketConnection(messageHandler);
  await fetchMessages(route.params.threadId);
  await fetchThreadDetails(route.params.threadId);
  joinThread(route.params.threadId);
});

onUnmounted(() => {
  SocketioService.disconnect();
});
</script>
