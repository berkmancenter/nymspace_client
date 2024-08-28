<template>
  <li
    :class="getChannelClass(item)"
    class="flex items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap px-2"
  >
    <div class="flex gap-1 items-start">
      <BookmarkIcon
        :class="item.isFollowed ? 'fill-current' : ''"
        @click.prevent="pinChannel"
        class="h-4 4 inline-block cursor-pointer hover:text-black hover:stroke-current"
      />
      <div>
        <router-link
          :to="channelLink"
          class="text-sm font-semibold leading-3 text-gray-900 hover:underline flex gap-2 items-center"
        >
          {{ item.name }}
          <LockClosedIcon v-if="isPrivate(item)" class="h-4 w-4"
        /></router-link>

        <div class="flex items-center gap-x-2 text-xs leading-5 text-gray-500">
          <p>
            Last updated
            <time :datetime="item.latestMessageCreatedAt">{{
              new Date(item.latestMessageCreatedAt).toLocaleDateString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            }}</time>
          </p>
        </div>
      </div>
    </div>

    <dl class="flex flex-none justify-between gap-x-8 sm:w-auto">
      <div class="">
        <h3 class="font-thin flex text-sm">{{ item.threadCount }} Threads</h3>

        <div class="flex gap-x-1">
          <dt>
            <span class="sr-only">Total messages</span>
            <ChatAltIcon class="h-4 w-4 inline-block" />
          </dt>
          <dd class="text-sm leading-6">
            {{ new Intl.NumberFormat("en-US").format(item.messageCount) }}
          </dd>
        </div>
      </div>
    </dl>
  </li>
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

const { followChannel } = useStore;

const route = useRoute();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

function getChannelClass(item) {
  var className = "hover:bg-gray-100 cursor-default";
  if (item.name == route.params.channelId) className += " bg-gray-100";
  return className;
}

function isPrivate(item) {
  return Object.keys(item).includes("private") && item.private;
}

const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : "";
const channelLink = computed(() => `${path}/channels/${props.item.id}/`);

function pinChannel() {
  followChannel({
    status: !props.item.isFollowed,
    topicId: props.item.id,
  });
}
</script>
