<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-white shadow sm:rounded-r shrink">
    <div class="flex justify-between gap-6 p-2 bg-white border-b rounded-tl shadow-sm h-11 sm:pl-5">
      <div class="flex gap-2 truncate">
        <button class="sm:hidden" @click="toggleSideMenu">
          <ViewListIcon class="w-6 text-black h-7" />
        </button>
        <h2 class="text-lg font-thin truncate threads-title">
          <button class="w-full truncate" @click="openThreadModal">
            {{ thread.name }}
          </button>
        </h2>
      </div>
      <div class="flex items-center gap-2">
        <DeleteThread :show="canEditDeleteThread" :item="thread" />
        <EditThread :show="canEditDeleteThread" :item="thread" />
      </div>
    </div>
    <router-view></router-view>
  </div>
  <ThemedModal :is-open="isThreadModalOpen" @close-modal="closeThreadModal">
    <template #title>{{ thread.name }}</template>
    <div class="text-xl">in the {{ channel.name }} channel</div>
    <div class="mt-3 text-lg">{{ thread.messageCount }} messages</div>
  </ThemedModal>
</template>

<script setup>
import { ref } from 'vue'
import ThemedModal from '../Shared/ThemedModal.vue'
import DeleteThread from './DeleteThread.vue'
import EditThread from './EditThread.vue'
import { ViewListIcon } from '@heroicons/vue/outline/'

defineProps({
  thread: {
    type: Object,
    required: true
  },
  channel: {
    type: Object,
    required: true
  },
  isThreadActive: {
    type: Boolean,
    required: true
  },
  toggleSideMenu: {
    type: Function,
    required: true
  },
  canEditDeleteThread: {
    type: Boolean,
    required: true
  }
})

const isThreadModalOpen = ref(false)

function openThreadModal() {
  document.querySelector('body').classList.add('modal-open')
  isThreadModalOpen.value = true
}

function closeThreadModal() {
  document.querySelector('body').classList.remove('modal-open')
  isThreadModalOpen.value = false
}
</script>

<style></style>
