<template>
  <button v-if="show" class="flex items-center gap-x-0.5 rounded-md py-1 hover:text-gray-900" @click.prevent="openModal">
    <PencilIcon class="w-4 h-4" />
    <span class="sr-only">Edit</span>
  </button>
  <ThemedModal :is-open="isModalOpen" @close-modal="closeModal">
    <template #title>Edit Channel</template>
    <span class="font-semibold">Channel name:</span>
    <div>
      <input
        v-model="channelName"
        class="w-full h-12 px-3 mt-4 text-lg border border-gray-500 rounded login-form-field"
        type="text"
      />
    </div>
    <div>
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
        Cancel</button
      ><button
        class="px-2 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        @click="processUpdate"
      >
        Update
      </button>
    </template>
  </ThemedModal>
</template>

<script setup>
import { PencilIcon } from '@heroicons/vue/outline'
import { computed, ref } from '@vue/reactivity'
import useStore from '../../composables/global/useStore'
import ThemedModal from '../Shared/ThemedModal.vue'
const { updateChannel } = useStore

const isModalOpen = ref(false)
const channelName = ref('')
const disableVoting = ref(false)
const disableThreadCreation = ref(false)
const email = ref('')
const message = ref('')

const isEmailValid = computed(() => {
  if (!email.value || email.value.trim().length === 0) return true
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)
})

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    required: true
  }
})

function closeModal() {
  document.querySelector('body').classList.remove('modal-open')
  isModalOpen.value = false
}

async function openModal() {
  channelName.value = props.item.name
  disableVoting.value = !props.item.votingAllowed
  disableThreadCreation.value = !props.item.threadCreationAllowed
  email.value = props.item.archiveEmail
  window.scrollTo({ top: 0, left: 0 })
  isModalOpen.value = true
  document.querySelector('body').classList.add('modal-open')
}

function isNameValid() {
  return channelName.value.trim().length > 0
}

async function processUpdate() {
  if (isFormValid()) {
    const payload = {
      id: props.item.id,
      name: channelName.value,
      votingAllowed: !disableVoting.value,
      threadCreationAllowed: !disableThreadCreation.value,
      archivable: true,
      archiveEmail: email.value
    }

    updateChannel(payload)
      .then((x) => closeModal())
      .catch((err) => (message.value = err.response.data.message))
  } else if (!isNameValid()) {
    message.value = 'Name is required'
  }
}

function isFormValid() {
  return isNameValid() & isEmailValid.value
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
  @apply hover:bg-harvard-red;
}
</style>
