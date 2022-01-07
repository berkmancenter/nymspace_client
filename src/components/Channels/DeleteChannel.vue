<template>
  <TrashIcon
    v-if="show"
    class="h-6 w-6 inline-block hover:text-black hover:fill-current rounded cursor-pointer"
    @click.prevent="openModal"
  />
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template v-slot:title>Delete Channel</template>
    <div class="font-semibold">
      Are you sure you want to delete channel
      <span class="text-red-500">{{ name }}</span> ?
    </div>
    <template v-slot:actions>
      <button class="btn success" @click="emit('delete-channel')">
        Delete
      </button>
      <button class="btn error" @click="closeModal">Cancel</button>
    </template>
  </Modal>
</template>

<script setup>
import { TrashIcon } from "@heroicons/vue/outline";
import { ref } from "@vue/reactivity";
import Modal from "../Shared/Modal.vue";

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["delete-channel"]);

const isModalOpen = ref(false);

function closeModal() {
  document.querySelector("body").classList.remove("modal-open");
  isModalOpen.value = false;
}

function openModal() {
  window.scrollTo({ top: 0, left: 0 });
  document.querySelector("body").classList.add("modal-open");
  isModalOpen.value = true;
}
</script>

<style scoped>
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
