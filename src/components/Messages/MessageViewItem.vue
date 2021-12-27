<template>
  <div class="flex justify-between items-center">
    <div>
      <p
        class="my-1 thread-message"
        :class="getMessageClass(item)"
        :title="item.createdAt"
      >
        <b @click="addToMessage(this)">{{ item.pseudonym || item.owner }}</b
        >: <span v-html="formattedBody"></span>
      </p>
    </div>
    <div>
      <div
        class="flex items-center -mb-2.5 text-gray-300"
        :class="item.canVote ? 'hover:text-gray-700' : ''"
      >
        <ChevronUpIcon
          @click="upvote(item.id)"
          class="h-6 w-6"
          :class="item.canVote ? 'cursor-pointer' : 'pointer-events-none'"
        /><span class="text-sm font-bold">{{ item.upVotes.length }}</span>
      </div>
      <div
        class="flex items-center text-gray-300"
        :class="item.canVote ? 'hover:text-gray-700' : ''"
      >
        <ChevronDownIcon
          @click="downvote(item.id)"
          class="h-6 w-6 cursor-pointer"
          :class="item.canVote ? 'cursor-pointer' : 'pointer-events-none'"
        /><span class="text-sm font-bold">{{ item.downVotes.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/outline";
import { computed } from "vue";

import useStore from "../../composables/global/useStore";

const { upvote, downvote } = useStore;

const props = defineProps({
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
  return item.downVotes.length > 2 ? "text-gray-400" : "text-black";
}

const threadLink = computed(
  () => "/threads/" + this.$route.params.channel + "/" + this.item.name
);
/**
 * Build html tag for tagged pseudonym
 */
function getFormattedTag(tag) {
  return `<span class='tag'>@${/@"([A-Za-z0-9\s]+)"/g.exec(tag)[1]}</span>`;
}

/**
 * Search for all pseudonym tags and format them
 */
const formattedBody = computed(() => {
  let regex = /(@\"[A-Za-z0-9\s]+\")/g;
  let matches = [];
  let tempStr = props.item.body;
  while ((matches = regex.exec(props.item.body)) !== null) {
    tempStr = tempStr.replace(matches[0], getFormattedTag(matches[0]));
  }
  return tempStr;
});
</script>

<style scoped>
:deep(svg path) {
  stroke-width: 4px;
}
</style>

<style>
.thread-message b {
  @apply cursor-pointer;
}
.tag {
  @apply shadow-inner rounded-sm text-xs font-semibold px-0.5 ring-1 bg-gray-200 ring-gray-400;
}
</style>
