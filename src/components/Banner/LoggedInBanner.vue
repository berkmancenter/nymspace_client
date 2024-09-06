<template>
  <button
    :disabled="getPseudonyms.length >= 5"
    v-if="!getGuestStatus && getPseudonyms.length < 5"
    @click="createPseudonym"
    :title="getNewPseudonymButtonTitle()"
    class="flex gap-2 items-center"
  >
    <PlusCircleIcon class="w-4 h-4" />
    New pseudonym
  </button>
  <div
    v-if="getPseudonyms.length == 5"
    class="flex gap-2 items-center text-gray-400"
  >
    <PlusCircleIcon class="w-4 h-4" /> limit reached
  </div>
  <button
    v-if="!getGuestStatus"
    @click="signout"
    class="flex gap-2 items-center"
  >
    <LogoutIcon class="h-4 w-4" /> Logout
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import store from "../../composables/global/useStore";
import {
  LogoutIcon,
  PlusCircleIcon,
  RefreshIcon,
} from "@heroicons/vue/outline";

const emit = defineEmits(["create-pseudonym"]);
const router = useRouter();
const { logout, getGuestStatus, createNewPseudonym, getPseudonyms } = store;

async function signout() {
  logout();
  router.push({ name: "home.channelspage" });
}

/**
 * Go to login page from guest session
 * Logout guest user and pass current page
 * so the after loggin in, app can navigate
 * to same page
 */
function loginViaGuest() {
  router.push({
    name: "home.login",
    query: {
      to: router.currentRoute.value.path,
    },
  });
}

async function createPseudonym() {
  await createNewPseudonym();
  emit("create-pseudonym");
}

function getNewPseudonymButtonTitle() {
  if (getPseudonyms.value.length >= 5)
    return "Maximum of five pseudonyms reached.";
  return "";
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
