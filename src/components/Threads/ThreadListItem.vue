<template>
  <router-link :to="threadLink" :class="getThreadClass(item)">
    <div class="col-span-8 text-lg">{{ item.name }}</div>
    <div class="col-span-1 font-semibold justify-self-end">
      <BookmarkIcon
        :class="item.isFollowed ? 'fill-current text-red-500' : ''"
        @click.prevent="pinThread"
        class="h-5 w-5 inline-block"
      />
    </div>
    <div class="col-span-3 font-semibold justify-self-end">
      {{ item.messageCount }}
      <ChatAltIcon class="h-5 w-5 inline-block" />
    </div>
  </router-link>
</template>

<script setup>
import { ChatAltIcon, BookmarkIcon } from "@heroicons/vue/outline";
import { computed } from "vue";
import useStore from "../../composables/global/useStore";
import { useRoute } from "vue-router";

const route = useRoute();
const { followThread, getUserThreads } = useStore;

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
    "grid grid-cols-12 gap-6 p-2 text-gray-700 hover:text-red-500 hover:bg-gray-100 cursor-pointer";
  if (props.item.id == route.params.threadId)
    className += "  text-red-500 bg-gray-100";
  return className;
}

function pinThread() {
  followThread({
    status: !props.item.isFollowed,
    threadId: props.item.id,
  });
}
</script>
