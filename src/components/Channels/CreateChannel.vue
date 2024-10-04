<template>
  <select
    v-if="getLoggedInStatus && !getGuestStatus"
    v-model="channelType"
    class="rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
    @change="openModal"
  >
    <option disabled selected value="">Create New Channel</option>
    <option value="public">Public</option>
    <option value="private">Private</option>
  </select>
  <Modal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>Create {{ channelTypeName }} Channel</template>
    <span class="font-semibold">Channel name:</span>
    <div>
      <input
        v-model="channelName"
        class="w-full h-12 px-3 mt-4 text-lg border border-gray-500 rounded login-form-field"
        type="text"
        placeholder="Enter channel name"
      />
    </div>
    <div class="mt-2">
      <input
        id="disableVoting"
        v-model="disableVoting"
        type="checkbox"
        class="w-4 h-4 mr-2 align-middle cursor-pointer"
      /><label class="font-semibold cursor-pointer" for="disableVoting">Disable voting</label>
      <input
        id="disableThreadCreation"
        v-model="disableThreadCreation"
        type="checkbox"
        class="w-4 h-4 ml-8 mr-2 align-middle cursor-pointer"
      /><label class="font-semibold cursor-pointer" for="disableThreadCreation">Disable thread creation</label>
    </div>
    <div class="p-4 mt-8 text-yellow-700 rounded-md bg-yellow-50">
      <div class="font-semibold text-yellow-800">Reminder:</div>
      <div class="mb-4">
        Channels remain on the Threads interface for 90 days after their last use. At that time, channel owners can be
        emailed a reminder, offering the option for the channel to permanently remain on the interface. Enter an email
        address that will receive that reminder (optional):
      </div>
      <div class="font-semibold text-yellow-800">
        Email address:
        <input
          id="email"
          v-model="email"
          type="text"
          placeholder="Optional"
          class="w-full h-12 px-3 text-lg border border-gray-500 rounded login-form-field"
        />
      </div>
    </div>
    <div class="text-harvard-red">{{ message }}</div>
    <div v-show="!isEmailValid" class="w-full mt-5 text-harvard-red">* Please enter a valid email address</div>
    <template #actions>
      <button
        class="px-2 py-2 font-semibold bg-gray-300 rounded shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="closeModal"
      >
        Cancel
      </button>
      <button
        class="px-2 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="processCreate"
      >
        Create
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { computed, ref } from '@vue/reactivity'
import useStore from '../../composables/global/useStore'
import Modal from '../Shared/Modal.vue'
const { getLoggedInStatus, createChannel, getGuestStatus, loadUser } = useStore

const isModalOpen = ref(false)
const channelType = ref('')
const channelName = ref('')
const disableVoting = ref(false)
const disableThreadCreation = ref(false)
const email = ref('')
const message = ref('')

const channelTypeName = computed(() => channelType.value[0].toUpperCase() + channelType.value.slice(1))

const isEmailValid = computed(() => {
  if (!email.value || email.value.trim().length === 0) return true
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)
})

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
  channelType.value = ''
}

async function openModal() {
  const user = await loadUser()
  channelName.value = ''
  disableVoting.value = false
  disableThreadCreation.value = false
  email.value = user.email || ''
  window.scrollTo({ top: 0, left: 0 })
  isModalOpen.value = true
  document.querySelector('body').classList.add('modal-open')
}

function processCreate() {
  if (isFormValid()) {
    const payload = {
      name: channelName.value,
      private: channelType.value === 'private',
      votingAllowed: !disableVoting.value,
      threadCreationAllowed: !disableThreadCreation.value,
      archivable: true,
      archiveEmail: email.value
    }

    createChannel(payload)
      .then((x) => closeModal())
      .catch((err) => (message.value = err.response.data.message))
  } else {
    message.value = 'Name is required'
  }
}

function isFormValid() {
  return (channelName.value.trim().length > 0) & isEmailValid.value
}
</script>
