<template>
  <div class="sm:mt-2 sm:p-4 flex-1 flex flex-col bg-gray-50">
    <div class="flex-1 flex flex-col-reverse gap-2 sm:gap-0 sm:flex-row">
      <div
        class="transition-all sm:transition-none ease-in-out duration-500 h-full w-full sm:w-52 bg-gray-100 sm:bg-gray-100 flex flex-col flex-1 sm:flex-initial sm:rounded-l shadow absolute sm:relative z-10 sm:z-0 top-0 sm:left-0 pl-20 sm:pl-0 border-r border-gray-300"
        :class="threadsMenuOpen ? '-left-20 sm:left-0' : '-left-full sm:left-0'"
      >
        <div class="sm:hidden flex justify-between items-center">
          <router-link
            to="/"
            class="text-lg sm:text-2xl pl-4 font-bold text-harvard-red"
            >nymspace
          </router-link>
          <button
            @click="toggleThreadsMenu"
            class="w-full flex justify-end p-4"
          >
            <XIcon class="w-6 h-6" />
          </button>
        </div>
        <div
          class="rounded-tl gap-6 sm:border-b border-gray-300 pt-4 px-4 sm:p-2 flex items-center justify-between sm:shadow-sm rounded-tr h-11"
        >
          <h2 class="text-xl font-bold threads-title truncate">
            <button @click="openModal" class="truncate w-full">
              {{ channel.name }}
            </button>
          </h2>

          <div class="flex gap-2 items-center">
            <EditChannel
              :item="channel"
              :show="canEditDeleteChannel(channel)"
            />
            <DeleteChannel
              :show="canEditDeleteChannel(channel)"
              :name="channel.name"
              @delete-channel="processDeleteChannel"
            />
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <ThreadList
            :items="sortedThreads"
            :toggleThreadsMenu="toggleThreadsMenu"
          />
        </div>
        <div class="flex flex-col gap-1 p-4">
          <CreateThread :show="canCreate" />
        </div>
      </div>
      <div
        class="sm:rounded-r shadow overflow-hidden bg-white flex-1 shrink flex flex-col"
      >
        <div
          class="bg-white rounded-tl h-11 gap-6 border-b p-2 sm:pl-5 flex justify-between shadow-sm"
        >
          <div class="flex gap-2 truncate">
            <button @click="toggleThreadsMenu" class="sm:hidden">
              <ViewListIcon class="w-6 h-7 text-black" />
            </button>
            <h2 class="text-lg font-thin threads-title truncate">
              <button @click="openThreadModal" class="truncate w-full">
                {{ maybeThread.name }}
              </button>
            </h2>
          </div>
          <div class="flex gap-2 items-center">
            <DeleteThread :show="canEditDeleteThread" :item="maybeThread" />
            <EditThread :show="canEditDeleteThread" :item="maybeThread" />
          </div>
        </div>
        <div
          v-if="!isThreadActive && sortedThreads.length"
          class="text-gray-500 p-2 flex-1 flex flex-col w-full text-center justify-center"
        >
          Select a thread
        </div>

        <div
          v-if="!isThreadActive && !sortedThreads.length"
          class="text-gray-500 p-2 flex-1 flex flex-col w-full text-center justify-center"
        >
          Create a thread
        </div>
        <router-view></router-view>
      </div>
    </div>
    <Modal :is-open="isModalOpen" @close-modal="closeModal">
      <template v-slot:title>{{ channel.name }}</template>
      <div class="text-xl"></div>
    </Modal>
    <Modal :is-open="isThreadModalOpen" @close-modal="closeThreadModal">
      <template v-slot:title>{{ maybeThread.name }}</template>
      <div class="text-xl">in the {{ channel.name }} channel</div>
      <div class="text-lg mt-3">{{ maybeThread.messageCount }} messages</div>
    </Modal>
  </div>
</template>

<script setup>
import ThreadList from "../components/Threads/ThreadList.vue";
import CreateThread from "../components/Threads/CreateThread.vue";
import useStore from "../composables/global/useStore";
import DeleteThread from "../components/Threads/DeleteThread.vue";
import EditThread from "../components/Threads/EditThread.vue";
import {
  onMounted,
  computed,
  ref,
  onBeforeUnmount,
  onUnmounted,
  reactive,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import SocketioService from "../service/socket.service";
import { VueCookieNext } from "vue-cookie-next";
import DeleteChannel from "../components/Channels/DeleteChannel.vue";
import EditChannel from "../components/Channels/EditChannel.vue";
import { ViewListIcon, XIcon } from "@heroicons/vue/outline";
import Modal from "../components/Shared/Modal.vue";

const route = useRoute();

onBeforeUnmount(() => setShowChatOnly(false));

const {
  getThreads,
  getThread,
  loadThreads,
  getChannel,
  loadChannel,
  loadUserThreads,
  getUserThreads,
  setActiveChannel,
  setShowChatOnly,
  getLoggedInStatus,
  setThread,
  upsertThread,
  getGuestStatus,
  getId,
  deleteChannel,
} = useStore;

const router = useRouter();
const items = getThreads;
const wsInstance = reactive({});
const channel = ref(getChannel(route.params.channelId));
const maybeThread = ref(getThread(route.params.threadId));
const isThreadActive = ref(false);
const isChannelOwner = computed(() => getId.value === channel.value?.owner);
const isChannelThreadCreationAllowed = computed(
  () => channel.value?.threadCreationAllowed
);
const isModalOpen = ref(false);
const isThreadModalOpen = ref(false);

function openModal() {
  document.querySelector("body").classList.add("modal-open");
  isModalOpen.value = true;
}

function closeModal() {
  document.querySelector("body").classList.remove("modal-open");
  isModalOpen.value = false;
}

function openThreadModal() {
  document.querySelector("body").classList.add("modal-open");
  isThreadModalOpen.value = true;
}

function closeThreadModal() {
  document.querySelector("body").classList.remove("modal-open");
  isThreadModalOpen.value = false;
}

const threadsMenuOpen = ref(route.params.threadId ? false : true);
function toggleThreadsMenu() {
  threadsMenuOpen.value = !threadsMenuOpen.value;
}
/**
 * Watch thread id to show/hide edit/delete buttons on the side of
 * create thread button
 */
watch(
  () => route.params.threadId,
  async (newId) => {
    if (newId) {
      isThreadActive.value = true;
      maybeThread.value = getThread(newId);
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

const canCreate = computed(
  () => isChannelOwner.value || isChannelThreadCreationAllowed.value || false
);

async function processDeleteChannel() {
  await deleteChannel(route.params.channelId);
  router.push("/");
}
function canEditDeleteChannel(item) {
  return !getGuestStatus.value && item.owner === getId.value;
}
const canEditDeleteThread = computed(
  () => maybeThread.value.owner === getId.value
);

/**
 * Method to reconnect thread websocket calls on
 * initialization and disconnection
 */
const reconnectSockets = () => {
  wsInstance.value.addThreadHandler(threadHandler);
  wsInstance.value.addThreadUpdateHandler(updateThreadHandler);
  joinTopic(route.params.channelId);
};

onMounted(async () => {
  await loadUserThreads();
  await loadThreads(route.params.channelId);

  if (Object.keys(channel.value).length == 0) {
    channel.value = { ...(await loadChannel(route.params.channelId)) };
  } else {
    channel.value = getChannel(route.params.channelId);
  }
  maybeThread.value = getThread(route.params.threadId);

  wsInstance.value = new SocketioService();
  wsInstance.value.addDisconnectHandler(reconnectSockets);
  reconnectSockets();

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
