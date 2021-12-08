<template>
  <select
    v-model="channelType"
    @change="openModal"
    class="border-2 border-gray-400 p-1"
    v-if="getLoggedInStatus()"
  >
    <option disabled selected value="">Create new channel</option>
    <option value="public">Public</option>
    <option value="private">Private</option>
  </select>
  <Modal :is-open="isModalOpen">
    <template v-slot:title>Create {{ channelTypeName }} Channel</template>
    Channel name:
    <div>
      <input
        v-model="channelName"
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
import { computed, ref } from "@vue/reactivity";
import useStore from "../../composables/global/useStore";
import Modal from "../Shared/Modal.vue";
const { getLoggedInStatus, createChannel } = useStore;

const isModalOpen = ref(false);
const channelType = ref("");
const channelName = ref("");
const message = ref("");

const channelTypeName = computed(
  () => channelType.value[0].toUpperCase() + channelType.value.slice(1)
);

function closeModal() {
  document.querySelector("body").classList.remove("modal-open");
  isModalOpen.value = false;
}

function openModal() {
  channelName.value = "";
  window.scrollTo({ top: 0, left: 0 });
  isModalOpen.value = true;
  document.querySelector("body").classList.add("modal-open");
}

function processCreate() {
  if (isFormValid()) {
    createChannel({ name: channelName.value })
      .then((x) => closeModal())
      .catch((err) => (message.value = err.response.data.message));
  } else {
    message.value = "Name is required";
  }
}

function isFormValid() {
  return channelName.value.trim().length > 0;
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
