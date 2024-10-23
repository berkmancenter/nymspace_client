<template>
  <router-link :to="threadLink" :class="getThreadClass(item)" @click="props.toggleThreadsMenu">
    <div class="flex flex-1 gap-1 truncate">
      <div class="font-semibold justify-self-end">
        <BookmarkIcon
          :class="item.isFollowed ? 'fill-current text-harvard-red' : ''"
          class="inline-block w-4 h-4"
          @click.prevent="pinThread"
        />
      </div>
      <div class="font-semibold justify-self-end" data-testid="unlock-thread">
        <LockClosedIcon v-if="item.locked" class="inline-block w-4 h-4" @click="unlockThread" />
      </div>
      <div class="text-base truncate">
        {{ item.name }}
      </div>
    </div>
    <div class="text-sm font-thin justify-self-end">
      {{ new Intl.NumberFormat('en-US').format(item.messageCount) }}
      <ChatAltIcon class="inline-block w-4 h-4" />
    </div>
  </router-link>
</template>

<script setup>
import { ChatAltIcon, BookmarkIcon } from '@heroicons/vue/outline'
import { LockClosedIcon } from '@heroicons/vue/solid'
import { computed } from 'vue'
import useStore from '../../composables/global/useStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const { followThread, updateThread } = useStore

const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''
const threadLink = computed(() => `${path}/channels/${route.params.channelId}/threads/${props.item.id}`)

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  toggleThreadsMenu: {
    type: Function,
    required: false
  }
})
function getThreadClass(item) {
  let className = 'px-4 flex items-center gap-2 justify-between py-1 text-gray-700 hover:bg-gray-300 cursor-pointer'
  if (props.item.id === route.params.threadId) className += ' bg-gray-300'
  return className
}

function pinThread() {
  followThread({
    status: !props.item.isFollowed,
    threadId: props.item.id
  })
}

async function unlockThread() {
  const payload = {
    id: props.item._id ?? props.item.id,
    locked: false
  }

  updateThread(payload)
}
</script>
