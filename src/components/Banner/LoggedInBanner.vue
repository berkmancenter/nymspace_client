<template>
  <button
    v-if="!getGuestStatus && getPseudonyms.length < 5"
    :disabled="getPseudonyms.length >= 5"
    :title="getNewPseudonymButtonTitle()"
    class="flex gap-2 items-center"
    @click="createPseudonym"
  >
    <PlusCircleIcon class="w-4 h-4" />
    New pseudonym
  </button>
  <div v-if="getPseudonyms.length === 5" class="flex gap-2 items-center text-gray-400">
    <PlusCircleIcon class="w-4 h-4" /> limit reached
  </div>
  <router-link v-if="!getGuestStatus" :to="{ name: 'home.channelspage' }" class="flex gap-2 items-center">
    <ChatIcon class="h-4 w-4" /> Channels
  </router-link>
  <router-link v-if="!getGuestStatus" :to="{ name: 'home.settings' }" class="flex gap-2 items-center">
    <CogIcon class="h-4 w-4" /> Settings
  </router-link>
  <button v-if="!getGuestStatus" class="flex gap-2 items-center" @click="signout">
    <LogoutIcon class="h-4 w-4" /> Logout
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import store from '../../composables/global/useStore'
import { LogoutIcon, PlusCircleIcon, CogIcon, ChatIcon } from '@heroicons/vue/outline'

const emit = defineEmits(['create-pseudonym'])
const router = useRouter()
const { logout, getGuestStatus, createNewPseudonym, getPseudonyms } = store

async function signout() {
  logout()
  router.push({ name: 'home.channelspage' })
}

async function createPseudonym() {
  await createNewPseudonym()
  emit('create-pseudonym')
}

function getNewPseudonymButtonTitle() {
  if (getPseudonyms.value.length >= 5) return 'Maximum of five pseudonyms reached.'
  return ''
}
</script>

<style scoped>
.btn {
  @apply w-full bg-white border-2 border-gray-500 text-base h-16 leading-relaxed hover:bg-gray-200 cursor-pointer md:text-lg md:px-1;
}

.btn:disabled {
  @apply cursor-not-allowed bg-gray-200 text-black;
}
</style>
