<template>
  <div class="mx-auto w-11/12 lg:w-3/5">
    <div class="flex" :class="!getGuestStatus ? 'gap-4' : ''">
      <div class="flex flex-col space-y-1 flex-1 text-center">
        <button
          v-if="!getGuestStatus"
          class="flex justify-center bg-white px-2 py-1 border-2 border-gray-500"
          @click="signout"
        >
          <span>Logout</span>
        </button>
        <span class="text-xs">Get a new temp pseudonym</span>
      </div>
      <div class="flex flex-col space-y-1 flex-1 text-center">
        <button
          :disabled="getPseudonyms.length >= 5"
          class="flex justify-center bg-white px-2 py-1 border-2 border-gray-500 items-center gap-1"
          v-if="!getGuestStatus"
          @click="createPseudonym"
          :title="getNewPseudonymButtonTitle()"
        >
          <RefreshIcon class="h-5 w-5" /> new pseudonym
        </button>
        <span class="text-xs">Creates a new psuedonym on your account</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import store from "../../composables/global/useStore";
import { RefreshIcon } from "@heroicons/vue/outline";

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
