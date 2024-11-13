<template>
  <router-link :to="pollLink" :class="getPollClass(item)" @click="props.toggleThreadsMenu">
    <div class="flex-1 flex gap-1 truncate">
      <div class="font-semibold justify-self-end">
        <BookmarkIcon class="h-4 w-4 inline-block" />
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
import { BookmarkIcon } from '@heroicons/vue/outline'
import { LockClosedIcon } from '@heroicons/vue/solid'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''
const pollLink = computed(() => `${path}/channels/${route.params.channelId}/polls/${props.item.slug}`)

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
function getPollClass(item) {
  let className = 'px-4 flex items-center gap-2 justify-between py-1 text-gray-700 hover:bg-gray-300 cursor-pointer'
  if (props.item.slug === route.params.pollId) className += ' bg-gray-300'
  return className
}
</script>
