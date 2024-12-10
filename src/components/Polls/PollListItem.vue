<template>
  <router-link :to="pollLink" :class="getPollClass(item)" @click="props.toggleSideMenu">
    <div class="flex-1 flex gap-1 truncate">
      <div class="font-semibold justify-self-end">
        <UserGroupIcon class="h-4 w-4 inline-block" />
      </div>
      <div class="font-semibold justify-self-end" data-testid="unlock-thread">
        <LockClosedIcon v-if="item.locked" class="h-4 w-4 inline-block" @click="unlockThread" />
      </div>
      <div class="text-base truncate">
        {{ item.title }}
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { UserGroupIcon } from '@heroicons/vue/outline'
import { LockClosedIcon } from '@heroicons/vue/solid'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''

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

const pollLink = computed(() => `${path}/channels/${route.params.channelId}/polls/${props.item._id}`)

function getPollClass(item) {
  let className = 'px-2 flex items-center gap-2 justify-between py-1 text-gray-700 hover:bg-gray-300 cursor-pointer'
  if (props.item._id === route.params.pollId) className += ' bg-gray-300'
  return className
}
</script>
