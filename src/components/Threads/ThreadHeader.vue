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
        <div v-if="isThreadOwner" class="relative">
          <button
            @click="toggleExportMenu"
            class="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            <DownloadIcon class="w-4 h-4" />
            Export
            <ChevronDownIcon class="w-3 h-3" />
          </button>

          <div class="fixed inset-0 z-10" :class="showExportMenu ? '' : 'hidden'" @click="showExportMenu = false">
            <div
              class="absolute right-0 z-0 mt-1 bg-white rounded-md shadow-lg w-36"
              :style="{ top: exportMenuPosition.top + 'px', right: exportMenuPosition.right + 'px' }"
              @click.stop
            >
              <div v-if="exporting" class="px-4 py-2 text-sm text-gray-500">Exporting...</div>
              <div class="py-1" v-else>
                <button
                  @click="exportThread('docx')"
                  class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  :disabled="exporting"
                >
                  Export Docx
                </button>
                <button
                  @click="exportThread('csv')"
                  class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  :disabled="exporting"
                >
                  Export CSVs
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          v-if="isAdmin && thread.hitTheButton"
          class="flex items-center justify-start gap-2 p-1 text-white bg-gray-500 text-sm rounded-md shadow-md"
          @click="reveal"
        >
          The Button
        </button>
        <DeleteThread :show="isAdmin" :item="thread" />
        <EditThread :show="isAdmin" :item="thread" />
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
import { ref, computed } from 'vue'
import ThemedModal from '../Shared/ThemedModal.vue'
import DeleteThread from './DeleteThread.vue'
import EditThread from './EditThread.vue'
import { ViewListIcon, DownloadIcon, ChevronDownIcon } from '@heroicons/vue/outline/'
import useStore from '../../composables/global/useStore'
import api from '../../service'

const props = defineProps({
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
  isAdmin: {
    type: Boolean,
    required: true
  }
})

const isThreadModalOpen = ref(false)
const showExportMenu = ref(false)
const exporting = ref(false)
const exportMenuPosition = ref({ top: 0, right: 0 })
const { revealHitTheButtonHiddenMessages, getId } = useStore

const isThreadOwner = computed(() => {
  return props.thread.owner && props.thread.owner.toString() === getId.value
})

function openThreadModal() {
  document.querySelector('body').classList.add('modal-open')
  isThreadModalOpen.value = true
}

function closeThreadModal() {
  document.querySelector('body').classList.remove('modal-open')
  isThreadModalOpen.value = false
}

function reveal() {
  revealHitTheButtonHiddenMessages(props.thread.id)
}

function toggleExportMenu(event) {
  if (!showExportMenu.value) {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    exportMenuPosition.value = {
      top: rect.bottom + window.scrollY,
      right: window.innerWidth - rect.right + window.scrollX
    }
  }
  showExportMenu.value = !showExportMenu.value
}

async function exportThread(format) {
  exporting.value = true
  showExportMenu.value = false

  try {
    await api.exportThread(props.thread.id, format)
  } catch (error) {
    console.error('Failed to export thread:', error)
    let errorMessage = 'Failed to export thread. '

    if (error.code === 'ECONNABORTED') {
      errorMessage += 'The request timed out. The thread might be too large to export.'
    } else if (error.response?.status === 403) {
      errorMessage += 'You do not have permission to export this thread.'
    } else if (error.response?.status === 404) {
      errorMessage += 'Thread not found.'
    } else {
      errorMessage += 'Please try again later.'
    }

    alert(errorMessage)
  } finally {
    exporting.value = false
  }
}
</script>

<style></style>
