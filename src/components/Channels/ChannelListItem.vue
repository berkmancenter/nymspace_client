<template>
  <div>
    <router-link v-slot="{ navigate }" custom :to="channelLink">
      <li
        :class="getChannelClass(item)"
        class="flex items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap px-2"
        @click="navigate"
      >
        <div class="flex gap-1 items-start">
          <BookmarkIcon
            :class="item.isFollowed ? 'fill-current' : ''"
            class="h-4 4 inline-block cursor-pointer hover:text-black hover:stroke-current"
            @click.prevent="pinChannel"
          />
          <div>
            <p class="text-sm font-semibold leading-3 text-gray-900 flex gap-2 items-center">
              {{ item.name }}
              <LockClosedIcon v-if="isPrivate(item)" class="h-4 w-4" />
            </p>

            <div class="flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p>
                Last updated
                <time :datetime="item.latestMessageCreatedAt">{{
                  new Date(item.latestMessageCreatedAt).toLocaleDateString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }}</time>
              </p>
            </div>
          </div>
        </div>
      </li>
    </router-link>
  </div>
</template>

<script setup>
import { LockClosedIcon, BookmarkIcon } from '@heroicons/vue/outline'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import useStore from '../../composables/global/useStore'

const { followChannel } = useStore

const route = useRoute()
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

function getChannelClass(item) {
  let className = 'hover:bg-gray-100 cursor-default'
  if (item.name === route.params.channelId) className += ' bg-gray-100'
  return className
}

function isPrivate(item) {
  return Object.keys(item).includes('private') && item.private
}

const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''
const channelLink = computed(() => `${path}/channels/${props.item.id}/`)

function pinChannel() {
  followChannel({
    status: !props.item.isFollowed,
    topicId: props.item.id
  })
}
</script>
