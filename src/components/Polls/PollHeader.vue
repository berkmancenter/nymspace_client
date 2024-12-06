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
            <button class="w-full text-left truncate" @click="openThreadModal">{{ poll.title }}</button>
          </h2>
          <p class="text-sm text-left">
            {{ poll.description }}
          </p>
          <div class="flex gap-2 mt-2">
            <div class="bg-red-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
              Threshold: {{ poll.threshold }}
            </div>
            <div v-if="poll.whenResultsVisible === 'thresholdAndExpiration'">
              <div v-if="!isExpired" class="bg-blue-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">
                Poll ends: {{ new Date(poll.expirationDate).toLocaleString() }}
                <!-- {{ expirationDate }} -->
              </div>
              <div v-else class="bg-gray-600 text-white rounded-full px-3 py-1 text-xs font-semibold">
                Poll ended
                <!-- {{ expirationDate }} -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="flex items-center gap-2">
        <DeleteThread :show="isAdmin" :item="poll" />
        <EditThread :show="isAdmin" :item="poll" />
      </div> -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ViewListIcon } from '@heroicons/vue/outline/'

const props = defineProps({
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

const isExpired = computed(() => new Date(props.poll.expirationDate) < new Date())
</script>
