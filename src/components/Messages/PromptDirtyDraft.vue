<template>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template v-slot:title>Draft will be lost.</template>
    <div class="font-semibold">
      <p>Are you sure you want to leave?</p>
      <p>Your thread draft will be lost.</p>
    </div>
    <template v-slot:actions>
      <button class="btn success" @click="emit('response', true)">Yes</button>
      <button class="btn error" @click="emit('response', false)">No</button>
    </template>
  </Modal>
</template>

<script setup>
import { TrashIcon } from "@heroicons/vue/outline";
import { ref } from "@vue/reactivity";
import { watch } from "vue";
import Modal from "../Shared/Modal.vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["response"]);

const isModalOpen = ref(false);

watch(
  () => props.show,
  async (val) => {
    if (val) {
      window.scrollTo({ top: 0, left: 0 });
      document.querySelector("body").classList.add("modal-open");
      isModalOpen.value = true;
    } else {
      document.querySelector("body").classList.remove("modal-open");
      isModalOpen.value = false;
    }
  }
);

function closeModal() {}

function openModal() {}
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
