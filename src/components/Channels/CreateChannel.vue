<template>
  <select
    v-model="channelType"
    @change="openModal"
    class="border-2 border-gray-400 p-1"
    v-if="getLoggedInStatus && !getGuestStatus"
  >
    <option disabled selected value="">Create New Channel</option>
    <option value="public">Public</option>
    <option value="private">Private</option>
  </select>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template v-slot:title>Create {{ channelTypeName }} Channel</template>
    <span class="font-semibold">Channel name:</span>
    <div>
      <input
        v-model="channelName"
        class="rounded border-2 border-gray-500 w-full h-12 px-3 text-xl my-1"
        type="text"
        placeholder="Enter channel name"
      />
    </div>
    <div class="mt-2">
      <input
        v-model="disableVoting"
        type="checkbox"
        id="disableVoting"
        class="cursor-pointer w-4 h-4 mr-2 align-middle"
      /><label class="cursor-pointer font-semibold" for="disableVoting"
        >Disable voting</label
      >
      <input
        v-model="disableThreadCreation"
        type="checkbox"
        id="disableThreadCreation"
        class="cursor-pointer w-4 h-4 ml-8 mr-2 align-middle"
      /><label class="cursor-pointer font-semibold" for="disableThreadCreation"
        >Disable thread creation</label
      >
    </div>
    <div
      class="mt-8 ring-2 ring-gray-500 rounded-sm px-2 py-1 ring-opacity-50 bg-gray-200"
    >
      <div class="font-semibold">Reminder:</div>
      <div class="mb-4">
        Channels remain on the Threads interface for 90 days after their last
        use. At that time, channel owners can be emailed a reminder, offering
        the option for the channel to permanently remain on the interface. Enter
        an email address that will receive that reminder (optional):
      </div>
      <div class="font-semibold">
        Email address:
        <input
          v-model="email"
          type="text"
          id="email"
          placeholder="Optional"
          class="rounded border-2 border-gray-500 w-full h-12 px-3 text-xl my-1"
        />
      </div>
    </div>
    <div class="text-red-500">{{ message }}</div>
    <div v-show="!isEmailValid" class="text-red-500 mt-5 w-full">
      * Please enter a valid email address
    </div>
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
const { getLoggedInStatus, createChannel, getGuestStatus, loadUser } = useStore;

const isModalOpen = ref(false);
const channelType = ref("");
const channelName = ref("");
const disableVoting = ref(false);
const disableThreadCreation = ref(false);
const email = ref("");
const message = ref("");

const channelTypeName = computed(
  () => channelType.value[0].toUpperCase() + channelType.value.slice(1)
);

const isEmailValid = computed(() => {
  if (!email.value || email.value.trim().length == 0) return true;
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value);
});

function closeModal() {
  document.querySelector("body").classList.remove("modal-open");
  isModalOpen.value = false;
  channelType.value = "";
}

async function openModal() {
  const user = await loadUser();
  channelName.value = "";
  disableVoting.value = false;
  disableThreadCreation.value = false;
  email.value = user.email || "";
  window.scrollTo({ top: 0, left: 0 });
  isModalOpen.value = true;
  document.querySelector("body").classList.add("modal-open");
}

function processCreate() {
  if (isFormValid()) {
    let payload = {
      name: channelName.value,
      private: channelType.value === "private",
      votingAllowed: !disableVoting.value,
      threadCreationAllowed: !disableThreadCreation.value,
      archivable: true,
      archiveEmail: email.value,
    };

    createChannel(payload)
      .then((x) => closeModal())
      .catch((err) => (message.value = err.response.data.message));
  } else {
    message.value = "Name is required";
  }
}

function isFormValid() {
  return (channelName.value.trim().length > 0) & isEmailValid.value;
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
