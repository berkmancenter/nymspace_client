<template>
  <div
    class="flex-auto py-2 pl-4 shrink group hover:bg-gray-100"
    :class="item.hasDownvoted || item.hasUpvoted ? 'bg-yellow-50 hover:bg-yellow-100' : ''"
  >
    <div class="relative flex items-center justify-between px-1 text-sm">
      <div style="max-width: 92%" class="">
        <div v-linkified class="thread-message" :class="getMessageClass(item)" :title="item.createdAt">
          <div class="font-bold" @click="addToMessage(item.pseudonym)">
            {{ item.pseudonym || item.owner }}
            <span v-if="item.owner === userId" class="font-thin">(you) </span>
            <span class="font-thin text-gray">
              {{
                new Date(item.createdAt)
                  .toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  .split(',')
                  .join(' at ')
              }}</span
            >
          </div>
          <div v-html="formattedBody"></div>
        </div>
      </div>
      <div
        v-if="showVoting && item.owner !== userId"
        class="ml-2 opacity-0 group-hover:opacity-100 bg-white rounded border -top-4 right-2 px-3 py-0.5 absolute flex items-center gap-2"
      >
        <div v-if="isVoting">
          <svg class="w-5 h-5 text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <div v-if="!isVoting && !item.hasDownvoted" class="flex items-center" :class="getUpVoteClass(item)">
          <ChevronUpIcon
            class="w-4 h-4"
            :class="!getActiveThread.locked && (item.canVote || item.hasUpvoted) ? 'cursor-pointer' : 'pointer-events-none'"
            @click="_upvote(item)"
          />
        </div>
        <div
          v-if="!isVoting && !getGuestStatus && !item.hasUpvoted"
          class="flex items-center"
          :class="getDownVoteClass(item)"
        >
          <ChevronDownIcon
            class="w-4 h-4"
            :class="
              !getActiveThread.locked && (item.canVote || item.hasDownvoted) && !getGuestStatus.value && item.goodReputation
                ? 'cursor-pointer'
                : 'pointer-events-none'
            "
            @click="_downvote(item)"
          />
        </div>
      </div>
    </div>
    <div v-if="item.upVotes.length || item.downVotes.length" class="flex mt-1 mb-1 ml-1 text-gray-500">
      <div
        v-if="item.upVotes.length"
        class="flex items-center gap-1 px-2 py-1 mr-1 rounded-full bg-blue-50 ring-1 ring-blue-200"
      >
        <ChevronUpIcon class="w-3 h-3" /><span class="text-xs">{{ item.upVotes.length }}</span>
      </div>
      <div
        v-if="item.downVotes.length"
        class="flex items-center gap-1 px-2 py-1 mr-1 rounded-full bg-blue-50 ring-1 ring-blue-200"
      >
        <ChevronDownIcon class="w-3 h-3" /><span class="text-xs">{{ item.downVotes.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/outline'
import { ref, computed } from 'vue'
import useStore from '../../composables/global/useStore'

const { upvote, downvote, getGuestStatus, getActiveChannel, getActiveThread } = useStore

const isVoting = ref(false)

async function _upvote(item) {
  let complete = false
  const checkComplete = setInterval(() => {
    isVoting.value = true
    if (complete) {
      isVoting.value = false
      clearInterval(checkComplete)
    }
  }, 400)

  await upvote(item.id, !item.hasUpvoted)
  complete = true
}

async function _downvote(item) {
  isVoting.value = true
  await downvote(item.id, !item.hasDownvoted)
  isVoting.value = false
}

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})

const emits = defineEmits(['tag-click'])

const showVoting = computed(() => getActiveChannel.value && getActiveChannel.value.votingAllowed)

function checkOwner(votes, id, className) {
  if (votes && votes.length > 0) {
    // someone has voted, so turn black
    className = 'text-black'
    for (let i = 0; i < votes.length; i++) {
      if (votes[i].owner && votes[i].owner === id) {
        // current user has voted, so turn red
        className = 'text-harvard-red'
        break
      }
    }
  } else {
    // nobody has voted, so turn gray
    className += ' text-gray-300'
  }
  return className
}

function getUpVoteClass(item) {
  const className = !getActiveThread.value.locked && item.canVote ? 'hover:text-gray-500' : ''
  return checkOwner(item.upVotes, useStore.getId.value, className)
}

function getDownVoteClass(item) {
  const className =
    !getActiveThread.value.locked && item.canVote && !getGuestStatus.value && item.goodReputation
      ? 'hover:text-gray-500'
      : ''
  return checkOwner(item.downVotes, useStore.getId.value, className)
}

// emit to update message in messagespage
function addToMessage(pseudonym) {
  emits('tag-click', pseudonym, true)
}

function getMessageClass(item) {
  return item.downVotes.length > 2 ? 'text-gray-400' : 'text-black'
}

/**
 * Build html tag for tagged pseudonym
 */
function getFormattedTag(tag) {
  return `<span class='tag'>@${/@"([A-Za-z0-9\s]+)"/g.exec(tag)[1]}</span>`
}

/**
 * Search for all pseudonym tags and format them
 */
const formattedBody = computed(() => {
  const regex = /(@\"[A-Za-z0-9\s]+\")/g
  let matches = []
  let tempStr = props.item.body
  while ((matches = regex.exec(props.item.body)) !== null) {
    tempStr = tempStr.replace(matches[0], getFormattedTag(matches[0]))
  }
  return tempStr
})
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
.linkified {
  text-decoration: underline;
  color: blue;
}
</style>
