<template>
  <router-link :to="channelLink" :class="getChannelClass(item)">
    <div class="col-span-7 text-lg">{{ item.name }}</div>
    <div class="col-span-1 font-semibold justify-self-end">
      <LockClosedIcon v-if="isPrivate(item)" class="h-5 w-5 inline-block" />
    </div>
    <div class="col-span-2 font-semibold justify-self-end">
      {{ item.threadCount }} threads
    </div>
    <div class="col-span-2 font-semibold justify-self-end">
      {{ item.messageCount }}
      <ChatAltIcon class="h-5 w-5 inline-block" />
    </div>
  </router-link>
</template>

<script setup>
import { ChatAltIcon, LockClosedIcon } from "@heroicons/vue/outline";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

function getChannelClass(item) {
  var className =
    "grid grid-cols-12 gap-6 p-2 text-gray-700 hover:text-red-500 hover:bg-gray-100 cursor-pointer";
  if (item.name == route.params.channelId) className += " bg-gray-100";
  return className;
}

function isPrivate(item) {
  return Object.keys(item).includes("private") && item.private;
}

const channelLink = computed(() => `/channels/${props.item.id}/`);
</script>
