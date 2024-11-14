<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-white shadow sm:rounded-r shrink">
    <div class="flex justify-between gap-6 p-2 bg-white border-b rounded-tl shadow-sm h-11 sm:pl-5">
      <div class="flex gap-2 truncate">
        <button class="sm:hidden" @click="toggleThreadsMenu">
          <ViewListIcon class="w-6 text-black h-7" />
        </button>
        <h2 class="text-lg font-thin truncate threads-title">
          <button class="w-full truncate" @click="openThreadModal">poll name</button>
        </h2>
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
  toggleThreadsMenu: {
    type: Function,
    required: false,
    default: () => {}
  }
})
</script>

<style></style>
