<template>
  <teleport to="body">
    <!-- Background and position -->
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <!-- Modal body -->
      <div
        class="bg-white flex flex-col rounded-lg shadow-lg max-h-screen w-full sm:w-11/12 md:w-3/4 lg:w-1/2 overflow-hidden"
      >
        <!-- Modal header -->
        <div class="my-3 text-2xl py-1 font-semibold flex justify-between items-center px-4">
          <slot name="title">Modal Title</slot>
          <XIcon class="h-6 w-6 inline-block cursor-pointer" title="Close" @click="closeModal" />
        </div>
        <!-- Dynamic fixed content (non scrolling)-->
        <div><slot name="fixed-content"></slot></div>
        <!-- Dynamic content -->
        <div class="px-4 py-2 overflow-y-auto flex-grow"><slot>Modal Body</slot></div>
        <!-- Action buttons -->
        <div class="flex justify-end my-3 gap-4 px-4">
          <slot name="actions"><button @click="closeModal"></button></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { XIcon } from '@heroicons/vue/outline'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close-modal'])

function closeModal() {
  emit('close-modal')
}
</script>
