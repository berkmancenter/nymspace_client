<template>
  <teleport to="body">
    <div v-if="isOpen" class="modal">
      <div class="modal-content">
        <div class="my-3 text-xl"><slot name="title">Modal Title</slot></div>
        <div class="flex-grow py-3"><slot>Modal Body</slot></div>
        <div class="flex justify-end my-3 gap-4">
          <slot name="actions"><button @click="closeModal"></button></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close-modal"]);

function closeModal() {
  emit("close-modal");
}
</script>

<style>
body.modal-open {
  @apply overflow-y-hidden;
}

.modal {
  @apply absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50;
}

.modal-content {
  @apply px-6 py-2 bg-white divide-y divide-gray-500 h-72 max-h-80 w-2/5 flex flex-col justify-evenly;
}
</style>
