<template>
  <div class="mx-auto w-11/12 lg:w-3/5">
    <div class="w-1/2 float-left">
      <div class="mr-2">
        <h2 class="text-red-500 text-2xl mt-4 mb-2 font-bold">
          {{ channel.name }}
        </h2>
        <ThreadList :items="sortedThreads" />
        <CreateThread />
      </div>
    </div>
    <div class="w-1/2 float-right">
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
import { onErrorCaptured, onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

onErrorCaptured((e) => {
  console.error(e);
});

const {
  getThreads,
  loadThreads,
  getChannel,
  loadChannel,
  getChannels,
  loadUserThreads,
  getUserThreads,
} = useStore;

const items = getThreads;

const channel = ref(getChannel(route.params.channelId));

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

onMounted(async () => {
  await loadUserThreads();
  await loadThreads(route.params.channelId);
  if (Object.keys(channel.value).length == 0) {
    channel.value = { ...(await loadChannel(route.params.channelId)) };
  } else {
    channel.value = getChannel(route.params.channelId);
  }
});
</script>
