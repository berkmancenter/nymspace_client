<template>
  <button
    v-if="show"
    @click.prevent="openModal"
    title="Edit Thread"
    class="border-2 border-gray-500 h-10 w-12 mt-4 ml-2 hover:bg-gray-200"
  >
    <PencilIcon
      class="h-6 w-6 inline-block hover:text-black hover:fill-current rounded cursor-pointer"
    />
  </button>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template v-slot:title>Edit Thread</template>
    <span class="font-semibold">Thread name:</span>
    <div>
      <input
        v-model="threadName"
        class="rounded border-2 border-gray-500 w-full h-12 px-3 text-xl my-1"
        type="text"
      />
    </div>
    <div>
      <input
        v-model="locked"
        type="checkbox"
        id="lockThread"
        class="cursor-pointer w-4 h-4 mr-2 align-middle"
      /><label class="cursor-pointer font-semibold" for="lockThread"
        >Lock Thread</label
      >
    </div>
    <div class="text-red-500">{{ message }}</div>
    <template v-slot:actions>
      <button class="btn success" @click="processUpdate">Update</button>
      <button class="btn error" @click="closeModal">Cancel</button>
    </template>
  </Modal>
</template>

<script setup>
import { PencilIcon } from "@heroicons/vue/outline";
import { computed, ref } from "@vue/reactivity";
import useStore from "../../composables/global/useStore";
import Modal from "../Shared/Modal.vue";
const { updateThread, getGuestStatus } = useStore;

const isModalOpen = ref(false);
const threadName = ref("");
const locked = ref(false);
const email = ref("");
const message = ref("");

const isEmailValid = computed(() => {
  if (!email.value || email.value.trim().length == 0) return true;
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value);
});

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
});

function closeModal() {
  document.querySelector("body").classList.remove("modal-open");
  isModalOpen.value = false;
}

async function openModal() {
  message.value = "";
  threadName.value = props.item.name;
  locked.value = props.item.locked;
  window.scrollTo({ top: 0, left: 0 });
  isModalOpen.value = true;
  document.querySelector("body").classList.add("modal-open");
}

function isNameValid() {
  return threadName.value.trim().length > 0;
}

async function processUpdate() {
  if (isFormValid()) {
    let payload = {
      id: props.item._id ?? props.item.id,
      locked: locked.value,
      name: threadName.value,
    };

    updateThread(payload)
      .then((x) => closeModal())
      .catch((err) => {
        message.value = err.response.data.message;
      });
  } else if (!isNameValid()) {
    message.value = "Name is required";
  }
}

function isFormValid() {
  return isNameValid();
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
