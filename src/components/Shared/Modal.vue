<template>
  <teleport to="body">
    <div v-if="isOpen" class="modal">
      <div class="modal-content">
        <div
          class="my-3 text-2xl bg-red-500 p-2 font-semibold text-white rounded"
        >
          <slot name="title">Modal Title</slot>
          <XIcon
            class="float-right h-6 w-6 inline-block cursor-pointer"
            title="Close"
            @click="closeModal"
          />
        </div>
        <div class="flex-grow py-3"><slot>Modal Body</slot></div>
        <div class="flex justify-end my-3 gap-4">
          <slot name="actions"><button @click="closeModal"></button></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { XIcon } from "@heroicons/vue/outline";

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
  @apply px-6 py-2 bg-white divide-y divide-gray-500 w-2/5 flex flex-col justify-evenly;
}
.btn {
  @apply w-20 my-2 bg-white border-2 border-gray-500 text-lg h-10 leading-3 hover:text-white cursor-pointer;
}

.btn.success {
  @apply hover:bg-green-500;
}

.btn.error {
  @apply hover:bg-red-500;
}
</style>
