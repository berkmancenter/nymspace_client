<template>
    <div class="relative">
    <span
      v-if="!isInHiddenMode && canEnterHiddenMode"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 px-3 py-1 text-xs text-white bg-harvard-red rounded cursor-pointer hover:bg-red-700 whitespace-nowrap"
      @click="enterHiddenMode"
    >
      <EyeOffIcon class="inline w-3 h-3 mr-1" />
      Enter Hidden Message Mode
    </span>

    <span
      v-if="isInHiddenMode && canReveal"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 px-3 py-1 text-xs text-white bg-harvard-red rounded cursor-pointer hover:bg-red-700 whitespace-nowrap"
      @click="openRevealModal"
    >
      <EyeIcon class="inline w-3 h-3 mr-1" />
      Reveal Hidden Messages
      <span v-if="hiddenMessageCount > 0" class="ml-1">
        ({{ hiddenMessageCount }})
      </span>
    </span>
  </div>

  <ThemedModal :is-open="showRevealModal" @close-modal="closeRevealModal">
    <template #title>Confirm Reveal</template>
    <p class="text-gray-700">
      Are you sure you want to reveal all hidden messages? This action cannot be undone.
    </p>
    <p v-if="hiddenMessageCount > 0" class="mt-2 text-sm text-gray-600">
      There {{ hiddenMessageCount === 1 ? 'is' : 'are' }} {{ hiddenMessageCount }} hidden message{{ hiddenMessageCount === 1 ? '' : 's' }} that will be revealed.
    </p>
    <template #actions>
      <button
        class="px-4 py-2 font-semibold bg-gray-300 rounded shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeRevealModal"
      >
        Cancel
      </button>
      <button
        class="px-4 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="confirmReveal"
      >
        Reveal Messages
      </button>
    </template>
  </ThemedModal>
</template>

<script setup>
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/outline'
import { computed, ref } from 'vue'
import ThemedModal from '../Shared/ThemedModal.vue'

const props = defineProps({
  thread: {
    type: Object,
    required: true
  },
  isChannelOwner: {
    type: Boolean,
    default: false
  },
  isThreadOwner: {
    type: Boolean,
    default: false
  },
  messages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['enter-hidden-mode', 'reveal-messages'])

const isInHiddenMode = computed(() => props.thread?.hiddenMessageMode || false)

const canEnterHiddenMode = computed(() => {
  return !isInHiddenMode.value && (props.isChannelOwner || props.isThreadOwner)
})

const canReveal = computed(() => {
  return isInHiddenMode.value && (props.isChannelOwner || props.isThreadOwner)
})

const hiddenMessageCount = computed(() => {
  if (!props.messages || props.messages.length === 0) {
    return 0
  }

  // Count messages that have hiddenMessageMode = true
  return props.messages.filter(msg => msg.hiddenMessageMode === true).length
})

const showRevealModal = ref(false)

function enterHiddenMode() {
  emit('enter-hidden-mode')
}

function openRevealModal() {
  showRevealModal.value = true
}

function closeRevealModal() {
  showRevealModal.value = false
}

function confirmReveal() {
  emit('reveal-messages')
  closeRevealModal()
}
</script>