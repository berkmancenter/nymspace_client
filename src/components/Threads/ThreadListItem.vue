<template>
  <router-link :to="threadLink" :class="getThreadClass(item)">
    <div
      class="col-span-7 text-base overflow-hidden"
      style="text-overflow: ellipsis"
    >
      {{ item.name }}
    </div>
    <div class="col-span-1 font-semibold justify-self-end">
      <BookmarkIcon
        :class="item.isFollowed ? 'fill-current text-red-500' : ''"
        @click.prevent="pinThread"
        class="h-5 w-5 inline-block"
      />
    </div>
    <div class="col-span-1 font-semibold justify-self-end" data-testid="unlock-thread">
      <LockClosedIcon v-if="item.locked" class="h-4 w-4 inline-block" @click="unlockThread" />
    </div>
    <div class="col-span-3 font-semibold justify-self-end">
      {{ item.messageCount }}
      <ChatAltIcon class="h-5 w-5 inline-block" />
    </div>
  </router-link>
</template>

<script setup>
import { ChatAltIcon, BookmarkIcon } from "@heroicons/vue/outline";
import { LockClosedIcon } from "@heroicons/vue/solid";
import { computed } from "vue";
import useStore from "../../composables/global/useStore";
import { useRoute } from "vue-router";

const route = useRoute();
const { followThread, updateThread } = useStore;

const threadLink = computed(
  () => `/channels/${route.params.channelId}/threads/${props.item.id}`
);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
function getThreadClass(item) {
  var className =
    "grid grid-cols-12 gap-6 px-2 py-1 text-gray-700 hover:text-red-500 hover:bg-gray-100 cursor-pointer";
  if (props.item.id == route.params.threadId)
    className += " text-red-500 bg-gray-200";
  return className;
}

function pinThread() {
  followThread({
    status: !props.item.isFollowed,
    threadId: props.item.id,
  });
}

async function unlockThread() {
  let payload = {
    id: props.item._id ?? props.item.id,
    locked: false,
  };

  updateThread(payload);
}
</script>
