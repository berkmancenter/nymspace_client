<template>
  <router-link :to="threadLink" :class="getThreadClass(item)" @click="props.toggleSideMenu">
    <div class="flex flex-1 gap-1 truncate">
      <div class="font-semibold justify-self-end">
        <ChatIcon :class="item.isFollowed ? 'fill-current text-harvard-red' : ''" class="inline-block w-4 h-4" />
      </div>
      <div class="font-semibold justify-self-end" data-testid="unlock-thread">
        <LockClosedIcon v-if="item.locked" class="inline-block w-4 h-4" @click="unlockThread" />
      </div>
      <div class="text-base truncate">
        {{ item.name }}
      </div>
    </div>
    <div class="text-sm font-thin justify-self-end">
      {{ new Intl.NumberFormat('en-US').format(item.messageCount ? item.messageCount : item.messages.length) }}
      <ChatAltIcon class="inline-block w-4 h-4" />
    </div>
  </router-link>
</template>

<script setup>
import { ChatIcon, ChatAltIcon } from '@heroicons/vue/outline'
import { LockClosedIcon } from '@heroicons/vue/solid'
import { computed } from 'vue'
import useStore from '../../composables/global/useStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const { updateThread } = useStore

const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''
const threadLink = computed(() => `${path}/channels/${route.params.channelId}/threads/${props.item.id}`)

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  toggleSideMenu: {
    type: Function,
    required: true
  }
})
function getThreadClass(item) {
  let className = 'px-2 flex items-center gap-2 justify-between py-1 text-gray-700 hover:bg-gray-300 cursor-pointer'
  if (props.item.id === route.params.threadId) className += ' bg-gray-300'
  return className
}

async function unlockThread() {
  const payload = {
    id: props.item._id ?? props.item.id,
    locked: false
  }

  updateThread(payload)
}
</script>
