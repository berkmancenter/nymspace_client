<template>
  <div class="flex justify-between items-center px-1 text-sm hover:bg-gray-100">
    <div>
      <p
        class="thread-message"
        :class="getMessageClass(item)"
        :title="item.createdAt"
      >
        <b @click="addToMessage(item.pseudonym)">{{
          item.pseudonym || item.owner
        }}</b
        >: <span v-html="formattedBody"></span>
      </p>
    </div>
    <div v-if="showVoting">
      <div class="flex items-center -mb-2.5" :class="getUpVoteClass(item)">
        <ChevronUpIcon
          @click="upvote(item.id, !item.hasUpvoted)"
          class="h-5 w-5"
          :class="
            item.canVote || item.hasUpvoted
              ? 'cursor-pointer'
              : 'pointer-events-none'
          "
        /><span class="text-sm font-bold">{{ item.upVotes.length }}</span>
      </div>
      <div class="flex items-center" :class="getDownVoteClass(item)">
        <ChevronDownIcon
          @click="downvote(item.id, !item.hasDownvoted)"
          class="h-5 w-5"
          :class="
            (item.canVote || item.hasDownvoted) &&
            !getGuestStatus.value &&
            item.goodReputation
              ? 'cursor-pointer'
              : 'pointer-events-none'
          "
        /><span class="text-sm font-bold">{{ item.downVotes.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/outline";
import { computed } from "vue";

import useStore from "../../composables/global/useStore";

const { upvote, downvote, getGuestStatus, getActiveChannel } = useStore;

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["tag-click"]);

const showVoting = computed(
  () => getActiveChannel.value && getActiveChannel.value.votingAllowed
);

function checkOwner(votes, id, className) {
  if (votes && votes.length > 0) {
    // someone has voted, so turn black
    className = "text-black";
    for (let i = 0; i < votes.length; i++) {
      if (votes[i].owner && votes[i].owner == id) {
        // current user has voted, so turn red
        className = "text-red-500";
        break;
      }
    }
  } else {
    // nobody has voted, so turn gray
    className += " text-gray-300";
  }
  return className;
}

function getUpVoteClass(item) {
  let className = item.canVote ? "hover:text-gray-500" : "";
  return checkOwner(item.upVotes, useStore.getId.value, className);
}

function getDownVoteClass(item) {
  let className =
    item.canVote && !getGuestStatus.value && item.goodReputation
      ? "hover:text-gray-500"
      : "";
  return checkOwner(item.downVotes, useStore.getId.value, className);
}

// emit to update message in messagespage
function addToMessage(pseudonym) {
  emits("tag-click", pseudonym, true);
}

function getMessageClass(item) {
  return item.downVotes.length > 2 ? "text-gray-400" : "text-black";
}

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
  stroke-width: 3px;
}
</style>

<style>
.thread-message b {
  @apply cursor-pointer;
}
.tag {
  @apply font-bold mx-0.5;
}
</style>
