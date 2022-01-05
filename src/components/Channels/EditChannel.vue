<template>
  <PencilIcon
    v-if="show"
    class="h-6 w-6 inline-block border group-hover:bg-gray-300 border-gray-100 group-hover:border-black rounded"
    @click.prevent="openModal"
  />
  <Modal :is-open="isModalOpen">
    <template v-slot:title>Edit Channel</template>
    <span class="font-semibold">Channel name:</span>
    <div>
      <input
        v-model="channelName"
        class="rounded border-2 border-gray-500 w-full h-12 px-3 text-xl my-1"
        type="text"
      />
    </div>
    <div>
      <input
        v-model="enableVoting"
        type="checkbox"
        id="disableVoting"
        class="cursor-pointer w-4 h-4 mr-2 align-middle"
      /><label class="cursor-pointer font-semibold" for="disableVoting"
        >Disable voting</label
      >
    </div>
    <div class="mt-8 ring-2 ring-gray-500 rounded-sm px-2 py-1 ring-opacity-50">
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
const { updateChannel, getGuestStatus, loadUser, updateUser } = useStore;

const isModalOpen = ref(false);
const channelName = ref("");
const enableVoting = ref(false);
const email = ref("");
const message = ref("");

const isEmailValid = computed(() => {
  if (email.value.trim().length == 0) return true;
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
  const user = await fetchDetails();
  channelName.value = props.item.name;
  enableVoting.value = props.item.votingAllowed;
  email.value = user.email;
  window.scrollTo({ top: 0, left: 0 });
  isModalOpen.value = true;
  document.querySelector("body").classList.add("modal-open");
}

function isNameValid() {
  return channelName.value.trim().length > 0;
}

async function processUpdate() {
  if (isFormValid()) {
    if (email.value.trim().length > 0) {
      await updateUser({
        email: email.value,
      });
    }
    updateChannel({
      id: props.item.id,
      name: channelName.value,
      votingAllowed: enableVoting.value,
      archivable: true,
    })
      .then((x) => closeModal())
      .catch((err) => (message.value = err.response.data.message));
  } else if (!isNameValid()) {
    message.value = "Name is required";
  }
}

async function fetchDetails() {
  return await loadUser();
}

function isFormValid() {
  return isNameValid() & isEmailValid.value;
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
