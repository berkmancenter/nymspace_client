<template>
  <button
    v-if="show"
    @click.prevent="openModal"
    title="Delete Thread"
    class="border-2 border-gray-500 h-10 w-12 mt-4 ml-2 hover:bg-gray-200"
  >
    <TrashIcon
      class="h-6 w-6 inline-block text-red-500 rounded cursor-pointer"
    />
  </button>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template v-slot:title>Delete Thread</template>
    <div class="font-semibold">
      Are you sure you want to delete thread
      <span class="text-red-500">{{ item.name }}</span> ?
    </div>
    <div class="text-red-500 mt-4">{{ message }}</div>
    <template v-slot:actions>
      <button class="btn success" @click="processDelete">Delete</button>
      <button class="btn error" @click="closeModal">Cancel</button>
    </template>
  </Modal>
</template>

<script setup>
import { TrashIcon } from "@heroicons/vue/outline";
import { ref } from "@vue/reactivity";
import Modal from "../Shared/Modal.vue";
import useStore from "../../composables/global/useStore";
import { useRouter } from "vue-router";

const { deleteThread, getActiveThread, setActiveThread, getActiveChannel } =
  useStore;

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["delete-thread"]);
const router = useRouter();

const isModalOpen = ref(false);
const message = ref("");

async function processDelete() {
  await deleteThread(getActiveThread.value._id ?? getActiveThread.value.id)
    .then((x) => {
      router.push({
        name: "home.channels",
        params: {
          channelId: getActiveChannel.value.id,
        },
      });
      setActiveThread(null);
      closeModal();
    })
    .catch((err) => {
      message.value = err.response.data.message;
    });
}

function closeModal() {
  document.querySelector("body").classList.remove("modal-open");
  isModalOpen.value = false;
}

function openModal() {
  message.value = "";
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
