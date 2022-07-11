<template>
  <div class="bg-gray-200 pb-4 pt-4">
    <div class="text-center text-2xl pb-4 pt-4">
      Hello, [
      <select
        v-if="!getGuestStatus"
        v-model="activeToken"
        :disabled="getGuestStatus"
        class="bg-gray-200 text-red-500"
        @change="activateToken"
        id="pseudonymSelect"
      >
        <option
          v-for="pseudonym in getPseudonyms"
          class="text-red-500"
          :value="pseudonym.token"
        >
          {{ pseudonym.pseudonym }}
        </option>
      </select>
      <span v-else class="text-red-500">{{
        getActivePseudonym.pseudonym
      }}</span>
      ]
      <TrashIcon
        v-if="getPseudonyms.length > 1"
        class="h-5 w-5 inline-block cursor-pointer hover:text-red-500"
        title="Delete pseudonym"
        @click="openModal"
      />
      <RefreshIcon
        v-if="getGuestStatus"
        class="h-5 w-5 inline-block cursor-pointer hover:text-red-500"
        title="Get a new pseudonym"
        @click="refreshPseudonym"
      />, {{welcomeMessage}}
    </div>
    <component
      :is="
        getLoggedInStatus
          ? defineAsyncComponent(() => import('./LoggedInBanner.vue'))
          : defineAsyncComponent(() => import('./GuestBanner.vue'))
      "
      @login="registerOneTime"
      @create-pseudonym="adjustSelect"
    ></component>

    <Modal :is-open="isModalOpen" @close-modal="closeModal">
      <template v-slot:title>Delete Pseudonym</template>
      <div class="text-xl">Are you sure you want to delete pseudonym?</div>
      <div class="text-lg mt-3">
        Please select the pseudonym to delete
        <select
          v-model="pseudonymToDelete"
          class="bg-gray-200 text-red-500"
          id="pseudonymDelete"
          @change="message = ''"
        >
          <option disabled value="">Select Pseudonym</option>
          <option
            v-for="pseudonym in inactivePseudonyms"
            class="text-red-500"
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
      <div :class="isError ? 'text-red-500' : 'text-green-500'" class="mt-4">
        {{ message }}
      </div>
      <template v-slot:actions>
        <button class="btn success" @click="processDelete">Delete</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, computed, nextTick } from "vue";
import useStore from "../../composables/global/useStore";
import { defineAsyncComponent } from "@vue/runtime-core";
import { TrashIcon, RefreshIcon } from "@heroicons/vue/outline";
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

const activeToken = ref("");
const pseudonymToDelete = ref("");
const isModalOpen = ref(false);
const message = ref("");
const isError = ref(true);
const inactivePseudonyms = computed(() =>
  getPseudonyms.value.filter((x) => !x.active)
);
const welcomeMessage = ref();
const route = useRoute();

/**
 * watch route params and check if channelId is present
 * based on its presence update welcome message
 */
watch(
  () => route.params,
  async (params) => {
    if (params.hasOwnProperty('channelId')) {
      welcomeMessage.value = "Select a thread to begin messaging:"
    } else {
      welcomeMessage.value = "Select a channel to begin messaging:"
    }
  },
  {
    immediate: true
  }
);
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
    sel.style.width = `${+tempSelect.clientWidth + 4}px`;
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

<style scoped>
select#pseudonymDelete {
  @apply text-lg font-semibold ring-1 ring-red-500;
}
</style>
