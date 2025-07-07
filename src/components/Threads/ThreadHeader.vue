<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-white shadow sm:rounded-r shrink">
    <div
      class="flex flex-wrap justify-between gap-2 p-2 bg-white border-b rounded-tl shadow-sm min-h-[2.75rem] sm:flex-nowrap sm:pl-5"
    >
      <div class="flex gap-2 truncate">
        <button class="sm:hidden" @click="toggleSideMenu">
          <ViewListIcon class="w-6 text-black h-7" />
        </button>
        <h2 class="text-lg font-thin truncate threads-title">
          {{ thread.name }}
        </h2>
      </div>
      <div class="flex items-center gap-2 ml-auto">
        <div v-if="isThreadOwner" class="flex items-center gap-2 flex-wrap">
          <button
            v-if="!thread.hiddenMessageMode"
            class="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            @click="toggleHiddenMessageMode"
          >
            <EyeOffIcon class="w-4 h-4" />
            Start hidden message
          </button>

          <button
            v-if="thread.hiddenMessageMode && hiddenMessageCount === 0"
            class="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            @click="leaveHiddenMessageMode"
          >
            <EyeIcon class="w-4 h-4" />
            Stop hidden messages
          </button>

          <button
            v-if="thread.hiddenMessageMode && hiddenMessageCount > 0"
            class="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            @click="openRevealModal"
          >
            <EyeIcon class="w-4 h-4" />
            Reveal ({{ hiddenMessageCount }})
          </button>
        </div>

        <div v-if="isChannelOwner" class="relative">
          <button
            class="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            @click="toggleExportMenu"
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
              <div v-else class="py-1">
                <button
                  class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  :disabled="exporting"
                  @click="exportThread('docx')"
                >
                  Export Docx
                </button>
                <button
                  class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                  :disabled="exporting"
                  @click="exportThread('csv')"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <DeleteThread :show="isAdmin" :item="thread" />
        <EditThread :show="isAdmin" :item="thread" />
      </div>
    </div>
    <router-view></router-view>
  </div>

  <ThemedModal :is-open="isRevealModalOpen" @close-modal="closeRevealModal">
    <template #title>Reveal Hidden Messages</template>
    <div>Are you sure you want to reveal all hidden messages in this thread? This will also exit hidden message mode.</div>
    <div v-if="hiddenMessageCount > 0" class="mt-2 text-sm text-gray-600">
      There {{ hiddenMessageCount === 1 ? 'is' : 'are' }} {{ hiddenMessageCount }} hidden message{{
        hiddenMessageCount === 1 ? '' : 's'
      }}
      that will be revealed.
    </div>
    <div class="mt-4 text-harvard-red">{{ revealError }}</div>
    <template #actions>
      <button
        class="px-2 py-2 font-semibold bg-gray-300 rounded shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeRevealModal"
      >
        Cancel
      </button>
      <button
        class="px-2 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="confirmReveal"
      >
        Reveal Messages
      </button>
    </template>
  </ThemedModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import ThemedModal from '../Shared/ThemedModal.vue'
import DeleteThread from './DeleteThread.vue'
import EditThread from './EditThread.vue'
import { ViewListIcon, DownloadIcon, ChevronDownIcon, EyeIcon, EyeOffIcon } from '@heroicons/vue/outline/'
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

const showExportMenu = ref(false)
const exporting = ref(false)
const exportMenuPosition = ref({ top: 0, right: 0 })
const isRevealModalOpen = ref(false)
const revealError = ref('')

const { getId, getMessages, updateThread, revealHiddenMessageModeMessages } = useStore

const isChannelOwner = computed(() => {
  return props.channel.owner && props.channel.owner.toString() === getId.value
})

const isThreadOwner = computed(() => {
  return props.thread.owner && props.thread.owner.toString() === getId.value
})

const hiddenMessageCount = computed(() => {
  if (!props.thread.hiddenMessageMode) return 0

  return getMessages.value.filter((msg) => {
    const isHidden = msg.hiddenMessageModeHidden === true || msg.body === null || msg.body === '[Message hidden]'
    const isFromFacilitator =
      msg.owner === props.channel.owner ||
      msg.userId === props.channel.owner ||
      msg.owner?.toString() === props.channel.owner?.toString() ||
      msg.userId?.toString() === props.channel.owner?.toString()

    return isHidden && !isFromFacilitator
  }).length
})

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
      errorMessage += 'You do not have permission to export this thread. Only channel owners can export threads.'
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

async function toggleHiddenMessageMode() {
  await updateThread({
    id: props.thread._id ?? props.thread.id,
    hiddenMessageMode: true
  })
}

async function leaveHiddenMessageMode() {
  await updateThread({
    id: props.thread._id ?? props.thread.id,
    hiddenMessageMode: false
  })
}

function openRevealModal() {
  revealError.value = ''
  isRevealModalOpen.value = true
}

function closeRevealModal() {
  isRevealModalOpen.value = false
}

async function confirmReveal() {
  await revealHiddenMessageModeMessages(props.thread.id || props.thread._id)
  await updateThread({
    id: props.thread._id ?? props.thread.id,
    hiddenMessageMode: false
  })

  closeRevealModal()
}
</script>

<style></style>
