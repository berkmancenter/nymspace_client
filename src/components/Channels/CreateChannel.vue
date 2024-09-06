<template>
  <select
    v-model="channelType"
    @change="openModal"
    class="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
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
        class="border rounded border-gray-500 w-full h-12 px-3 text-lg mt-4 login-form-field"
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
    <div class="mt-8 rounded-md bg-yellow-50 p-4 text-yellow-700">
      <div class="font-semibold text-yellow-800">Reminder:</div>
      <div class="mb-4">
        Channels remain on the Threads interface for 90 days after their last
        use. At that time, channel owners can be emailed a reminder, offering
        the option for the channel to permanently remain on the interface. Enter
        an email address that will receive that reminder (optional):
      </div>
      <div class="font-semibold text-yellow-800">
        Email address:
        <input
          v-model="email"
          type="text"
          id="email"
          placeholder="Optional"
          class="border rounded border-gray-500 w-full h-12 px-3 text-lg login-form-field"
        />
      </div>
    </div>
    <div class="text-harvard-red">{{ message }}</div>
    <div v-show="!isEmailValid" class="text-harvard-red mt-5 w-full">
      * Please enter a valid email address
    </div>
    <template v-slot:actions>
      <button
        @click="closeModal"
        class="rounded bg-gray-300 px-2 py-2 font-semibold shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      >
        Cancel
      </button>
      <button
        class="rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="processCreate"
      >
        Create
      </button>
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
