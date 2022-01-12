<template>
  <button
    @click="openModal"
    class="w-full text-center float-left inline-block border-2 border-gray-500 text-lg px-10 h-10 mt-4 leading-9 hover:bg-gray-100"
  >
    Create new thread
  </button>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template v-slot:title>Create New Thread</template>
    <span class="font-semibold">Thread name:</span>
    <div>
      <input
        v-model="threadName"
        class="rounded border-2 border-gray-500 w-full h-12 px-3 text-xl my-1"
        type="text"
      />
    </div>
    <div class="text-red-500">{{ message }}</div>
    <template v-slot:actions>
      <button class="btn success" @click="processCreate">Create</button>
      <button class="btn error" @click="closeModal">Cancel</button>
    </template>
  </Modal>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import useStore from "../../composables/global/useStore";
import Modal from "../Shared/Modal.vue";
import { useRoute } from "vue-router";
const { createThread } = useStore;
const isModalOpen = ref(false);
const threadName = ref("");
const message = ref("");
const route = useRoute();
function closeModal() {
  document.querySelector("body").classList.remove("modal-open");
  isModalOpen.value = false;
}

function openModal() {
  threadName.value = "";
  window.scrollTo({ top: 0, left: 0 });
  isModalOpen.value = true;
  document.querySelector("body").classList.add("modal-open");
}

function processCreate() {
  if (isFormValid()) {
    createThread({
      name: threadName.value,
      topicId: route.params.channelId,
    })
      .then((x) => closeModal())
      .catch((err) => (message.value = err.response.data.message));
  } else {
    message.value = "Name is required";
  }
}

function isFormValid() {
  return threadName.value.trim().length > 0;
}
</script>
