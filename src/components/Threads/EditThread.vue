<template>
  <button
    v-if="show"
    @click.prevent="openModal"
    title="Edit Thread"
    data-testid="edit-thread"
    class="flex gap-2 justify-start items-center"
  >
    <PencilIcon
      class="h-4 w-4 inline-block hover:text-black hover:fill-current rounded cursor-pointer"
    />
    <span class="sr-only">Edit</span>
  </button>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template v-slot:title>Edit Thread</template>
    <span class="font-semibold">Thread name:</span>
    <div>
      <input
        v-model="threadName"
        class="border rounded border-gray-500 w-full h-12 px-3 text-lg login-form-field"
        type="text"
      />
    </div>
    <div>
      <input
        v-model="locked"
        type="checkbox"
        id="lockThread"
        class="cursor-pointer w-4 h-4 mr-2 align-middle"
        data-testid="lock-thread"
      /><label class="cursor-pointer font-semibold" for="lockThread"
        >Lock Thread</label
      >
    </div>
    <div class="text-harvard-red">{{ message }}</div>
    <template v-slot:actions>
      <button
        class="rounded bg-gray-300 px-2 py-2 font-semibold shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        class="rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="processUpdate"
        data-testid="update-thread"
      >
        Update
      </button>
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
