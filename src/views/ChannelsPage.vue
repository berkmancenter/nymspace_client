<template>
  <div class="mx-auto w-11/12 lg:w-3/5">
    <div class="w-1/2 float-left">
      <div class="mr-2">
        <h2 class="text-red-500 text-2xl my-4">{{ channel.name }}</h2>
        <ThreadList :items="items" />
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
import { onErrorCaptured, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

onErrorCaptured((e) => {
  console.error(e);
});

const { getThreads, loadThreads, getChannel, loadChannel } = useStore;

const items = getThreads;

const channel = ref({});

onMounted(async () => {
  if (Object.keys(channel.value).length == 0) {
    channel.value = { ...(await loadChannel(route.params.channelId)) };
  } else {
    channel.value = getChannel(route.params.channelId);
  }
});

loadThreads(route.params.channelId);
</script>
