<template>
  <div class="flex justify-between items-center">
    <div>
      <p
        class="my-1 thread-message"
        :class="getMessageClass(item)"
        :title="item.createdAt"
      >
        <b @click="addToMessage(this)">{{ item.pseudonym || item.owner }}</b
        >: {{ item.body }}
      </p>
    </div>
    <div>
      <div class="flex items-center -mb-2.5 text-gray-300 hover:text-gray-700">
        <ChevronUpIcon
          @click="upvote(item.id)"
          class="h-6 w-6 cursor-pointer"
        /><span class="text-sm font-bold">{{ item.upVotes }}</span>
      </div>
      <div class="flex items-center text-gray-300 hover:text-gray-700">
        <ChevronDownIcon
          @click="downvote(item.id)"
          class="h-6 w-6 cursor-pointer"
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

function addToMessage(el) {
  let textArea = document.getElementById("messageTextArea");
  let existingText = textArea.value.trim();
  let pseudonym = el.item.pseudonym;
  if (pseudonym.indexOf(" ") > -1) pseudonym = '"' + pseudonym + '"';
  if (existingText.indexOf(pseudonym) > -1) return;
  if (existingText != "") existingText += " ";
  textArea.value = existingText + "@" + pseudonym + " ";
  textArea.focus();
}

function getMessageClass(item) {
  return item.downVotes > 2 ? "text-gray-400" : "text-black";
}

const threadLink = computed(
  () => "/threads/" + this.$route.params.channel + "/" + this.item.name
);
</script>

<style scoped>
.thread-message b {
  @apply cursor-pointer;
}
:deep(svg path) {
  stroke-width: 4px;
}
</style>
