<template>
  <div class="flex justify-between items-center">
    <div>
      <p class="my-1" :class="getMessageClass(item)" :title="item.createdAt">
        <b>{{ item.pseudonym || item.owner }}</b
        >: {{ item.body }}
      </p>
    </div>
    <div>
      <div class="flex items-center -mb-2.5">
        <ChevronUpIcon
          @click="upvote(item.id)"
          class="h-6 w-6 text-gray-300 cursor-pointer hover:text-gray-700"
        /><span class="text-sm font-bold">{{ item.upVotes }}</span>
      </div>
      <div class="flex items-center">
        <ChevronDownIcon
          @click="downvote(item.id)"
          class="h-6 w-6 text-gray-300 cursor-pointer hover:text-gray-700"
        /><span class="text-sm font-bold">{{ item.downVotes }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/outline";
import { computed } from "vue";

import useStore from "../../composables/global/useStore";

const { upvote, downvote } = useStore;

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

function getMessageClass(item) {
  return item.downVotes > 2 ? "text-gray-400" : "text-black";
}

const threadLink = computed(
  () => "/threads/" + this.$route.params.channel + "/" + this.item.name
);
</script>

<style scoped>
:deep(svg path) {
  stroke-width: 4px;
}
</style>
