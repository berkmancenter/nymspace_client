<template>
  <div class="shrink flex-auto group hover:bg-gray-100 py-1">
    <div class="flex justify-between items-center px-1 text-sm relative">
      <div style="max-width: 92%" class="">
        <p
          class="thread-message"
          :class="getMessageClass(item)"
          :title="item.createdAt"
        >
          <div @click="addToMessage(item.pseudonym)" class="font-bold">
            {{ item.pseudonym || item.owner }}
            <span v-if="item.owner === userId" class="font-thin">(you) </span>
            <span class="text-gray font-thin"> {{ new Date(item.createdAt).toLocaleString("en-US", {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit'}).split(",").join(" at ") }}</span>
          </div>
          <div v-html="formattedBody"></div>
        </p>
      </div>
      <div
        v-if="showVoting && item.owner !== userId"
        class="ml-2 opacity-0 group-hover:opacity-100 bg-white rounded border  -top-4 right-2 px-3 py-0.5 absolute flex items-center gap-2"
      >
        <div class="flex items-center" :class="getUpVoteClass(item)">
          <ChevronUpIcon
            @click="upvote(item.id, !item.hasUpvoted)"
            class="h-5 w-5"
            :class="
              !getActiveThread.locked && (item.canVote || item.hasUpvoted)
                ? 'cursor-pointer'
                : 'pointer-events-none'
            "
          />
        </div>
        <div
          v-if="!getGuestStatus"
          class="flex items-center"
          :class="getDownVoteClass(item)"
        >
          <ChevronDownIcon
            @click="downvote(item.id, !item.hasDownvoted)"
            class="h-5 w-5"
            :class="
              !getActiveThread.locked &&
              (item.canVote || item.hasDownvoted) &&
              !getGuestStatus.value &&
              item.goodReputation
                ? 'cursor-pointer'
                : 'pointer-events-none'
            "
          />
        </div>
      </div>
    </div>
    <div
      v-if="item.upVotes.length || item.downVotes.length"
      class="text-gray-500 flex ml-1 mt-1 mb-1"
    >
      <div
        v-if="item.upVotes.length"
        class="mr-1 flex gap-1 items-center bg-blue-50 ring-1 ring-blue-200 rounded-full px-2 py-1"
      >
        <ChevronUpIcon class="h-3 w-3" /><span class="text-xs">{{
          item.upVotes.length
        }}</span>
      </div>
      <div
        v-if="item.downVotes.length"
        class="mr-1 flex gap-1 items-center bg-gray-100 ring-1 ring-blue-200 rounded-full px-2 py -1"
      >
        <ChevronDownIcon class="h-3 w-3" /><span class="text-xs">{{
          item.downVotes.length
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/vue/outline";
import { computed } from "vue";

import useStore from "../../composables/global/useStore";

const { upvote, downvote, getGuestStatus, getActiveChannel, getActiveThread } =
  useStore;

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  userId: {
    type: String,
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
  let className =
    !getActiveThread.value.locked && item.canVote ? "hover:text-gray-500" : "";
  return checkOwner(item.upVotes, useStore.getId.value, className);
}

function getDownVoteClass(item) {
  let className =
    !getActiveThread.value.locked &&
    item.canVote &&
    !getGuestStatus.value &&
    item.goodReputation
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
.thread-message {
  @apply overflow-hidden;
  text-overflow: ellipsis;
}
.thread-message b {
  @apply cursor-pointer;
}
.tag {
  @apply font-bold mx-0.5;
}
</style>
