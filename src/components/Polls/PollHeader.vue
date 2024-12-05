<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-white shadow sm:rounded-r shrink">
    <div class="flex justify-between gap-6 p-2 bg-white border-b rounded-tl shadow-sm sm:pl-5">
      <div class="flex">
        <!-- Small screen menu toggler -->
        <button class="sm:hidden" @click="toggleSideMenu">
          <ViewListIcon class="w-6 text-black h-7" />
        </button>

        <!-- Poll details -->
        <div class="flex flex-col pl-4 sm:p-0">
          <h2 class="text-lg text-left font-thin truncate">
            <button class="w-full text-left truncate" @click="openThreadModal">What should we do this afternoon?</button>
          </h2>
          <p class="text-sm text-left" :class="{ 'line-clamp-2': !showFullDescription }">
            {{ description }}
          </p>
          <button v-if="isLongDescription" class="text-blue-500 text-sm" @click="showFullDescription = !showFullDescription">
            {{ showFullDescription ? 'hide' : 'show more' }}
          </button>
          <div class="flex gap-2 mt-2">
            <div class="bg-red-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
              Threshold: 5
              <!-- {{ threshold }} -->
            </div>
            <div v-if="false" class="bg-blue-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
              Poll ends: Friday, November 22, 12:00 PM (ET)
              <!-- {{ expirationDate }} -->
            </div>
            <div v-else class="bg-gray-600 text-white rounded-full px-3 py-1 text-xs font-semibold">
              Poll ended
              <!-- {{ expirationDate }} -->
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <DeleteThread :show="isAdmin" :item="poll" />
        <EditThread :show="isAdmin" :item="poll" />
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DeleteThread from '../Threads/DeleteThread.vue'
import EditThread from '../Threads/EditThread.vue'
import { ViewListIcon } from '@heroicons/vue/outline/'

defineProps({
  poll: {
    type: Object,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  toggleSideMenu: {
    type: Function,
    required: true
  }
})

const showFullDescription = ref(false)
const description = `It's our last afternoon in New York! How should we spend it? I really love rambling, so I'll keep this
description long. Really, really long. I mean, it's just a poll, but I want to make sure it's clear what I'm
asking.`

const isLongDescription = computed(() => description.length > 125)
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
