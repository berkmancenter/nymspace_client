<template>
  <div class="mx-auto w-11/12 lg:w-3/5">
    <div v-show="!showChatOnly" class="w-1/2 float-left">
      <div class="mr-2">
        <h2 class="text-red-500 text-2xl my-2 font-bold threads-title">
          {{ channel.name }}
        </h2>
        <ThreadList :items="sortedThreads" />
        <div class="flex items-center">
          <CreateThread />
          <DeleteThread :show="canEditDelete" :item="getActiveThread ?? {}" />
          <EditThread :show="canEditDelete" :item="getActiveThread ?? {}" />
        </div>
      </div>
    </div>
    <div :class="showChatOnly ? '' : 'w-1/2 float-right'">
      <div class="ml-2">
        <router-view></router-view>
      </div>
    </div>
    <div class="clear-both"></div>
  </div>
</template>

<script setup>
import ThreadList from "../components/Threads/ThreadList.vue";
import CreateThread from "../components/Threads/CreateThread.vue";
import useStore from "../composables/global/useStore";
import {
  onMounted,
  computed,
  ref,
  onBeforeUnmount,
  onUnmounted,
  reactive,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import SocketioService from "../service/socket.service";
import { VueCookieNext } from "vue-cookie-next";
import DeleteThread from "../components/Threads/DeleteThread.vue";
import EditThread from "../components/Threads/EditThread.vue";

const route = useRoute();

onBeforeUnmount(() => setShowChatOnly(false));

const {
  getThreads,
  loadThreads,
  getChannel,
  loadChannel,
  getChannels,
  loadUserThreads,
  getUserThreads,
  setActiveChannel,
  showChatOnly,
  setShowChatOnly,
  getLoggedInStatus,
  setThread,
  upsertThread,
  getGuestStatus,
  getId,
  getActiveThread,
  deleteThread,
} = useStore;

const items = getThreads;
const wsInstance = reactive({});
const channel = ref(getChannel(route.params.channelId));
const isThreadActive = ref(false);
const isThreadOwner = computed(
  () => getId.value === getActiveThread.value?.owner
);
const isChannelOwner = computed(() => getId.value === channel.value?.owner);
/**
 * Watch thread id to show/hide edit/delete buttons on the side of
 * create thread button
 */
watch(
  () => route.params.threadId,
  async (newId) => {
    if (newId) {
      isThreadActive.value = true;
    } else {
      isThreadActive.value = false;
    }
  },
  {
    immediate: true,
  }
);

// compare method to Sort the threads to put followed threads at top
function compare(a, b) {
  if (a.isFollowed && b.isFollowed) {
    return 0;
  }
  if (a.isFollowed) {
    return -1;
  } else return 1;
}

const sortedThreads = computed(() => threadsWithFollow.value.sort(compare));

// Add isFollowed property to update if the thread is followed by user
const threadsWithFollow = computed(() =>
  items.value.map((x) => ({
    ...x,
    isFollowed: getUserThreads.value.some(
      (y) => y.id === x.id && y.hasOwnProperty("followed") && y.followed
    ),
  }))
);

/**
 * Join topic if topic exist and
 * user is logged in (either guest or user)
 */
function joinTopic(topicId) {
  if (topicId && getLoggedInStatus.value) {
    wsInstance.value.joinTopic({
      topicId: topicId,
      token: VueCookieNext.getCookie("access_token"),
    });
  }
}

/**
 * Handle thread creation
 */
function threadHandler(data) {
  if (route.params.channelId === data.topic.id) {
    const { id, isFollowed, messages, name, slug, owner } = data;
    setThread({
      id,
      isFollowed,
      messageCount: messages.length,
      name,
      slug,
      owner: owner?.id,
    });
  }
}

/**
 * Handle thread update
 */
function updateThreadHandler(data) {
  upsertThread(data);
}

const canEditDelete = computed(
  () => (isThreadOwner.value || isChannelOwner.value) && isThreadActive.value
);

async function processDelete() {
  await deleteThread(getActiveThread.value._id ?? getActiveThread.value.id)
    .then((x) => console.log(x))
    .catch((err) => console.error(err));
}

/**
 * Method to reconnect thread websocket calls on
 * initialization and disconnection
 */
const reconnectSockets = () =>{
  wsInstance.value.addThreadHandler(threadHandler);
  wsInstance.value.addThreadUpdateHandler(updateThreadHandler);
  joinTopic(route.params.channelId);
}

onMounted(async () => {
  wsInstance.value = new SocketioService();
  wsInstance.value.addDisconnectHandler(reconnectSockets);
  reconnectSockets();

  await loadUserThreads();
  await loadThreads(route.params.channelId);

  if (Object.keys(channel.value).length == 0) {
    channel.value = { ...(await loadChannel(route.params.channelId)) };
  } else {
    channel.value = getChannel(route.params.channelId);
  }

  setActiveChannel(channel.value);
});

onUnmounted(() => {
  wsInstance.value.disconnectTopic();
});
</script>
<style scoped>
.threads-title {
  @apply overflow-hidden;
  text-overflow: ellipsis;
}
</style>
