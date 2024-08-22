<template>
  <div class="flex w-full justify-end flex-1 gap-4">
    <div class="relative inline-block text-left mt-1 w-full">
      <div div class="flex items-center justify-end gap-2 w-full">
        <div
          v-if="!getGuestStatus"
          class="w-full gap-3 flex justify-end items-center"
        >
          <RefreshIcon class="h-4 w-4" />
          <select
            v-model="activeToken"
            :disabled="getGuestStatus"
            class="shadow rounded-md border-0 py-0.5 pl-1 pr-1 text-gray-900 ring-0 border-b-1 ring-inset ring-gray-300 focus:ring-0 sm:text-sm sm:leading-6"
            @change="activateToken"
            id="pseudonymSelect"
          >
            <option v-for="pseudonym in getPseudonyms" :value="pseudonym.token">
              {{ pseudonym.pseudonym }}
            </option>
          </select>
        </div>
        <div v-if="getGuestStatus">
          {{ getActivePseudonym.pseudonym }}
        </div>
        <button
          type="button"
          class=""
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          @click="toggleMenu"
        >
          <DotsVerticalIcon class="w-5" />
        </button>
      </div>

      <div
        class="fixed inset-0 z-10"
        @click="menuOpen = false"
        :class="menuOpen ? '' : 'hidden'"
      >
        <div
          class="absolute right-2 z-0 mt-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div role="none">
            <div class="mt-2 p-2 space-y-2" role="none">
              <router-link
                :to="`${path}/login`"
                v-if="getGuestStatus"
                class="text-black flex gap-2 items-center"
                title="Retain a pseudonym across sessions"
              >
                <LoginIcon class="w-4 h-4" />
                Login</router-link
              >
              <button
                v-if="getPseudonyms.length > 1"
                @click="openModal"
                class="flex gap-2 items-center"
              >
                <TrashIcon
                  class="h-4 w-4 inline-block cursor-pointer"
                  title="Delete pseudonym"
                />
                Delete pseudonym
              </button>

              <button
                v-if="getGuestStatus"
                @click="refreshPseudonym"
                class="flex gap-2 items-center"
              >
                <RefreshIcon
                  class="h-4 w-4 inline-block cursor-pointer hover:text-harvard-red"
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

    <Modal :is-open="isModalOpen" @close-modal="closeModal">
      <template v-slot:title>Delete Pseudonym</template>
      <div class="text-xl">Are you sure you want to delete pseudonym?</div>
      <div class="text-lg mt-3">
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
      <div class="text-xs mt-4">
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
          class="rounded bg-gray-600 px-2 py-2 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
        >
          Delete
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed, nextTick } from "vue";
import useStore from "../../composables/global/useStore";
import { defineAsyncComponent } from "@vue/runtime-core";
import {
  TrashIcon,
  RefreshIcon,
  LoginIcon,
  DotsVerticalIcon,
} from "@heroicons/vue/outline";
import Modal from "../Shared/Modal.vue";
import { useRoute } from "vue-router";

const {
  getLoggedInStatus,
  getPseudonyms,
  getActivePseudonym,
  registerOnce,
  getGuestStatus,
  loadNewPseudonym,
  activatePseudonym,
  loadPseudonyms,
  deletePseudonym,
} = useStore;

const path = import.meta.env.VITE_PATH ? import.meta.env.VITE_PATH : "";
const activeToken = ref("");
const pseudonymToDelete = ref("");
const isModalOpen = ref(false);
const message = ref("");
const isError = ref(true);
const inactivePseudonyms = computed(() =>
  getPseudonyms.value.filter((x) => !x.active)
);
const menuOpen = ref(false);
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

/**
 * watch route params and check if channelId is present
 * based on its presence update welcome message
 */

async function registerOneTime() {
  await registerOnce();
}

function openModal() {
  pseudonymToDelete.value = "";
  message.value = "";
  document.querySelector("body").classList.add("modal-open");
  isModalOpen.value = true;
}

async function refreshPseudonym() {
  await loadNewPseudonym();
  await registerOnce();
  adjustSelect();
}

function closeModal() {
  document.querySelector("body").classList.remove("modal-open");
  isModalOpen.value = false;
}

/**
 * Delete pseudonym, validate pseudonym is
 * selected
 * Call delete API and update message as well
 * as show error if any
 */
async function processDelete() {
  isError.value = true;
  if (pseudonymToDelete.value.trim().length === 0) {
    message.value = "Please select a pseudonym.";
    return;
  }
  message.value = "";
  await deletePseudonym(pseudonymToDelete.value)
    .then(async () => {
      await loadPseudonyms();
      pseudonymToDelete.value = "";
      message.value = "Pseudonym deleted.";
      isError.value = false;
    })
    .catch(
      () => (message.value = "Unable to delete pseudonym. Please try again.")
    );
}

async function activateToken() {
  await activatePseudonym(activeToken.value);
  adjustSelect();
}

function adjustSelect() {
  // Adject select tag width when select tag is visible on DOM
  if (!getGuestStatus.value) {
    let sel = document.getElementById("pseudonymSelect");
    let tempOption = document.createElement("option");
    tempOption.textContent = sel.selectedOptions[0].textContent;
    let tempSelect = document.createElement("select");
    tempSelect.style.visibility = "hidden";
    tempSelect.style.position = "fixed";
    tempSelect.appendChild(tempOption);
    sel.after(tempSelect);
    tempSelect.remove();
  }
}

/**
 * handling logout case to update activeToken
 */
watch(
  () => getActivePseudonym.value?.token,
  (val, prevVal) => {
    if (val !== prevVal && val !== activeToken.value) {
      activeToken.value = val;
    }
  }
);

onMounted(async () => {
  if (getLoggedInStatus.value && !getGuestStatus.value) {
    await loadPseudonyms();
  }
  activeToken.value = getActivePseudonym.value?.token;
  nextTick(() => {
    adjustSelect();
  });
});
</script>
