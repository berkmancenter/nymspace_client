<template>
  <router-link
    :to="channelLink"
    :class="getChannelClass(item)"
    class="mb-8 sm:mb-0"
  >
    <div
      class="col-span-3 text-lg overflow-hidden"
      style="text-overflow: ellipsis"
    >
      {{ item.name }}
      <LockClosedIcon v-if="isPrivate(item)" class="h-5 w-5 inline-block" />
    </div>
    <div
      class="col-span-4 font-semibold justify-self-end flex items-center justify-around gap-x-4"
    >
      <EditChannel :item="item" :show="canEditDelete(item)" />

      <DeleteChannel
        :show="canEditDelete(item)"
        :name="item.name"
        @delete-channel="processDelete"
      />

      <BookmarkIcon
        :class="item.isFollowed ? 'fill-current text-red-500' : ''"
        @click.prevent="pinChannel"
        class="h-5 w-5 inline-block cursor-pointer hover:text-black hover:stroke-current"
      />
    </div>
    <div class="col-span-3 font-semibold justify-self-end">
      {{ item.threadCount }} threads
    </div>
    <div class="col-span-2 font-semibold justify-self-end">
      {{ item.messageCount }}
      <ChatAltIcon class="h-5 w-5 inline-block" />
    </div>
  </router-link>
</template>

<script setup>
import {
  ChatAltIcon,
  LockClosedIcon,
  BookmarkIcon,
} from "@heroicons/vue/outline";
import { computed } from "vue";
import { useRoute } from "vue-router";
import useStore from "../../composables/global/useStore";
import DeleteChannel from "./DeleteChannel.vue";
import EditChannel from "./EditChannel.vue";
const { getGuestStatus, getId, deleteChannel, followChannel } = useStore;

const route = useRoute();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

function getChannelClass(item) {
  var className =
    "grid grid-cols-12 gap-6 p-2 text-gray-700 hover:text-red-500 hover:bg-gray-100 cursor-default";
  if (item.name == route.params.channelId) className += " bg-gray-100";
  return className;
}

function isPrivate(item) {
  return Object.keys(item).includes("private") && item.private;
}

function canEditDelete(item) {
  return !getGuestStatus.value && item.owner === getId.value;
}

const channelLink = computed(() => `/channels/${props.item.id}/`);

async function processDelete() {
  await deleteChannel(props.item.id);
}

function pinChannel() {
  followChannel({
    status: !props.item.isFollowed,
    topicId: props.item.id,
  });
}
</script>
