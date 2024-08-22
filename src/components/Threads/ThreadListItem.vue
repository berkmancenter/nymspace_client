<template>
  <router-link
    :to="threadLink"
    :class="getThreadClass(item)"
    @click="props.toggleThreadsMenu"
  >
    <div class="flex-1 flex gap-1 truncate">
      <div class="font-semibold justify-self-end">
        <BookmarkIcon
          :class="item.isFollowed ? 'fill-current text-harvard-red' : ''"
          @click.prevent="pinThread"
          class="h-4 w-4 inline-block"
        />
      </div>
      <div class="font-semibold justify-self-end" data-testid="unlock-thread">
        <LockClosedIcon
          v-if="item.locked"
          class="h-4 w-4 inline-block"
          @click="unlockThread"
        />
      </div>
      <div class="text-base truncate">
        {{ item.name }}
      </div>
    </div>
    <div class="font-thin text-sm justify-self-end">
      {{ new Intl.NumberFormat("en-US").format(item.messageCount) }}
      <ChatAltIcon class="h-4 w-4 inline-block" />
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
  toggleThreadsMenu: {
    type: Function,
    required: false,
  },
});
function getThreadClass(item) {
  var className =
    "px-4 flex items-center gap-2 justify-between py-1 text-gray-700 hover:bg-gray-300 cursor-pointer";
  if (props.item.id == route.params.threadId) className += " bg-gray-300";
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
