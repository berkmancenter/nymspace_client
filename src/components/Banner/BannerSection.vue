<template>
  <div class="flex justify-end flex-1 w-full gap-4">
    <div class="relative inline-block w-full mt-1 text-left">
      <div div class="flex items-center justify-end w-full gap-2">
        <div v-if="!getGuestStatus" class="flex items-center justify-end w-full gap-3">
          <select
            id="pseudonymSelect"
            v-model="activeToken"
            :disabled="getGuestStatus"
            class="shadow rounded-md border-0 py-0.5 pl-1 pr-1 text-gray-900 ring-0 border-b-1 ring-inset ring-gray-300 focus:ring-0 sm:text-sm sm:leading-6"
            @change="activateToken"
          >
            <option v-for="pseudonym in getPseudonyms" :key="pseudonym.token" :value="pseudonym.token">
              {{ pseudonym.pseudonym }}
            </option>
          </select>
        </div>
        <div v-if="getGuestStatus">
          {{ getActivePseudonym.pseudonym }}
        </div>
        <button id="menu-button" type="button" class="" aria-expanded="true" aria-haspopup="true" @click="toggleMenu">
          <DotsVerticalIcon class="w-5" />
        </button>
      </div>

      <div class="fixed inset-0 z-10" :class="menuOpen ? '' : 'hidden'" @click="menuOpen = false">
        <div
          class="absolute z-0 w-56 mt-10 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg right-2 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div role="none">
            <div class="p-2 mt-2 space-y-2" role="none">
              <router-link
                v-if="getGuestStatus"
                :to="`${path}/login`"
                class="flex items-center gap-2 text-black"
                title="Retain a pseudonym across sessions"
              >
                <LoginIcon class="w-4 h-4" />
                Login</router-link
              >
              <!-- <button
                v-if="getPseudonyms.length > 1"
                @click="openModal"
                class="flex items-center gap-2"
              >
                <TrashIcon
                  class="inline-block w-4 h-4 cursor-pointer"
                  title="Delete pseudonym"
                />
                Delete pseudonym
              </button> -->

              <button v-if="getGuestStatus" class="flex items-center gap-2" @click="refreshPseudonym">
                <RefreshIcon
                  class="inline-block w-4 h-4 cursor-pointer hover:text-harvard-red"
                  title="Get a new pseudonym"
                />
                New pseudonym
              </button>

              <component
                :is="
                  getLoggedInStatus
                    ? defineAsyncComponent(() => import('./LoggedInBanner.vue'))
                    : defineAsyncComponent(() => import('./GuestBanner.vue'))
                "
                @create-pseudonym="adjustSelect"
              ></component>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <ThemedModal :is-open="isModalOpen" @close-modal="closeModal">
      <template v-slot:title>Delete Pseudonym</template>
      <div class="text-xl">Are you sure you want to delete pseudonym?</div>
      <div class="mt-3 text-lg">
        Please select the pseudonym to delete
        <select
          v-model="pseudonymToDelete"
          class="shadow rounded-md border-0 py-0.5 pl-1 pr-1 text-gray-900 ring-0 border-b-1 ring-inset ring-gray-300 focus:ring-0 sm:text-sm sm:leading-6"
          id="pseudonymDelete"
          @change="message = ''"
        >
          <option disabled value="">Select Pseudonym</option>
          <option
            v-for="pseudonym in inactivePseudonyms"
            :value="pseudonym._id"
          >
            {{ pseudonym.pseudonym }}
          </option>
        </select>
      </div>
      <div class="mt-4 text-xs">
        If you want to delete the active pseudonym, please activate other
        pseudonym first and come back here.
      </div>
      <div
        :class="isError ? 'text-harvard-red' : 'text-green-500'"
        class="mt-4"
      >
        {{ message }}
      </div>
      <template v-slot:actions>
        <button
          @click="processDelete"
          class="px-2 py-2 font-semibold text-white bg-gray-600 rounded shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          Delete
        </button>
      </template>
    </ThemedModal> -->
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import useStore from '../../composables/global/useStore'
import { defineAsyncComponent } from '@vue/runtime-core'
import { RefreshIcon, LoginIcon, DotsVerticalIcon } from '@heroicons/vue/outline'

const {
  getLoggedInStatus,
  getPseudonyms,
  getActivePseudonym,
  registerOnce,
  getGuestStatus,
  loadNewPseudonym,
  activatePseudonym
} = useStore

const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : ''
const activeToken = ref('')
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

async function refreshPseudonym() {
  await loadNewPseudonym()
  await registerOnce()
  adjustSelect()
}

function adjustSelect() {
  nextTick(() => {
    if (getPseudonyms.value.length > 0) {
      activeToken.value = getActivePseudonym.value?.token || ''
    }
  })
}

async function activateToken() {
  if (activeToken.value) {
    await activatePseudonym(activeToken.value)
  }
}
</script>
